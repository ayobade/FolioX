import React from 'react'
import styled from 'styled-components'
import logo from '/Logoblack.png'

function Footer() {
    return (
        <FooterContainer>
            <Container>
                <TopSection>
                    <BrandSection>
                        <Logo>
                            <LogoImg src={logo} alt="FolioX Logo" />
                        </Logo>
                        <BrandDescription>
                            Track, analyze, and optimize your crypto portfolio with FolioX. 
                            Real-time insights for smarter investment decisions.
                        </BrandDescription>
                        <SocialLinks>
                            <SocialLink href="#" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </SocialLink>
                            <SocialLink href="#" aria-label="Discord">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                            </SocialLink>
                            <SocialLink href="#" aria-label="Telegram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </SocialLink>
                            <SocialLink href="#" aria-label="GitHub">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </SocialLink>
                        </SocialLinks>
                    </BrandSection>

                    <LinksSection>
                       

                        <LinkColumn>
                            <ColumnTitle>Company</ColumnTitle>
                            <LinkList>
                                <LinkItem><Link href="#">About Us</Link></LinkItem>
                                
                                <LinkItem><Link href="#">Contact</Link></LinkItem>
                            </LinkList>
                        </LinkColumn>

                        <LinkColumn>
                            <ColumnTitle>Support</ColumnTitle>
                            <LinkList>
                                <LinkItem><Link href="#">Help Center</Link></LinkItem>
                                <LinkItem><Link href="#">Documentation</Link></LinkItem>
                               
                            </LinkList>
                        </LinkColumn>

                       
                    </LinksSection>
                </TopSection>

                <BottomSection>
                    <Copyright>
                        © 2024 FolioX. All rights reserved.
                    </Copyright>
                </BottomSection>
            </Container>
        </FooterContainer>
    )
}

const FooterContainer = styled.footer`
    width: 100%;
    background-color: #111827;
    color: #ffffff;
    margin-top: 80px;
`

const Container = styled.div`
    max-width: 80vw;
    margin: 0 auto;
    padding: 64px 20px 32px 20px;

    @media (max-width: 1200px) {
        max-width: 100vw;
    }
`

const TopSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 64px;
    margin-bottom: 48px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 48px;
    }
`

const BrandSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const Logo = styled.div`
    display: flex;
    align-items: center;
`

const LogoImg = styled.img`
    height: 40px;
    width: auto;
    filter: brightness(0) invert(1);
`

const BrandDescription = styled.p`
    font-size: 16px;
    line-height: 1.6;
    color: #9ca3af;
    margin: 0;
    max-width: 400px;
`

const SocialLinks = styled.div`
    display: flex;
    gap: 16px;
`

const SocialLink = styled.a`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
        background-color: #4b5563;
        color: #ffffff;
        transform: translateY(-2px);
    }
`

const LinksSection = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
`

const LinkColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const ColumnTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
`

const LinkList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const LinkItem = styled.li`
    margin: 0;
`

const Link = styled.a`
    font-size: 14px;
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
        color: #ffffff;
    }
`

const BottomSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 32px;
    border-top: 1px solid #374151;
    text-align: center;
`

const Copyright = styled.p`
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
}
`


export default Footer