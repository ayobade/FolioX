import React, { useState } from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  height: auto;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #111827;
  }
`

const Content = styled.div`
  padding: 0 24px 24px 24px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 8px;
`

const IconOption = styled.button`
  width: 48px;
  height: 48px;
  border: 2px solid ${props => props.$selected ? '#111827' : '#e5e7eb'};
  border-radius: 12px;
  background: ${props => props.$gradient || '#f3f4f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #111827;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$selected ? '#ffffff' : '#6b7280'};
  }
`

const CharacterCounter = styled.div`
  font-size: 12px;
  color: ${props => props.$exceeded ? '#ef4444' : '#6b7280'};
  margin-top: 4px;
  text-align: right;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background-color: #111827;
    color: #ffffff;
    
    &:hover {
      background-color: #0f172a;
    }
    
    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background-color: #ffffff;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background-color: #f9fafb;
    }
  `}
`

const preloadedIcons = [
  {
    id: 'rocket',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5s8 4.5 8 11.5c0 1.1-.9 2-2 2s-2-.9-2-2c0-3.5-2.5-6.5-4-6.5s-4 3-4 6.5c0 1.1-.9 2-2 2s-2-.9-2-2c0-7 8-11.5 8-11.5z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    )
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V9h2v4zm0-6h-2V5h2v2zm4 10h-2v-2h2v2zm0-4h-2V9h2v4zm0-6h-2V5h2v2z"/>
      </svg>
    )
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    id: 'chart',
    name: 'Chart',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v10H7V7zm4-2h2v12h-2V5zm4 4h2v8h-2V9z"/>
      </svg>
    )
  },
  {
    id: 'diamond',
    name: 'Diamond',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2L2 7l10 13 10-13-4-5H6zm2.5 5h7L12 9.5 8.5 7z"/>
      </svg>
    )
  },
  {
    id: 'star',
    name: 'Star',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )
  },
  {
    id: 'shield',
    name: 'Shield',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
    )
  },
  {
    id: 'trending',
    name: 'Trending',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    )
  },
  {
    id: 'wallet',
    name: 'Wallet',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 7H3C1.9 7 1 7.9 1 9v6c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-1 6H4V9h16v4z"/>
        <circle cx="15" cy="11" r="1"/>
      </svg>
    )
  },
  {
    id: 'coin',
    name: 'Coin',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    )
  },
  {
    id: 'gem',
    name: 'Gem',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2L2 8l4 6 6-6 6 6 4-6-4-6H6zm2.5 4h7L12 8.5 8.5 6z"/>
      </svg>
    )
  },
  {
    id: 'trophy',
    name: 'Trophy',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 8.1 18.1 9 17 9H15V11H17C17.55 11 18 11.45 18 12S17.55 13 17 13H7C6.45 13 6 12.55 6 12S6.45 11 7 11H9V9H7C5.9 9 5 8.1 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7Z"/>
      </svg>
    )
  }
]

function CreatePortfolioModal({ isOpen, onClose, onCreatePortfolio }) {
  const [portfolioName, setPortfolioName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('rocket')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (portfolioName.trim() && portfolioName.length <= 24) {
      const selectedIconData = preloadedIcons.find(icon => icon.id === selectedIcon)
      onCreatePortfolio({
        name: portfolioName.trim(),
        icon: selectedIconData
      })
      setPortfolioName('')
      setSelectedIcon('rocket')
    }
  }

  const handleClose = () => {
    setPortfolioName('')
    setSelectedIcon('rocket')
    onClose()
  }

  if (!isOpen) return null

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Create New Portfolio</Title>
          <CloseButton onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </CloseButton>
        </Header>
        
        <Content>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Portfolio Name</Label>
              <Input
                type="text"
                placeholder="Enter portfolio name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                maxLength={24}
                required
              />
              <CharacterCounter $exceeded={portfolioName.length > 24}>
                {portfolioName.length}/24
              </CharacterCounter>
            </FormGroup>
            
            <FormGroup>
              <Label>Choose Icon</Label>
              <IconGrid>
                {preloadedIcons.map((icon) => (
                  <IconOption
                    key={icon.id}
                    $selected={selectedIcon === icon.id}
                    $gradient={icon.gradient}
                    onClick={() => setSelectedIcon(icon.id)}
                    type="button"
                  >
                    {icon.icon}
                  </IconOption>
                ))}
              </IconGrid>
            </FormGroup>
            
            <ButtonGroup>
              <Button type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                $variant="primary"
                disabled={!portfolioName.trim() || portfolioName.length > 24}
              >
                Create Portfolio
              </Button>
            </ButtonGroup>
          </Form>
        </Content>
      </Modal>
    </Overlay>
  )
}

export default CreatePortfolioModal
