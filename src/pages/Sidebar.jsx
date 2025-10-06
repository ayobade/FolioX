import React, { useState } from 'react'
import styled from 'styled-components'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import logo from '/Logoblack.png'
import logoIcon from '/Logoicon.png'
import CreatePortfolioModal from './CreatePortfolioModal'
import { usePrice } from '../contexts/PriceProvider'
import { usePortfolio } from '../contexts/PortfolioContext'

const SidebarContainer = styled.div`
  width: ${props => props.$isCollapsed ? '80px' : '300px'};
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  border-right: 1px solid #e1e5e9;
  padding: ${props => props.$isCollapsed ? '32px 16px' : '32px 24px'};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow: ${props => props.$isCollapsed ? 'visible' : 'auto'};
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  transform: ${props => props.$isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
  
  @media (min-width: 1201px) {
    transform: translateX(0);
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #e1e5e9;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #c7d2da;
  }
`

const LogoSection = styled.div`
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e8ecf0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #e8ecf0 50%, transparent 100%);
  }
`

const LogoImg = styled.img`
  height: ${props => props.$isCollapsed ? '32px' : '36px'};
  width: auto;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
  transition: all 0.3s ease;
`

const CollapseButton = styled.button`
  background: rgba(100, 116, 139, 0.1);
  border: none;
  cursor: pointer;
  padding: 0px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 24px;
  height: 36px;
  flex-shrink: 0;
  
  &:hover {
    color: #475569;
    background: rgba(100, 116, 139, 0.15);
    transform: scale(1.05);
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
`

const OverviewSection = styled.div`
  margin-bottom: 40px;
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  
  @media (max-width: 1200px) {
    display: block;
  }
  
  @media (min-width: 1201px) {
    display: ${props => props.$isCollapsed ? 'none' : 'block'};
  }
`

const OverviewItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
`

const OverviewIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`

const GridIcon = styled.div`
  width: 20px;
  height: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
`

const GridDot = styled.div`
  width: 4px;
  height: 4px;
  background-color: #ffffff;
  border-radius: 50%;
`

const OverviewInfo = styled.div`
  flex: 1;
`

const OverviewLabel = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
`

const OverviewValue = styled.div`
  font-size: 15px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: -0.005em;
`

const PortfoliosSection = styled.div`
  flex: 1;
  margin-bottom: 32px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 4px;
  display: ${props => props.$isCollapsed ? 'none' : 'flex'};
  
  @media (max-width: 1200px) {
    display: flex;
  }
  
  @media (min-width: 1201px) {
    display: ${props => props.$isCollapsed ? 'none' : 'flex'};
  }
`

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.01em;
`

const EditIcon = styled.button`
  background: rgba(100, 116, 139, 0.1);
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #475569;
    background: rgba(100, 116, 139, 0.15);
    transform: scale(1.05);
  }
`

const PortfolioItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.$isCollapsed ? '0' : '16px 20px'};
  margin-bottom: 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
    : 'transparent'};
  border: ${props => props.$isActive 
    ? '1px solid #cbd5e1' 
    : '1px solid transparent'};
  box-shadow: ${props => props.$isActive 
    ? '0 4px 12px rgba(0, 0, 0, 0.06)' 
    : 'none'};
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  width: ${props => props.$isCollapsed ? '48px' : 'auto'};
  height: ${props => props.$isCollapsed ? '48px' : 'auto'};
  
  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 1200px) {
    padding: 16px 20px;
    width: auto;
    height: auto;
    justify-content: flex-start;
  }
  
  @media (min-width: 1201px) {
    padding: ${props => props.$isCollapsed ? '0' : '16px 20px'};
    width: ${props => props.$isCollapsed ? '48px' : 'auto'};
    height: ${props => props.$isCollapsed ? '48px' : 'auto'};
    justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  }
`

const PortfolioIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.$isCollapsed ? '0' : '16px'};
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  
  &:active {
    transform: scale(0.98);
  }
`

const DefaultIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
`

const RocketIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.$gradient || 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'};
  position: relative;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 8px;
    background-color: #ffffff;
    border-radius: 0 0 6px 6px;
  }
`

const PortfolioInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  
  @media (max-width: 1200px) {
    display: block;
  }
  
  @media (min-width: 1201px) {
    display: ${props => props.$isCollapsed ? 'none' : 'block'};
  }
