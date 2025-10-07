import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { db } from '../firebase.js'
import { useAuth } from './AuthContext.jsx'
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore'
import { saveToLocal, getFromLocal } from '../utils/storage.js'

const PortfolioContext = createContext(null)

export const usePortfolio = () => {
    const ctx = useContext(PortfolioContext)
    if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
    return ctx
}

const keyForUser = (userId) => `pf_${userId}`
const keyTxForPortfolio = (userId, portfolioId) => `pf_${userId}_${portfolioId}_tx`

export const PortfolioProvider = ({ children }) => {
    const { currentUser } = useAuth()
    const [portfolios, setPortfolios] = useState([])
    const [transactionsByPortfolio, setTransactionsByPortfolio] = useState({})
    const userId = currentUser?.uid

    const ensureDefault = useCallback(async () => {
        if (!userId) return null
        const ref = doc(db, 'users', userId)
        const userSnap = await getDoc(ref)
        if (!userSnap.exists()) {
            await setDoc(ref, { createdAt: serverTimestamp() })
        }
        const pRef = doc(db, 'users', userId, 'portfolios', '1')
        const pSnap = await getDoc(pRef)
        if (!pSnap.exists()) {
            await setDoc(pRef, { 
                name: 'My Main Portfolio', 
                iconType: 'rocket', 
                gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                value: '$0.00', 
                createdAt: serverTimestamp(), 
                updatedAt: serverTimestamp() 
            })
        }
        return '1'
    }, [userId])

    const loadPortfolios = useCallback(async () => {
        if (!userId) return []
        await ensureDefault()
        const cached = getFromLocal(keyForUser(userId))
        if (cached) {
            setPortfolios(cached)
        }
        const colRef = collection(db, 'users', userId, 'portfolios')
        const q = query(colRef, orderBy('createdAt', 'asc'))
        const snap = await getDocs(q)
        const list = snap.docs.map(d => {
            const data = d.data()
            return {
                id: d.id,
                ...data,
                iconType: data.iconType || (d.id === '1' ? 'rocket' : 'wallet'),
                gradient: data.gradient || (d.id === '1' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : null),
                value: data.value || '$0.00'
            }
        })
        if (list.length) {
            setPortfolios(list)
            saveToLocal(keyForUser(userId), list)
        }
        return list
    }, [userId, ensureDefault])

    const getPortfolios = useCallback(async () => {
        if (!portfolios.length) {
            await loadPortfolios()
        }
        return portfolios
    }, [loadPortfolios, portfolios])

    const addPortfolio = useCallback(async (name, iconType = 'wallet', gradient = null) => {
        if (!userId) return null
        const colRef = collection(db, 'users', userId, 'portfolios')
        const payload = { name, iconType, gradient, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
        const ref = await addDoc(colRef, payload)
        const docSnap = await getDoc(ref)
        const newItem = { id: ref.id, ...(docSnap.exists() ? docSnap.data() : { name, iconType, gradient, createdAt: Date.now(), updatedAt: Date.now() }) }
        setPortfolios(prev => {
            const next = [...prev, newItem]
            saveToLocal(keyForUser(userId), next)
            return next
        })
        return newItem
    }, [userId])

    const getTransactions = useCallback(async (portfolioId) => {
        if (!userId || !portfolioId) return []
        const localKey = keyTxForPortfolio(userId, portfolioId)
        const cached = getFromLocal(localKey)
        if (cached) {
            setTransactionsByPortfolio(prev => ({ ...prev, [portfolioId]: cached }))
        }
        const colRef = collection(db, 'users', userId, 'portfolios', portfolioId, 'transactions')
        const q = query(colRef, orderBy('date', 'asc'))
        const snap = await getDocs(q)
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        if (list.length) {
            setTransactionsByPortfolio(prev => ({ ...prev, [portfolioId]: list }))
            saveToLocal(localKey, list)
        }
        return list
    }, [userId])

    const addTransaction = useCallback(async (portfolioId, tx) => {
        if (!userId || !portfolioId) return null
        const colRef = collection(db, 'users', userId, 'portfolios', portfolioId, 'transactions')
        const payload = {
            coinId: tx.coinId,
            type: tx.type,
            amount: tx.amount,
            priceAtPurchase: tx.priceAtPurchase,
            date: tx.date
        }
        const ref = await addDoc(colRef, payload)
        const newItem = { id: ref.id, ...payload }
        setTransactionsByPortfolio(prev => {
            const list = prev[portfolioId] || []
            const next = [...list, newItem]
            saveToLocal(keyTxForPortfolio(userId, portfolioId), next)
            return { ...prev, [portfolioId]: next }
        })
        return newItem
    }, [userId])

    const removeAssetTransactions = useCallback(async (portfolioId, coinId) => {
        if (!userId || !portfolioId || !coinId) {
            return
        }
        const colRef = collection(db, 'users', userId, 'portfolios', portfolioId, 'transactions')
        const q = query(colRef, orderBy('date', 'asc'))
        const snap = await getDocs(q)
        const batch = []
        snap.docs.forEach(doc => {
            const data = doc.data()
            if (data.coinId === coinId) {
                batch.push(doc.ref)
            }
        })
        if (batch.length > 0) {
            const deletePromises = batch.map(ref => deleteDoc(ref))
            await Promise.all(deletePromises)
            const remainingTxs = snap.docs
                .filter(doc => doc.data().coinId !== coinId)
                .map(doc => ({ id: doc.id, ...doc.data() }))
            setTransactionsByPortfolio(prev => {
                const next = { ...prev, [portfolioId]: remainingTxs }
                saveToLocal(keyTxForPortfolio(userId, portfolioId), remainingTxs)
                return next
            })
        }
    }, [userId])

    const computeStateFromTransactions = useCallback((txs) => {
        const assetsMap = {}
        const activities = []
        txs.forEach(t => {
            if (t.type === 'buy') {
                assetsMap[t.coinId] = assetsMap[t.coinId] || { name: t.coinId.toUpperCase(), symbol: t.coinId.toUpperCase(), amount: 0, value: 0, originalCost: 0 }
                assetsMap[t.coinId].amount += t.amount
                assetsMap[t.coinId].value += t.amount * t.priceAtPurchase
                assetsMap[t.coinId].originalCost += t.amount * t.priceAtPurchase
                activities.push({ id: t.id, type: 'buy', asset: t.coinId.toUpperCase(), amount: t.amount, value: `$${(t.amount * t.priceAtPurchase).toLocaleString()}`, numericValue: t.amount * t.priceAtPurchase, price: t.priceAtPurchase, timestamp: new Date(t.date).getTime(), time: '' })
            } else if (t.type === 'sell') {
                assetsMap[t.coinId] = assetsMap[t.coinId] || { name: t.coinId.toUpperCase(), symbol: t.coinId.toUpperCase(), amount: 0, value: 0, originalCost: 0 }
                const asset = assetsMap[t.coinId]
                const prevAmount = asset.amount || 0
                const reduceAmount = t.amount
                const currentOriginalCost = asset.originalCost || 0
                const costReduction = prevAmount > 0 ? (reduceAmount / prevAmount) * currentOriginalCost : 0
                asset.amount = Math.max(0, prevAmount - reduceAmount)
                asset.value = Math.max(0, asset.value - reduceAmount * t.priceAtPurchase)
                asset.originalCost = Math.max(0, currentOriginalCost - costReduction)
                activities.push({ id: t.id, type: 'sell', asset: t.coinId.toUpperCase(), amount: t.amount, value: `-$${(t.amount * t.priceAtPurchase).toLocaleString()}`, numericValue: -(t.amount * t.priceAtPurchase), price: t.priceAtPurchase, timestamp: new Date(t.date).getTime(), time: '' })
            }
        })
        const assets = Object.values(assetsMap)
        activities.sort((a,b) => b.timestamp - a.timestamp)
        return { assets, activities }
    }, [])

    useEffect(() => {
        if (userId) {
            loadPortfolios()
        }
    }, [userId])

    const value = useMemo(() => ({
        portfolios,
        transactionsByPortfolio,
        addPortfolio,
        getPortfolios,
        addTransaction,
        getTransactions,
        removeAssetTransactions,
        computeStateFromTransactions
    }), [portfolios, transactionsByPortfolio, addPortfolio, getPortfolios, addTransaction, getTransactions, removeAssetTransactions, computeStateFromTransactions])

    return (
        <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
    )
}

