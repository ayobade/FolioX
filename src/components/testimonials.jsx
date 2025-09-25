import React from 'react'
import styled from 'styled-components'

function Testimonials() {
    return (
        <Section>
            <Container>
                <Title>What Our Users Say</Title>
                <Caption>Join thousands of crypto investors who trust FolioX</Caption>
                
                <TestimonialsGrid>
                    <TestimonialCard>
                        <Quote>
                            "FolioX has completely transformed how I manage my crypto portfolio. 
                            The real-time tracking and analytics are game-changing."
                        </Quote>
                        <Author>
                            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"  />
                            <AuthorInfo>
                                <Name>Alex Chen</Name>
                                <Role>Crypto Investor</Role>
                            </AuthorInfo>
                        </Author>
                    </TestimonialCard>

                    <TestimonialCard>
                        <Quote>
                            "Finally, a portfolio tracker that's both powerful and easy to use. 
                            The interface is clean and the insights are incredibly valuable."
                        </Quote>
                        <Author>
                            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
                            <AuthorInfo>
                                <Name>Sarah Johnson</Name>
                                <Role>DeFi Enthusiast</Role>
                            </AuthorInfo>
                        </Author>
                    </TestimonialCard>

                    <TestimonialCard>
                        <Quote>
                            "The portfolio analytics helped me optimize my holdings and increase 
                            my returns by 23% in just 3 months. Highly recommended!"
                        </Quote>
                        <Author>
                            <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
                            <AuthorInfo>
                                <Name>Mike Rodriguez</Name>
                                <Role>Portfolio Manager</Role>
                            </AuthorInfo>
                        </Author>
                    </TestimonialCard>
                </TestimonialsGrid>

                <StatsContainer>
                    <Stat>
                        <StatNumber>50K+</StatNumber>
                        <StatLabel>Active Users</StatLabel>
                    </Stat>
                    <Stat>
                        <StatNumber>$2.5B+</StatNumber>
                        <StatLabel>Assets Tracked</StatLabel>
                    </Stat>
                    <Stat>
                        <StatNumber>99.9%</StatNumber>
                        <StatLabel>Uptime</StatLabel>
                    </Stat>
                    <Stat>
                        <StatNumber>4.9/5</StatNumber>
                        <StatLabel>User Rating</StatLabel>
                    </Stat>
                </StatsContainer>
            </Container>
        </Section>
    )
}

const Section = styled.section`
    width: 100%;
    padding: 80px 20px;
    background-color: #ffffff;
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

const TestimonialsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
    margin-bottom: 80px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
`

const TestimonialCard = styled.div`
    background-color: #f9fafb;
    padding: 32px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    text-align: left;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
`

const Quote = styled.p`
    font-size: 16px;
    line-height: 1.6;
    color: #374151;
    margin: 0 0 24px 0;
    font-style: italic;
`

const Author = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`

const Avatar = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
`

const AuthorInfo = styled.div`
    display: flex;
    flex-direction: column;
`

const Name = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px 0;
`

const Role = styled.p`
    font-size: 14px;
    color: #6b7280;
    margin: 0;
`

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 40px 0;
    border-top: 1px solid #e5e7eb;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }
`

const Stat = styled.div`
    text-align: center;
`

const StatNumber = styled.div`
    font-size: 36px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #111827 0%, #374151 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
        font-size: 28px;
    }
`

const StatLabel = styled.p`
    font-size: 16px;
    color: #6b7280;
    margin: 0;
    font-weight: 500;
`

export default Testimonials