`

const PortfolioName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
  letter-spacing: -0.005em;
`

const PortfolioValue = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: -0.002em;
`

const CreateButton = styled.button`
  width: 100%;
  background: transparent;
  color: #111827;
  border: none;
  border-radius: 16px;
  padding: ${props => props.$isCollapsed ? '18px' : '18px 20px'};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.$isCollapsed ? '0' : '10px'};
  transition: all 0.3s ease;
  margin-bottom: 20px;
  letter-spacing: -0.005em;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
  }
  
  @media (max-width: 1200px) {
    padding: 18px 20px;
    gap: 10px;
  }
  
  @media (min-width: 1201px) {
    padding: ${props => props.$isCollapsed ? '18px' : '18px 20px'};
    gap: ${props => props.$isCollapsed ? '0' : '10px'};
  }
  
  &:active {
    transform: translateY(0);
  }
`

const PlusIcon = styled.span`
  font-size: 18px;
  font-weight: bold;
`

const SignOutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg,rgb(17, 17, 17) 0%,rgb(35, 35, 35) 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: ${props => props.$isCollapsed ? '18px' : '18px 20px'};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.$isCollapsed ? '0' : '10px'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  letter-spacing: -0.005em;
  position: relative;
  
  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  }
  
  @media (max-width: 1200px) {
    padding: 18px 20px;
    gap: 10px;
  }
  
  @media (min-width: 1201px) {
    padding: ${props => props.$isCollapsed ? '18px' : '18px 20px'};
    gap: ${props => props.$isCollapsed ? '0' : '10px'};
  }
  
  &:active {
    transform: translateY(0);
  }
`

const Tooltip = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  background: #1f2937;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-right-color: #1f2937;
  }
  
  ${props => props.$show && `
    opacity: 1;
    visibility: visible;
  `}
`

const TooltipContainer = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`

