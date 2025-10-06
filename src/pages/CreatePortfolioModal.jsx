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

const preloadedIcons = [
  {
    id: 'rocket-1',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)" />
  },
  {
    id: 'rocket-2',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
  },
  {
    id: 'rocket-3',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" />
  },
  {
    id: 'rocket-4',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
  },
  {
    id: 'rocket-5',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" />
  },
  {
    id: 'rocket-6',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" />
  },
  {
    id: 'rocket-7',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)" />
  },
  {
    id: 'rocket-8',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)" />
  },
  {
    id: 'rocket-9',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)" />
  },
  {
    id: 'rocket-10',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
  },
  {
    id: 'rocket-11',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" />
  },
  {
    id: 'rocket-12',
    name: 'Rocket',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    icon: <RocketIcon $gradient="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" />
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
