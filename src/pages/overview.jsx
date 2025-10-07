import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend as ChartLegend
} from 'chart.js'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import AddCoinModal from './AddCoinModal.jsx'
import { usePrice } from '../contexts/PriceProvider.jsx'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, ChartLegend)

function Overview({ isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, activePortfolio, handleAddCoin, handleRemoveAsset }) {
    const [activeMenu, setActiveMenu] = React.useState(null)
    const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 })
    const [isAddCoinModalOpen, setIsAddCoinModalOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(Date.now())
    const [selectedTimeframe, setSelectedTimeframe] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const [selectedCoinFromSearch, setSelectedCoinFromSearch] = useState(null)
    
    const { priceData, fetchPrices, fetchHistoricalData, getFilteredHistoricalData, symbolToCoinId } = usePrice()
    
    const [coinLogos, setCoinLogos] = useState({})

    const assetSymbols = useMemo(() => (activePortfolio?.assets?.map(a => a.symbol) || []), [activePortfolio?.assets])
    const assetSymbolsKey = useMemo(() => assetSymbols.join(','), [assetSymbols])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSearchDropdown && !event.target.closest('[data-search-container]')) {
                setShowSearchDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showSearchDropdown])

    useEffect(() => {
        if (!assetSymbols.length) return
        fetchPrices(assetSymbols)
    }, [assetSymbolsKey])

    useEffect(() => {
        if (!assetSymbols.length) return
        fetchHistoricalData(assetSymbols, 90)
    }, [assetSymbolsKey])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([])
            setShowSearchDropdown(false)
            return
        }

        const searchCoins = async () => {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchTerm)}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                        }
                    }
                )
                
                if (response.ok) {
                    const data = await response.json()
                    const coins = (data.coins || []).slice(0, 10)
                    const coinsWithLogos = coins.map(coin => ({
                        ...coin,
                        logo: coin.large || coin.small || coin.thumb
                    }))
                    setSearchResults(coinsWithLogos)
                    setShowSearchDropdown(true)
                }
            } catch (error) {
                setSearchResults([])
            }
        }

        const timeoutId = setTimeout(searchCoins, 300)
        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    useEffect(() => {
        const fetchCoinLogos = async () => {
            if (!activePortfolio?.assets?.length) return
            
            const symbols = activePortfolio.assets.map(asset => asset.symbol.toLowerCase())
            const coinIds = symbols.map(symbol => symbolToCoinId[symbol] || symbol)
            
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                        }
                    }
                )
                
                if (response.ok) {
                    const data = await response.json()
                    const logos = {}
                    data.forEach(coin => {
                        logos[coin.symbol.toUpperCase()] = coin.image
                    })
                    setCoinLogos(logos)
                }
            } catch (error) {
                console.error('Error fetching coin logos:', error)
            }
        }
        
        fetchCoinLogos()
    }, [activePortfolio?.assets, symbolToCoinId])

    const formatRelativeTime = (timestamp) => {
        const diff = currentTime - timestamp
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
        return `${days} day${days > 1 ? 's' : ''} ago`
    }

    const calculateCumulativePerformance = () => {
        if (!activePortfolio?.activities?.length) return { chartData: [], allTimeProfit: 0, allTimeReturn: 0, currentValue: 0 }

        const activities = [...activePortfolio.activities].sort((a, b) => a.timestamp - b.timestamp)
        const currentDate = new Date()
        const oldestDate = new Date(activities[0].timestamp)
        
        let startDate
        switch (selectedTimeframe) {
            case 'all':
            default:
                startDate = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), oldestDate.getDate())
                break
        }
        
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
        
        const generateTimeline = () => {
            const timeline = []
            
            switch (selectedTimeframe) {
                case 'all':
                default:
                    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
                    const hoursDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60))
                    
                    timeline.push(new Date(startDate))
                    
                    if (hoursDiff <= 24) {
                        let currentDate = new Date(startDate)
                        currentDate.setHours(currentDate.getHours() + 1)
                        while (currentDate <= endDate) {
                            timeline.push(new Date(currentDate))
                            currentDate.setHours(currentDate.getHours() + 1)
                        }
                    } else if (daysDiff < 7) {
                        let currentDate = new Date(startDate)
                        currentDate.setDate(currentDate.getDate() + 1)
                        while (currentDate <= endDate) {
                            timeline.push(new Date(currentDate))
                            currentDate.setDate(currentDate.getDate() + 1)
                        }
                    } else if (daysDiff < 30) {
                        let currentDate = new Date(startDate)
                        currentDate.setDate(currentDate.getDate() + 7)
                        while (currentDate <= endDate) {
                            timeline.push(new Date(currentDate))
                            currentDate.setDate(currentDate.getDate() + 7)
                        }
                    } else if (daysDiff < 365) {
                        let currentDate = new Date(startDate)
                        currentDate.setMonth(currentDate.getMonth() + 1)
                        while (currentDate <= endDate) {
                            timeline.push(new Date(currentDate))
                            currentDate.setMonth(currentDate.getMonth() + 1)
                        }
                    } else {
                        let currentDate = new Date(startDate)
                        currentDate.setMonth(currentDate.getMonth() + 6)
                        while (currentDate <= endDate) {
                            timeline.push(new Date(currentDate))
                            currentDate.setMonth(currentDate.getMonth() + 6)
                        }
                    }
                    break
            }
            
            return timeline
        }
        
        const timeline = generateTimeline()
        
        let chartData = []

        timeline.forEach((timelineDate) => {
            let portfolioValue = 0
            
            const holdingsAtTime = {}
            
            activities.forEach((activity) => {
                if (new Date(activity.timestamp) <= timelineDate) {
                    if (activity.type === 'buy' || activity.type === 'transfer_in') {
                        if (!holdingsAtTime[activity.asset]) {
                            holdingsAtTime[activity.asset] = { amount: 0, totalInvested: 0 }
                        }
                        holdingsAtTime[activity.asset].amount += activity.amount
                        holdingsAtTime[activity.asset].totalInvested += Math.abs(activity.numericValue || 0)
                    } else if (activity.type === 'sell' || activity.type === 'transfer_out') {
                        if (holdingsAtTime[activity.asset]) {
                            holdingsAtTime[activity.asset].amount -= activity.amount
                            if (holdingsAtTime[activity.asset].amount <= 0) {
                                delete holdingsAtTime[activity.asset]
                            }
                        }
                    }
                }
            })
            
            Object.entries(holdingsAtTime).forEach(([assetName, holding]) => {
                if (holding.amount > 0) {
                    const currentAsset = activePortfolio.assets?.find(asset => asset.name === assetName)
                    if (currentAsset) {
                        const coinId = symbolToCoinId[currentAsset.symbol] || currentAsset.symbol.toLowerCase()
                        const fallbackCurrentPrice = priceData[coinId]?.usd || (currentAsset.value / currentAsset.amount)
                        let priceAtTime = fallbackCurrentPrice
                        
                        const filteredData = getFilteredHistoricalData(currentAsset.symbol)
                        if (filteredData && filteredData.prices && filteredData.prices.length > 0) {
                            const targetTime = timelineDate.getTime()
                            let closestPrice = filteredData.prices[0]
                            
                            for (const [timestamp, price] of filteredData.prices) {
                                if (Math.abs(timestamp - targetTime) < Math.abs(closestPrice[0] - targetTime)) {
                                    closestPrice = [timestamp, price]
                                }
                            }
                            
                            priceAtTime = closestPrice[1] ?? fallbackCurrentPrice
                        }
                        
                        portfolioValue += holding.amount * priceAtTime
                    }
                }
            })
            
            let dateFormat
            switch (selectedTimeframe) {
                case 'all':
                default:
                    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
                    const hoursDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60))
                    if (hoursDiff <= 24) {
                        dateFormat = timelineDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
                    } else if (daysDiff < 7) {
                        dateFormat = timelineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    } else if (daysDiff < 30) {
                        dateFormat = timelineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    } else if (daysDiff < 365) {
                        dateFormat = timelineDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    } else {
                        dateFormat = timelineDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    }
                    break
            }

            chartData.push({
                date: dateFormat,
                timestamp: timelineDate.getTime(),
                portfolioValue: portfolioValue
            })
        })

        const currentTotalValue = activePortfolio.assets?.reduce((sum, asset) => {
            const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
            const currentPrice = priceData[coinId]?.usd || (asset.value / asset.amount)
            return sum + (asset.amount * currentPrice)
        }, 0) || 0

        const totalInvestedFromAssets = activePortfolio.assets?.reduce((sum, asset) => {
            return sum + (asset.originalCost || asset.value)
        }, 0) || 0

        const totalInvestedFromActivities = activities
            .filter(activity => activity.type === 'buy' || activity.type === 'transfer_in')
            .reduce((sum, activity) => sum + Math.abs(activity.numericValue || 0), 0)

        const totalInvested = totalInvestedFromAssets > 0 ? totalInvestedFromAssets : totalInvestedFromActivities

        const totalRealized = activities
            .filter(activity => activity.type === 'sell' || activity.type === 'transfer_out')
            .reduce((sum, activity) => sum + Math.abs(activity.numericValue || 0), 0)

        const allTimeProfit = (totalRealized + currentTotalValue) - totalInvested
        const allTimeReturn = totalInvested > 0 ? (allTimeProfit / totalInvested) * 100 : 0

        if (chartData.length === 0) {
            chartData = [
                {
                    date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    timestamp: startDate.getTime(),
                    portfolioValue: currentTotalValue
                },
                {
                    date: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    timestamp: endDate.getTime(),
                    portfolioValue: currentTotalValue
                }
            ]
        }

        let limitedChartData = chartData
        if (chartData.length > 5) {
            const first = chartData[0]
            const last = chartData[chartData.length - 1]
            const q1 = chartData[Math.floor(chartData.length * 0.25)]
            const mid = chartData[Math.floor(chartData.length * 0.5)]
            const q3 = chartData[Math.floor(chartData.length * 0.75)]
            limitedChartData = [first, q1, mid, q3, last]
        }

        return { chartData: limitedChartData, allTimeProfit, allTimeReturn, totalInvested, totalRealized, currentValue: currentTotalValue }
    }

    const performance = useMemo(() => calculateCumulativePerformance(), [activePortfolio, priceData, selectedTimeframe])

    const allocation = useMemo(() => {
        if (!activePortfolio?.assets?.length) {
            return [
                { symbol: 'BTC', value: 0, percent: 0, color: '#3b82f6' },
                { symbol: 'ETH', value: 0, percent: 0, color: '#10b981' }
            ]
        }
        
        const totalValue = activePortfolio.assets.reduce((sum, asset) => {
            const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
            const priceInfo = priceData[coinId]
            const currentPrice = priceInfo?.usd || (asset.value / asset.amount)
            return sum + (asset.amount * currentPrice)
        }, 0)
        
        return activePortfolio.assets.map((asset, index) => {
            const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
            const priceInfo = priceData[coinId]
            const currentPrice = priceInfo?.usd || (asset.value / asset.amount)
            const currentValue = asset.amount * currentPrice
            
            return {
                symbol: asset.symbol,
                value: currentValue,
                percent: totalValue > 0 ? (currentValue / totalValue) * 100 : 0,
                color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
            }
        })
    }, [activePortfolio, priceData])

    const doughnutData = useMemo(() => ({
        labels: allocation.map((a) => a.symbol),
        datasets: [
            {
                label: 'Allocation %',
                data: allocation.map((a) => Number(a.percent.toFixed(2))),
                backgroundColor: allocation.map((a) => a.color),
                borderWidth: 0
            }
        ]
    }), [allocation])

    const doughnutOptions = useMemo(() => ({
        cutout: '72%',
        plugins: { 
            legend: { display: false }, 
            tooltip: { 
                callbacks: { 
                    label: (ctx) => `${ctx.label}: ${ctx.parsed}%` 
                } 
            } 
        }
    }), [])

    const handleMenuClick = (e, assetId) => {
        e.preventDefault()
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        setMenuPosition({ x: rect.right - 130, y: rect.bottom + 8 })
        setActiveMenu(activeMenu === assetId ? null : assetId)
    }

    const handleMenuClose = () => {
        setActiveMenu(null)
    }

    const onAddCoin = (coinData) => {
        handleAddCoin(coinData)
        setIsAddCoinModalOpen(false)
    }

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeMenu && !e.target.closest('[data-menu]') && !e.target.closest('[data-menu-button]')) {
                setActiveMenu(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [activeMenu])

    return (
        <>
        <MobileOverlay $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
        <OverviewContainer $isCollapsed={isCollapsed}>
            <Header>
                <HeaderLeft>
                    <HamburgerButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </HamburgerButton>
                    <div>
                        <Title>{activePortfolio ? activePortfolio.name : 'My Main Portfolio'}</Title>
                    </div>
                </HeaderLeft>
                <HeaderRight>
                    <NotificationIcon>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </NotificationIcon>
                    <SearchBar data-search-container>
                        <SearchIcon>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </SearchIcon>
                        <SearchInput 
                            placeholder="Search coins..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowSearchDropdown(true)}
                        />
                        {showSearchDropdown && searchResults.length > 0 && (
                            <SearchDropdown>
                                {searchResults.map((coin) => (
                                    <SearchResultItem 
                                        key={coin.id}
                                        onClick={() => {
                                            setSelectedCoinFromSearch({
                                                id: coin.id,
                                                symbol: coin.symbol.toUpperCase(),
                                                name: coin.name,
                                                image: coin.logo
                                            })
                                            setSearchTerm('')
                                            setShowSearchDropdown(false)
                                            setIsAddCoinModalOpen(true)
                                        }}
                                    >
                                        <CoinLogo src={coin.logo} alt={coin.name} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{coin.name}</div>
                                            <div style={{ color: '#6b7280', fontSize: 12 }}>{coin.symbol.toUpperCase()}</div>
                                        </div>
                                    </SearchResultItem>
                                ))}
                            </SearchDropdown>
                        )}
                    </SearchBar>
                    <AddTransactionButton onClick={() => setIsAddCoinModalOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Add Transaction
                    </AddTransactionButton>
                </HeaderRight>
            </Header>

            <MainContent>
                <StatsGrid>
                    <StatCard>
                        <StatIcon $color="#10b981">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </StatIcon>
                        <StatContent>
                            <StatValue>
                                {(() => {
                                    const { currentValue } = performance
                                    return `$${currentValue.toLocaleString()}`
                                })()}
                            </StatValue>
                            <StatLabel>Total Portfolio Value</StatLabel>
                            <StatChange $positive={
                                (() => {
                                    const { allTimeReturn } = performance
                                    return allTimeReturn >= 0
                                })()
                            }>
                                {(() => {
                                    const { allTimeReturn } = performance
                                    return allTimeReturn >= 0 ? `+${allTimeReturn.toFixed(1)}%` : `${allTimeReturn.toFixed(1)}%`
                                })()}
                            </StatChange>
                        </StatContent>
                    </StatCard>

                    <StatCard>
                        <StatIcon $color="#3b82f6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </StatIcon>
                        <StatContent>
                            <StatValue>
                                {(() => {
                                    const { allTimeProfit } = performance
                                    return `$${allTimeProfit.toFixed(0)}`
                                })()}
                            </StatValue>
                            <StatLabel>All-Time Profit & Loss (PnL)</StatLabel>
                            <StatChange $positive={
                                (() => {
                                    const { allTimeReturn } = performance
                                    return allTimeReturn >= 0
                                })()
                            }>
                                {(() => {
                                    const { allTimeReturn } = performance
                                    return `${allTimeReturn.toFixed(1)}%`
                                })()}
                            </StatChange>
                        </StatContent>
                    </StatCard>

                    <StatCard>
                        <StatIcon $color="#f59e0b">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                        </StatIcon>
                        <StatContent>
                            <StatValue>
                                {(() => {
                                    if (!activePortfolio?.assets?.length || !priceData) return '+$0'
                                    
                                    
                                    let total24hChange = 0
                                    activePortfolio.assets.forEach(asset => {
                                        const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
                                        const priceInfo = priceData[coinId]
                                        if (priceInfo && priceInfo.usd_24h_change) {
                                            const currentValue = asset.amount * priceInfo.usd
                                            const changeValue = currentValue * (priceInfo.usd_24h_change / 100)
                                            total24hChange += changeValue
                                        }
                                    })
                                    
                                    return total24hChange >= 0 ? `+$${total24hChange.toFixed(0)}` : `$${total24hChange.toFixed(0)}`
                                })()}
                            </StatValue>
                            <StatLabel>24h Change</StatLabel>
                            <StatChange $positive={
                                (() => {
                                    if (!activePortfolio?.assets?.length || !priceData) return true
                                    
                                    
                                    let total24hChange = 0
                                    activePortfolio.assets.forEach(asset => {
                                        const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
                                        const priceInfo = priceData[coinId]
                                        if (priceInfo && priceInfo.usd_24h_change) {
                                            total24hChange += priceInfo.usd_24h_change
                                        }
                                    })
                                    
                                    const avgChange = total24hChange / activePortfolio.assets.length
                                    return avgChange >= 0
                                })()
                            }>
                                {(() => {
                                    if (!activePortfolio?.assets?.length || !priceData) return '+0.0%'
                                    
                                    
                                    let total24hChange = 0
                                    activePortfolio.assets.forEach(asset => {
                                        const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
                                        const priceInfo = priceData[coinId]
                                        if (priceInfo && priceInfo.usd_24h_change) {
                                            total24hChange += priceInfo.usd_24h_change
                                        }
                                    })
                                    
                                    const avgChange = total24hChange / activePortfolio.assets.length
                                    return avgChange >= 0 ? `+${avgChange.toFixed(1)}%` : `${avgChange.toFixed(1)}%`
                                })()}
                            </StatChange>
                        </StatContent>
                    </StatCard>

                    <StatCard>
                        <StatIcon $color="#ef4444">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                        </StatIcon>
                        <StatContent>
                            <StatValue>{activePortfolio?.assets?.length || 0}</StatValue>
                            <StatLabel>Total Assets</StatLabel>
                            <StatChange $positive={
                                (() => {
                                    if (!activePortfolio?.assets?.length || !priceData) return true
                                    
                                    
                                    let total7dChange = 0
                                    let validAssets = 0
                                    
                                    activePortfolio.assets.forEach(asset => {
                                        const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
                                        const priceInfo = priceData[coinId]
                                        if (priceInfo && priceInfo.usd_7d_change !== undefined) {
                                            total7dChange += priceInfo.usd_7d_change
                                            validAssets++
                                        }
                                    })
                                    
                                    if (validAssets === 0) return true
                                    const avg7dChange = total7dChange / validAssets
                                    return avg7dChange >= 0
                                })()
                            }>
                                {(() => {
                                    if (!activePortfolio?.assets?.length || !priceData) return '+0.0%'
                                    
                                    
                                    let total7dChange = 0
                                    let validAssets = 0
                                    
                                    activePortfolio.assets.forEach(asset => {
                                        const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
                                        const priceInfo = priceData[coinId]
                                        if (priceInfo && priceInfo.usd_7d_change !== undefined) {
                                            total7dChange += priceInfo.usd_7d_change
                                            validAssets++
                                        }
                                    })
                                    
                                    if (validAssets === 0) return '+0.0%'
                                    const avg7dChange = total7dChange / validAssets
                                    return avg7dChange >= 0 ? `+${avg7dChange.toFixed(1)}%` : `${avg7dChange.toFixed(1)}%`
                                })()}
                            </StatChange>
                        </StatContent>
                    </StatCard>
                </StatsGrid>

                <ContentGrid>
                    <ChartSection>
                        <SectionHeader>
                            <SectionTitle>Performance</SectionTitle>
                            <TimeFrameSelector>
                                <TimeFrame $active={selectedTimeframe === 'all'} onClick={() => setSelectedTimeframe('all')}>All</TimeFrame>
                            </TimeFrameSelector>
                        </SectionHeader>
                        {(() => {
                            const { chartData, allTimeProfit, allTimeReturn } = performance
                            
                            if (chartData.length === 0) {
                                return (
                                    <ChartPlaceholder>
                                        <ChartIcon>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                                        </ChartIcon>
                                        <ChartText>No performance data available</ChartText>
                                    </ChartPlaceholder>
                                )
                            }

                            return (
                                <div style={{ padding: '16px 0' }}>
                                    <div style={{ height: '200px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#6b7280"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis 
                                                    stroke="#6b7280"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                                />
                                                <RechartsTooltip 
                                                    contentStyle={{
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="portfolioValue" 
                                                    stroke="#10b981"
                                                    fill="#10b981"
                                                    fillOpacity={0.1}
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )
                        })()}
                    </ChartSection>
                    <AllocationSection>
                        <SectionHeader>
                            <SectionTitle>Allocation</SectionTitle>
                            
                        </SectionHeader>
                        <AllocationContent>
                            {activePortfolio?.assets?.length > 0 ? (
                                <>
                                    <AllocationChart>
                                        <div style={{ width: 200, height: 200, margin: '0 auto' }}>
                                            <Doughnut data={doughnutData} options={doughnutOptions} />
                                        </div>
                                    </AllocationChart>
                                    <AllocationLegend>
                                        {allocation.map((a) => (
                                            <LegendItem key={a.symbol}>
                                                {coinLogos[a.symbol] ? (
                                                    <CoinLogo src={coinLogos[a.symbol]} alt={a.symbol} style={{ width: '16px', height: '16px' }} />
                                                ) : (
                                                    <LegendColor $color={a.color}></LegendColor>
                                                )}
                                                <LegendInfo>
                                                    <LegendName>{a.symbol}</LegendName>
                                                    <LegendValue>{a.percent.toFixed(2)}%</LegendValue>
                                                </LegendInfo>
                                            </LegendItem>
                                        ))}
                                    </AllocationLegend>
                                </>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    width: '100%', 
                                    height: '100%',
                                    color: '#6b7280',
                                    fontSize: '16px',
                                    fontWeight: '500'
                                }}>
                                    No Allocation yet
                                </div>
                            )}
                        </AllocationContent>
                </AllocationSection>
            </ContentGrid>

             <BottomGrid>
                 <AssetsSection>
                     <SectionHeader>
                         <SectionTitle>Assets</SectionTitle>
                        
                     </SectionHeader>
                     <AssetsTable>
                         <AssetsRow $header>
                             <div>Name</div>
                             <div>Amount</div>
                             <div>Price/unit</div>
                             <div>Holdings</div>
                             <div>Profit/Loss</div>
                             <div>Actions</div>
                         </AssetsRow>
                        {activePortfolio?.assets?.map((asset, idx) => {
                            const coinId = symbolToCoinId[asset.symbol] || asset.symbol.toLowerCase()
                            const priceInfo = priceData[coinId]
                            
                            const currentPrice = priceInfo?.usd || (asset.value / asset.amount)
                            const currentValue = asset.amount * currentPrice
                            
                            const averagePurchasePrice = asset.originalCost ? (asset.originalCost / asset.amount) : (asset.value / asset.amount)
                            const priceDifferencePerUnit = currentPrice - averagePurchasePrice
                            const totalProfitLoss = priceDifferencePerUnit * asset.amount
                            const profitLossPercent = averagePurchasePrice > 0 ? (priceDifferencePerUnit / averagePurchasePrice) * 100 : 0
                            
                            return (
                                <AssetsRow key={asset.id || asset.symbol || asset.name || idx}>
                                    <CoinCell>
                                        {coinLogos[asset.symbol] ? (
                                            <CoinLogo src={coinLogos[asset.symbol]} alt={asset.name} />
                                        ) : (
                                            <CoinAvatar>{asset.symbol.charAt(0)}</CoinAvatar>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{asset.name}</div>
                                            <div style={{ color: '#6b7280', fontSize: 14 }}>{asset.symbol}</div>
                                        </div>
                                    </CoinCell>
                                    <div>{asset.amount}</div>
                                    <div>${currentPrice.toLocaleString()}</div>
                                    <div>${currentValue.toLocaleString()}</div>
                                    <div style={{ color: totalProfitLoss >= 0 ? '#10B981' : '#EF4444', lineHeight: '1.2' }}>
                                        <div>{totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(0)}</div>
                                        <div>{totalProfitLoss >= 0 ? '▲' : '▼'} {Math.abs(profitLossPercent).toFixed(2)}%</div>
                                    </div>
                                    <ActionCell>
                                        <ActionButton data-menu-button onClick={(e) => handleMenuClick(e, asset.id)}>⋯</ActionButton>
                                        {activeMenu === asset.id && (
                                            <ActionMenu data-menu style={{ left: `${Math.max(8, menuPosition.x)}px`, top: `${Math.max(8, menuPosition.y)}px` }}>
                                                
                                                <MenuItem onClick={() => {
                                                    handleRemoveAsset(asset.symbol)
                                                    handleMenuClose()
                                                }}>Remove Transaction</MenuItem>
                                            </ActionMenu>
                                        )}
                                    </ActionCell>
                                </AssetsRow>
                            )
                        }) || (
                            <AssetsRow>
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                    No asset added yet
                                </div>
                            </AssetsRow>
                        )}
                      </AssetsTable>
                  </AssetsSection>
                 
                 <RecentActivity>
                     <SectionHeader>
                         <SectionTitle>Recent Activity</SectionTitle>
                        
                     </SectionHeader>
                     <ActivityList>
                         {activePortfolio?.activities?.map((activity) => (
                             <ActivityItem key={activity.id}>
                                 <ActivityIcon $bg={
                                     activity.type === 'buy' ? "#ecfdf5" : 
                                     activity.type === 'sell' ? "#fef3c7" : 
                                     activity.type === 'transfer_in' ? "#ecfdf5" :
                                     activity.type === 'transfer_out' ? "#fef3c7" :
                                     activity.type === 'add' ? "#ecfdf5" : "#dbeafe"
                                 } $color={
                                     activity.type === 'buy' ? "#10b981" : 
                                     activity.type === 'sell' ? "#f59e0b" : 
                                     activity.type === 'transfer_in' ? "#10b981" :
                                     activity.type === 'transfer_out' ? "#f59e0b" :
                                     activity.type === 'add' ? "#10b981" : "#3b82f6"
                                 }>
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                     </svg>
                                 </ActivityIcon>
                                 <ActivityContent>
                                     <ActivityTitle>
                                         {activity.type === 'buy' ? `Bought ${activity.amount} ${activity.asset}` :
                                          activity.type === 'sell' ? `Sold ${activity.amount} ${activity.asset}` :
                                          activity.type === 'transfer_in' ? `Received ${activity.amount} ${activity.asset}` :
                                          activity.type === 'transfer_out' ? `Sent ${activity.amount} ${activity.asset}` :
                                          activity.type === 'add' ? `Added ${activity.asset}` : 
                                          activity.type === 'create' ? `Created ${activity.asset}` :
                                          `Added ${activity.asset}`}
                                     </ActivityTitle>
                                     <ActivityTime>{activity.timestamp ? formatRelativeTime(activity.timestamp) : activity.time}</ActivityTime>
                                 </ActivityContent>
                                 <ActivityAmount $positive={activity.value?.startsWith('+')}>{activity.value || activity.amount}</ActivityAmount>
                             </ActivityItem>
                         )) || (
                             <ActivityItem>
                                 <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', width: '100%' }}>
                                     No recent activity
                                 </div>
                             </ActivityItem>
                         )}
                     </ActivityList>
                 </RecentActivity>
              </BottomGrid>
              </MainContent>
        </OverviewContainer>
        
        <AddCoinModal 
            isOpen={isAddCoinModalOpen}
            onClose={() => {
                setIsAddCoinModalOpen(false)
                setSelectedCoinFromSearch(null)
            }}
            onAddCoin={onAddCoin}
            preSelectedCoin={selectedCoinFromSearch}
        />
         </>
    )
}

const OverviewContainer = styled.div`
    width: ${props => props.$isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 300px)'};
    height: 100%;
    background-color: #f8fafc;
    margin-left: ${props => props.$isCollapsed ? '80px' : '300px'};
    transition: all 0.3s ease;
    
    @media (max-width: 1200px) {
    width: 100%;
        margin-left: 0;
    }
    
    @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
    }
`

const MobileOverlay = styled.div`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
    opacity: ${props => props.$isOpen ? 1 : 0};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    
    @media (max-width: 1200px) {
        display: block;
    }
`

const HamburgerButton = styled.button`
    display: none;
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 8px;
    color: #64748b;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
        color: #334155;
    }
    
    @media (max-width: 1200px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 32px 40px;
    background-color: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    
    @media (max-width: 1024px) {
        padding: 24px 32px;
    }
    
    @media (max-width: 768px) {
        padding: 20px 24px;
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
`

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    
    @media (min-width: 1201px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
`

const Breadcrumb = styled.div`
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    
    @media (max-width: 768px) {
        font-size: 12px;
    }
`

const Title = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    letter-spacing: -0.02em;
    
    @media (max-width: 1024px) {
        font-size: 28px;
    }
    
    @media (max-width: 768px) {
        font-size: 24px;
    }
`

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    
    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
    }
`

const NotificationIcon = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #64748b;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
        color: #475569;
    }
`

const SearchBar = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 280px;
    transition: all 0.2s ease;
    
    &:focus-within {
        border-color: #111827;
        box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
    }
    
    @media (max-width: 1024px) {
        min-width: 240px;
    }
    
    @media (max-width: 768px) {
        min-width: 200px;
        flex: 1;
    }
`

const SearchIcon = styled.div`
    color: #64748b;
    margin-right: 12px;
    display: flex;
    align-items: center;
`

const SearchInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #111827;
    
    &::placeholder {
        color: #94a3b8;
    }
`

const SearchDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    margin-top: 4px;
`

const SearchResultItem = styled.div`
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
    
    &:hover {
        background-color: #f9fafb;
    }
    
    &:last-child {
        border-bottom: none;
    }
`

const CoinLogo = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
`

const AddTransactionButton = styled.button`
    background: #111827;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    
    &:hover {
        background: #0f172a;
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        padding: 8px 12px;
        font-size: 12px;
    }
`

const MainContent = styled.div`
    padding: 32px 40px;
    
    @media (max-width: 1024px) {
        padding: 24px 32px;
    }
    
    @media (max-width: 768px) {
        padding: 20px 24px;
    }
`

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 24px;
    }
`

const StatCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        padding: 20px;
    }
`

const StatIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: ${props => props.$color}20;
    color: ${props => props.$color};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const StatContent = styled.div`
    flex: 1;
`

const StatValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
    
    @media (max-width: 768px) {
        font-size: 20px;
    }
`

const StatLabel = styled.div`
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 8px;
`

const StatChange = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`

const BottomGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`

const AllocationSection = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
        padding: 20px;
    }
`

const AllocationContent = styled.div`
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: center;
    min-height: 250px;
    
    @media (max-width: 768px) {
    flex-direction: column;
        gap: 16px;
        min-height: 300px;
    }
`

const AllocationChart = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const AllocationLegend = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 150px;
    align-items: center;
`

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`

const LegendColor = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.$color};
    flex-shrink: 0;
`

const LegendInfo = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    gap: 16px;
`

const LegendName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
`

const LegendValue = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
`

const ChartSection = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
    padding: 20px;
    }
`

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
    flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
`

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin: 0;
`

const ViewAllButton = styled.button`
    background: transparent;
    border: none;
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
    }
`

const PortfolioList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const PortfolioItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
        transform: translateY(-1px);
    }
`

const PortfolioIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: ${props => props.$bg};
    color: ${props => props.$color};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const PortfolioInfo = styled.div`
    flex: 1;
`

const PortfolioName = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
`

const PortfolioValue = styled.div`
    font-size: 12px;
    color: #64748b;
`

const PortfolioChange = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`

const TimeFrameSelector = styled.div`
    display: flex;
    gap: 8px;
`

const TimeFrame = styled.button`
    background: ${props => props.$active ? '#111827' : 'transparent'};
    color: ${props => props.$active ? '#ffffff' : '#64748b'};
    border: 1px solid ${props => props.$active ? '#111827' : '#e2e8f0'};
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${props => props.$active ? '#0f172a' : '#f1f5f9'};
    }
`

const ChartPlaceholder = styled.div`
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    border-radius: 12px;
    border: 2px dashed #cbd5e1;
`

const ChartIcon = styled.div`
    color: #94a3b8;
    margin-bottom: 16px;
`

const ChartText = styled.div`
    color: #64748b;
    font-size: 14px;
    text-align: center;
`

const RecentActivity = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
        padding: 20px;
    }