function Sidebar({ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, activePortfolio, setActivePortfolio, portfolios, setPortfolios, handleCreatePortfolio, handlePortfolioClick, totalPortfolioValue }) {
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false)
  const navigate = useNavigate()
  const { priceData, symbolToCoinId } = usePrice()
  const { transactionsByPortfolio, computeStateFromTransactions, getTransactions } = usePortfolio()

  React.useEffect(() => {
    if (!portfolios || !portfolios.length) return
    portfolios.forEach(p => {
      const key = String(p.id)
      if (!transactionsByPortfolio[key]) {
        getTransactions(key)
      }
    })
  }, [portfolios])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const onCreatePortfolio = (portfolioData) => {
    handleCreatePortfolio(portfolioData)
    setIsCreatePortfolioModalOpen(false)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const onPortfolioClick = (portfolioId) => {
    handlePortfolioClick(portfolioId)
  }


  return (
    <>
    <SidebarContainer $isCollapsed={isCollapsed} $isMobileMenuOpen={isMobileMenuOpen}>
      <LogoSection>
        <LogoImg 
          src={isCollapsed ? logoIcon : logo} 
          alt="FolioX Logo" 
          $isCollapsed={isCollapsed} 
        />
        <CollapseButton onClick={toggleCollapse}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={isCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CollapseButton>
      </LogoSection>
      
      <OverviewSection $isCollapsed={isCollapsed}>
        <OverviewItem>
          <OverviewIcon>
            <GridIcon>
              {Array.from({ length: 9 }).map((_, index) => (
                <GridDot key={index} />
              ))}
            </GridIcon>
          </OverviewIcon>
          <OverviewInfo>
            <OverviewLabel>Overview</OverviewLabel>
            <OverviewValue>{(() => {
              const sum = (portfolios || []).reduce((acc, p) => {
                let assetsForValue = []
                if (p.id === activePortfolio?.id && activePortfolio?.assets?.length) assetsForValue = activePortfolio.assets
                const txs = transactionsByPortfolio[String(p.id)]
                if (!assetsForValue.length && txs && txs.length) assetsForValue = computeStateFromTransactions(txs).assets
                if (!assetsForValue || !assetsForValue.length) return acc
                const val = assetsForValue.reduce((s, a) => {
                  const cid = symbolToCoinId[a.symbol] || a.symbol?.toLowerCase()
                  const cp = priceData[cid]?.usd || (a.value / (a.amount || 1))
                  return s + (a.amount * cp)
                }, 0)
                return acc + val
              }, 0)
              return `$${Number(sum || 0).toLocaleString()}`
            })()}</OverviewValue>
          </OverviewInfo>
        </OverviewItem>
      </OverviewSection>

      <PortfoliosSection>
        <SectionHeader $isCollapsed={isCollapsed}>
          <SectionTitle>My portfolios({portfolios.length})</SectionTitle>
          
        </SectionHeader>
        
        {portfolios.map((portfolio) => {
          const isActive = portfolio.isActive || portfolio.id === activePortfolio?.id
          let computedValue = portfolio.value || '$0.00'
          let assetsForValue = []
          if (portfolio.id === activePortfolio?.id && activePortfolio?.assets?.length) assetsForValue = activePortfolio.assets
          const txs = transactionsByPortfolio[String(portfolio.id)]
          if (!assetsForValue.length && txs && txs.length) assetsForValue = computeStateFromTransactions(txs).assets
          if (assetsForValue && assetsForValue.length) {
            const total = assetsForValue.reduce((sum, asset) => {
              const coinId = symbolToCoinId[asset.symbol] || asset.symbol?.toLowerCase()
              const currentPrice = priceData[coinId]?.usd || (asset.value / (asset.amount || 1))
              return sum + (asset.amount * currentPrice)
            }, 0)
            computedValue = `$${Number(total || 0).toLocaleString()}`
          }
          return (
          <TooltipContainer key={portfolio.id}>
            <PortfolioItem $isActive={isActive} $isCollapsed={isCollapsed} onClick={() => onPortfolioClick(portfolio.id)}>
              <PortfolioIcon $bgColor={portfolio.isActive ? '#f1f5f9' : '#ffffff'} $isCollapsed={isCollapsed}>
                {portfolio.iconType?.startsWith('rocket') ? (
                  <RocketIcon $gradient={portfolio.gradient || 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'} />
                ) : portfolio.iconType === 'bitcoin' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}} />
                ) : portfolio.iconType === 'ethereum' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}} />
                ) : portfolio.iconType === 'chart' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}} />
                ) : portfolio.iconType === 'diamond' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'}} />
                ) : portfolio.iconType === 'star' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'}} />
                ) : portfolio.iconType === 'shield' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}} />
                ) : portfolio.iconType === 'trending' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'}} />
                ) : portfolio.iconType === 'wallet' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'}} />
                ) : portfolio.iconType === 'coin' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}} />
                ) : portfolio.iconType === 'gem' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'}} />
                ) : portfolio.iconType === 'trophy' ? (
                  <DefaultIcon style={{background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'}} />
                ) : (
                  <RocketIcon />
                )}
            </PortfolioIcon>
              <PortfolioInfo $isCollapsed={isCollapsed}>
              <PortfolioName>{portfolio.name}</PortfolioName>
              <PortfolioValue>{computedValue}</PortfolioValue>
            </PortfolioInfo>
          </PortfolioItem>
            {isCollapsed && (
              <Tooltip>
                {portfolio.name} - {computedValue}
              </Tooltip>
            )}
          </TooltipContainer>
        )})}
        
        <TooltipContainer>
          <CreateButton $isCollapsed={isCollapsed} onClick={() => setIsCreatePortfolioModalOpen(true)}>
        <PlusIcon>+</PlusIcon>
            {!isCollapsed && 'Create portfolio'}
          </CreateButton>
          {isCollapsed && (
            <Tooltip>
        Create portfolio
            </Tooltip>
          )}
        </TooltipContainer>
      </PortfoliosSection>

      <TooltipContainer>
        <SignOutButton onClick={handleSignOut} $isCollapsed={isCollapsed}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {!isCollapsed && 'Sign out'}
        </SignOutButton>
        {isCollapsed && (
          <Tooltip>
            Sign out
          </Tooltip>
        )}
      </TooltipContainer>
    </SidebarContainer>
    
    <CreatePortfolioModal 
      isOpen={isCreatePortfolioModalOpen}
      onClose={() => setIsCreatePortfolioModalOpen(false)}
      onCreatePortfolio={onCreatePortfolio}
    />
    </>
  )
}

export default Sidebar
