import React from 'react'
import styled from 'styled-components'

function HowItWorks() {
    return (
        <Section>
            <Container>
                <Title>How It Works</Title>
                <Caption>Get started with FolioX in just a few simple steps</Caption>
                
                <StepsContainer>
                    
                    <Step>
                        <StepNumber>1</StepNumber>
                        <StepContent>
                            <StepTitle>Import Your Holdings</StepTitle>
                            <StepDescription>
                                Automatically sync your crypto holdings across multiple exchanges and wallets. 
                                Your portfolio data is updated in real-time.
                            </StepDescription>
                        </StepContent>
                    </Step>

                    <Step>
                        <StepNumber>2</StepNumber>
                        <StepContent>
                            <StepTitle>Track & Analyze</StepTitle>
                            <StepDescription>
                                Monitor your portfolio performance with detailed analytics, charts, 
                                and insights. Make informed decisions with comprehensive market data.
                            </StepDescription>
                        </StepContent>
                    </Step>

                    <Step>
                        <StepNumber>3</StepNumber>
                        <StepContent>
                            <StepTitle>Optimize & Grow</StepTitle>
                            <StepDescription>
                                Use our advanced tools to rebalance your portfolio, set alerts, 
                                and discover new investment opportunities.
                            </StepDescription>
                        </StepContent>
                    </Step>
                </StepsContainer>
            </Container>
        </Section>
    )
}

const Section = styled.section`
    width: 100%;
    padding: 80px 20px;
    margin-top: 32px;
    background-color: #f9fafb;
`

const Container = styled.div`
    max-width: 80vw;
    margin: 0 auto;
    text-align: center;
`

const Title = styled.h2`
    font-size: 48px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
    line-height: 1.1;

    @media (max-width: 768px) {
        font-size: 36px;
    }
`

const Caption = styled.p`
    font-size: 18px;
    color: #6b7280;
    margin: 0 0 64px 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
`

const StepsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
    margin-top: 64px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`

const Step = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;

    &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 40px;
        right: -20px;
        width: 40px;
        height: 2px;
        background-color: #d1d5db;
        transform: translateY(-50%);

        @media (max-width: 768px) {
            display: none;
        }
    }
`

const StepNumber = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #111827 0%, #374151 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(17, 24, 39, 0.15);
`

const StepContent = styled.div`
    max-width: 280px;
`

const StepTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 12px 0;
`

const StepDescription = styled.p`
    font-size: 16px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
`

export default HowItWorks
