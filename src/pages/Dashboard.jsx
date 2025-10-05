import React, { useState } from 'react'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import Dashboard1 from './Dashboard1'
import Overview from './overview'

function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activePortfolio, setActivePortfolio] = useState({
        id: 1,
        name: 'My Main Portfolio',
        value: '$0.00',
        isActive: true,
        iconType: 'rocket',
        assets: [],
        activities: []
    })
    const [portfolios, setPortfolios] = useState([
        {
            id: 1,
            name: 'My Main Portfolio',
            value: '$0.00',
            isActive: true,
            iconType: 'rocket',
            assets: [],
            activities: []
        }
    ])

    const handleCreatePortfolio = (portfolioData) => {
        const newPortfolio = {
            id: Date.now(),
            name: portfolioData.name,
            value: '$0.00',
            isActive: false,
            iconType: portfolioData.icon.id,
            assets: [],
            activities: []
        }
        setPortfolios(prev => [...prev, newPortfolio])
    }

    const handlePortfolioClick = (portfolioId) => {
        const selectedPortfolio = portfolios.find(p => p.id === portfolioId)
        setActivePortfolio(selectedPortfolio)
        setPortfolios(prev => prev.map(portfolio => ({
            ...portfolio,
            isActive: portfolio.id === portfolioId
        })))
    }

    const totalPortfolioValue = portfolios.reduce((total, portfolio) => {
        const portfolioValue = portfolio.assets?.reduce((sum, asset) => sum + asset.value, 0) || 0
        return total + portfolioValue
    }, 0)

    const handleAddCoin = (coinData) => {
        if (!activePortfolio) {
            return
        }

        const newAsset = {
            id: Date.now(),
            name: coinData.name,
            symbol: coinData.symbol,
            amount: coinData.amount,
            value: coinData.price * coinData.amount,
            change24h: coinData.change24h || 0,
            change7d: coinData.change7d || 0
        }

        let transactionType = 'buy'
        if (coinData.type === 'Buy') transactionType = 'buy'
        else if (coinData.type === 'Sell') transactionType = 'sell'
        else if (coinData.type === 'Transfer' && coinData.transferDirection === 'Transfer In') transactionType = 'transfer_in'
        else if (coinData.type === 'Transfer' && coinData.transferDirection === 'Transfer Out') transactionType = 'transfer_out'

        const newActivity = {
            id: Date.now(),
            type: transactionType,
            asset: coinData.name,
            amount: coinData.amount,
            value: transactionType === 'sell' || transactionType === 'transfer_out' ? 
                `-$${newAsset.value.toLocaleString()}` : 
                `+$${newAsset.value.toLocaleString()}`,
            timestamp: Date.now(),
            time: 'Just now'
        }

        setPortfolios(prev => prev.map(portfolio => {
            if (portfolio.id === activePortfolio.id) {
                let updatedAssets = [...portfolio.assets]
                
                const existingAssetIndex = updatedAssets.findIndex(asset => 
                    asset.symbol === coinData.symbol || asset.name === coinData.name
                )
                
                if (existingAssetIndex !== -1) {
                    const existingAsset = updatedAssets[existingAssetIndex]
                    if (transactionType === 'buy' || transactionType === 'transfer_in') {
                        updatedAssets[existingAssetIndex] = {
                            ...existingAsset,
                            amount: existingAsset.amount + coinData.amount,
                            value: existingAsset.value + newAsset.value
                        }
                    } else if (transactionType === 'sell' || transactionType === 'transfer_out') {
                        const newAmount = existingAsset.amount - coinData.amount
                        if (newAmount <= 0) {
                            updatedAssets.splice(existingAssetIndex, 1)
                        } else {
                            updatedAssets[existingAssetIndex] = {
                                ...existingAsset,
                                amount: newAmount,
                                value: existingAsset.value - newAsset.value
                            }
                        }
                    }
                } else {
                    if (transactionType === 'buy' || transactionType === 'transfer_in') {
                        updatedAssets.push(newAsset)
                    }
                }
                
                const updatedActivities = [newActivity, ...portfolio.activities.slice(0, 4)]
                const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0)
                
                return {
                    ...portfolio,
                    assets: updatedAssets,
                    activities: updatedActivities,
                    value: `$${totalValue.toLocaleString()}`
                }
            }
            return portfolio
        }))

        setActivePortfolio(prev => {
            if (prev && prev.id === activePortfolio.id) {
                let updatedAssets = [...prev.assets]
                
                const existingAssetIndex = updatedAssets.findIndex(asset => 
                    asset.symbol === coinData.symbol || asset.name === coinData.name
                )
                
                if (existingAssetIndex !== -1) {
                    const existingAsset = updatedAssets[existingAssetIndex]
                    if (transactionType === 'buy' || transactionType === 'transfer_in') {
                        updatedAssets[existingAssetIndex] = {
                            ...existingAsset,
                            amount: existingAsset.amount + coinData.amount,
                            value: existingAsset.value + newAsset.value
                        }
                    } else if (transactionType === 'sell' || transactionType === 'transfer_out') {
                        const newAmount = existingAsset.amount - coinData.amount
                        if (newAmount <= 0) {
                            updatedAssets.splice(existingAssetIndex, 1)
                        } else {
                            updatedAssets[existingAssetIndex] = {
                                ...existingAsset,
                                amount: newAmount,
                                value: existingAsset.value - newAsset.value
                            }
                        }
                    }
                } else {
                    if (transactionType === 'buy' || transactionType === 'transfer_in') {
                        updatedAssets.push(newAsset)
                    }
                }
                
                const updatedActivities = [newActivity, ...prev.activities.slice(0, 4)]
                const totalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0)
                
                return {
                    ...prev,
                    assets: updatedAssets,
                    activities: updatedActivities,
                    value: `$${totalValue.toLocaleString()}`
                }
            }
            return prev
        })
    }

    return (
        <>
        <Sidebar 
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            activePortfolio={activePortfolio}
            setActivePortfolio={setActivePortfolio}
            portfolios={portfolios}
            setPortfolios={setPortfolios}
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
        />
      
        </>
    )
}

export default Dashboard