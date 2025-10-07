import { usePortfolio } from '../contexts/PortfolioContext.jsx'
import React, { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Overview from './Overview.jsx'
import { PriceProvider } from '../contexts/PriceProvider.jsx'

function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { portfolios, getPortfolios, addPortfolio, addTransaction, getTransactions, removeAssetTransactions, computeStateFromTransactions } = usePortfolio()
    const [activePortfolio, setActivePortfolio] = useState({
        id: 1,
        name: 'My Main Portfolio',
        value: '$0.00',
        isActive: true,
        iconType: 'rocket',
        assets: [],
        activities: []
    })

    React.useEffect(() => {
        const p = portfolios && portfolios.length ? portfolios : []
        if (p.length === 0) return
        
        const savedActiveId = localStorage.getItem('activePortfolioId')
        const savedPortfolio = savedActiveId ? p.find(x => String(x.id) === savedActiveId) : null
        const defaultP = savedPortfolio || p.find(x => String(x.id) === '1') || p[0]
        
        if (defaultP) {
            setActivePortfolio(prev => ({ ...prev, ...defaultP, isActive: true }))
        }
    }, [portfolios])

    React.useEffect(() => {
        const run = async () => {
            const id = String(activePortfolio?.id || '1')
            if (!id) return
            const txs = await getTransactions(id)
            const computed = computeStateFromTransactions(txs)
            setActivePortfolio(prev => ({ ...prev, ...computed }))
        }
        run()
    }, [activePortfolio?.id])

    const handleCreatePortfolio = async (portfolioData) => {
        await addPortfolio(portfolioData.name, portfolioData.icon?.id || 'wallet', portfolioData.icon?.gradient)
        await getPortfolios()
    }

    const handlePortfolioClick = async (portfolioId) => {
        const selectedPortfolio = portfolios.find(p => p.id === portfolioId)
        if (!selectedPortfolio) return
        const txs = await getTransactions(String(portfolioId))
        const computed = computeStateFromTransactions(txs)
        setActivePortfolio({ ...selectedPortfolio, ...computed, isActive: true })
        localStorage.setItem('activePortfolioId', String(portfolioId))
    }

    const totalPortfolioValue = (portfolios || []).reduce((total, portfolio) => {
        const portfolioValue = portfolio.assets?.reduce((sum, asset) => sum + asset.value, 0) || 0
        return total + portfolioValue
    }, 0)

    const handleAddCoin = async (coinData) => {
        if (!activePortfolio) return

        const newAsset = {
            id: Date.now(),
            name: coinData.name,
            symbol: coinData.symbol,
            amount: coinData.amount,
            value: coinData.price * coinData.amount,
            originalCost: coinData.price * coinData.amount,
            change24h: coinData.change24h || 0,
            change7d: coinData.change7d || 0
        }

        let transactionType = 'buy'
        if (coinData.type === 'Buy') transactionType = 'buy'
        else if (coinData.type === 'Sell') transactionType = 'sell'
        else if (coinData.type === 'Transfer' && coinData.transferDirection === 'Transfer In') transactionType = 'transfer_in'
        else if (coinData.type === 'Transfer' && coinData.transferDirection === 'Transfer Out') transactionType = 'transfer_out'

        const numericValue = transactionType === 'sell' || transactionType === 'transfer_out' ? 
            -newAsset.value : newAsset.value

        const purchaseTimestamp = coinData.datePurchased ? new Date(coinData.datePurchased).getTime() : Date.now()
        
        const newActivity = {
            id: Date.now(),
            type: transactionType,
            asset: coinData.name,
            amount: coinData.amount,
            value: transactionType === 'sell' || transactionType === 'transfer_out' ? 
                `-$${newAsset.value.toLocaleString()}` : 
                `+$${newAsset.value.toLocaleString()}`,
            numericValue: numericValue,
            price: coinData.price,
            timestamp: purchaseTimestamp,
            time: 'Just now'
        }

        setActivePortfolio(prev => {
            if (!prev) return prev
            const updatedAssets = [...(prev.assets || [])]
            const idx = updatedAssets.findIndex(a => a.symbol === coinData.symbol || a.name === coinData.name)
            if (idx !== -1) {
                const existing = updatedAssets[idx]
                if (transactionType === 'buy' || transactionType === 'transfer_in') {
                    updatedAssets[idx] = {
                        ...existing,
                        amount: (existing.amount || 0) + coinData.amount,
                        value: (existing.value || 0) + newAsset.value,
                        originalCost: (existing.originalCost || existing.value || 0) + newAsset.originalCost
                    }
                } else if (transactionType === 'sell' || transactionType === 'transfer_out') {
                    const newAmount = (existing.amount || 0) - coinData.amount
                    if (newAmount <= 0) {
                        updatedAssets.splice(idx, 1)
                    } else {
                        const currentOriginalCost = existing.originalCost || existing.value || 0
                        const costReduction = (coinData.amount / (existing.amount || 1)) * currentOriginalCost
                        updatedAssets[idx] = {
                            ...existing,
                            amount: newAmount,
                            value: (existing.value || 0) - newAsset.value,
                            originalCost: currentOriginalCost - costReduction
                        }
                    }
                }
            } else {
                if (transactionType === 'buy' || transactionType === 'transfer_in') {
                    updatedAssets.push(newAsset)
                }
            }
            const updatedActivities = [newActivity, ...(prev.activities || []).slice(0, 4)]
            return { ...prev, assets: updatedAssets, activities: updatedActivities }
        })

        await addTransaction(String(activePortfolio.id || 1), {
            coinId: coinData.symbol?.toLowerCase() || coinData.name?.toLowerCase(),
            type: transactionType === 'transfer_in' ? 'buy' : transactionType === 'transfer_out' ? 'sell' : transactionType,
            amount: coinData.amount,
            priceAtPurchase: coinData.price,
            date: coinData.datePurchased ? new Date(coinData.datePurchased).toISOString() : new Date().toISOString()
        })

        const txs = await getTransactions(String(activePortfolio.id || 1))
        const computed = computeStateFromTransactions(txs)
        setActivePortfolio(prev => ({ ...prev, ...computed }))
    }

    const handleRemoveAsset = async (assetSymbol) => {
        if (!activePortfolio) return
        await removeAssetTransactions(String(activePortfolio.id || 1), assetSymbol.toLowerCase())
        const txs = await getTransactions(String(activePortfolio.id || 1))
        const computed = computeStateFromTransactions(txs)
        setActivePortfolio(prev => ({ ...prev, ...computed }))
    }

    return (
        <PriceProvider>
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                activePortfolio={activePortfolio}
                setActivePortfolio={setActivePortfolio}
                portfolios={portfolios}
                handleCreatePortfolio={handleCreatePortfolio}
                handlePortfolioClick={handlePortfolioClick}
                totalPortfolioValue={totalPortfolioValue}
            />
            
            <Overview 
                isCollapsed={isCollapsed} 
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                activePortfolio={activePortfolio}
                handleAddCoin={handleAddCoin}
                handleRemoveAsset={handleRemoveAsset}
            />
        </PriceProvider>
    )
}

export default Dashboard