`

const ActivityList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const ActivityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f1f5f9;
        transform: translateY(-1px);
    }
`

const ActivityIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: ${props => props.$bg};
    color: ${props => props.$color};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`

const ActivityContent = styled.div`
    flex: 1;
`

const ActivityTitle = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
`

const ActivityTime = styled.div`
    font-size: 12px;
    color: #64748b;
`

const ActivityAmount = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`

const AssetsSection = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const AssetsTable = styled.div`
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
`

const AssetsRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 0.8fr;
    gap: 12px;
    padding: 12px 16px;
    align-items: center;
    border-top: ${props => props.$header ? 'none' : '1px solid #f3f4f6'};
    background: ${props => props.$header ? '#f9fafb' : 'transparent'};
    font-weight: ${props => props.$header ? 600 : 400};
    color: ${props => props.$header ? '#6b7280' : '#111827'};
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 16px;
        
        &:not(:first-child) {
            border-top: 1px solid #e2e8f0;
            margin-top: 12px;
            padding-top: 16px;
        }
    }
`

const CoinCell = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const CoinAvatar = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #e5e7eb;
    display: grid;
    place-items: center;
    color: #374151;
    font-size: 12px;
    font-weight: 700;
`

const ActionCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`

const ActionButton = styled.button`
    background: none;
    border: none;
    color: #6b7280;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f3f4f6;
        color: #374151;
    }
`

const ActionMenu = styled.div`
    position: fixed;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    width: 130px;
    overflow: hidden;
`

const MenuItem = styled.button`
    width: 100%;
    background: none;
    border: none;
    padding: 8px 12px;
    text-align: left;
    font-size: 12px;
    color: #374151;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    
    &:hover {
        background-color: #f9fafb;
    }
    
    &:not(:last-child) {
        border-bottom: 1px solid #f3f4f6;
    }
`

export default Overview