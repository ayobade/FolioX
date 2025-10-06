import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const PriceContext = createContext()

export const usePrice = () => {
    const context = useContext(PriceContext)
    if (!context) {
        throw new Error('usePrice must be used within a PriceProvider')
    }
    return context
}

const CACHE_DURATION = 60 * 1000
const CHART_CACHE_DURATION = 60 * 60 * 1000

export const symbolToCoinId = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink',
    'UNI': 'uniswap'
}

export const PriceProvider = ({ children }) => {
    const [priceData, setPriceData] = useState({})
    const [historicalData, setHistoricalData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [lastFetch, setLastFetch] = useState(0)
    const [lastIdsParam, setLastIdsParam] = useState('')

    const fetchPrices = useCallback(async (symbols) => {
        try {
            setLoading(true)
            setError(null)

            const coinIds = symbols.map(symbol => symbolToCoinId[symbol] || symbol.toLowerCase())
            const idsParam = coinIds.join(',')

            const now = Date.now()
            if (idsParam === lastIdsParam && (now - lastFetch) < CACHE_DURATION && Object.keys(priceData).length) {
                return priceData
            }

            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true`,
                {
                    headers: {
                        'accept': 'application/json',
                        'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                    }
                }
            )

            if (response.status === 429) {
                const cached = localStorage.getItem('priceData')
                if (cached) {
                    const { data } = JSON.parse(cached)
                    setPriceData(data)
                    return data
                }
                return priceData
            }

            if (!response.ok) {
                const cached = localStorage.getItem('priceData')
                if (cached) {
                    const { data } = JSON.parse(cached)
                    setPriceData(data)
                    return data
                }
                return priceData
            }

            const data = await response.json()
            setPriceData(data)
            setLastFetch(now)
            setLastIdsParam(idsParam)
            
            localStorage.setItem('priceData', JSON.stringify({
                data,
                timestamp: now
            }))

            return data
        } catch (error) {
            setError(error.message)
            
            const cached = localStorage.getItem('priceData')
            if (cached) {
                const { data } = JSON.parse(cached)
                setPriceData(data)
                return data
            }
            
            return priceData
        } finally {
            setLoading(false)
        }
    }, [lastFetch, lastIdsParam, priceData])

    const fetchHistoricalData = useCallback(async (symbol, days = 90) => {
        try {
            const coinId = symbolToCoinId[symbol] || symbol.toLowerCase()
            const cacheKey = `${coinId}_${days}d`
            const now = Date.now()
            const cachedRaw = localStorage.getItem(`chart_${cacheKey}`)
            if (cachedRaw) {
                try {
                    const cached = JSON.parse(cachedRaw)
                    if (now - cached.timestamp < CHART_CACHE_DURATION && cached.data) {
                        setHistoricalData(prev => ({ ...prev, [cacheKey]: cached.data }))
                        return cached.data
                    }
                } catch {}
            }
            if (historicalData[cacheKey]) return historicalData[cacheKey]

            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`,
                {
                    headers: {
                        'accept': 'application/json',
                        'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                    }
                }
            )

            if (response.status === 429) {
                return historicalData[cacheKey] || null
            }

            if (!response.ok) {
                return historicalData[cacheKey] || null
            }

            const data = await response.json()
            setHistoricalData(prev => ({
                ...prev,
                [cacheKey]: data
            }))
            localStorage.setItem(`chart_${cacheKey}`, JSON.stringify({ data, timestamp: Date.now() }))

            return data
        } catch (error) {
            return null
        }
    }, [historicalData])

    const getFilteredHistoricalData = useCallback((symbol) => {
        const coinId = symbolToCoinId[symbol] || symbol.toLowerCase()
        const cacheKey = `${coinId}_90d`
        if (!historicalData[cacheKey]) return null
        return historicalData[cacheKey]
    }, [historicalData])

    const refreshPrices = useCallback(async (symbols) => {
        const now = Date.now()
        if (now - lastFetch < CACHE_DURATION) {
            return priceData
        }

        return fetchPrices(symbols)
    }, [fetchPrices, lastFetch, priceData])

    const refreshHistoricalData = useCallback(async (symbols, days = 90) => {
        const promises = symbols.map(symbol => fetchHistoricalData(symbol, days))
        return Promise.all(promises)
    }, [fetchHistoricalData])

    useEffect(() => {
        const cached = localStorage.getItem('priceData')
        if (cached) {
            const { data, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_DURATION) {
                setPriceData(data)
                setLastFetch(timestamp)
            }
        }
    }, [])

    useEffect(() => {
        const idsParam = Object.keys(priceData).join(',')
        const interval = setInterval(() => {
            if (idsParam) {
                const symbols = idsParam.split(',')
                refreshPrices(symbols)
            }
        }, CACHE_DURATION)
        return () => clearInterval(interval)
    }, [refreshPrices, priceData])

    const value = {
        priceData,
        historicalData,
        loading,
        error,
        fetchPrices,
        fetchHistoricalData,
        getFilteredHistoricalData,
        refreshPrices,
        refreshHistoricalData,
        symbolToCoinId
    }

    return (
        <PriceContext.Provider value={value}>
            {children}
        </PriceContext.Provider>
    )
}
