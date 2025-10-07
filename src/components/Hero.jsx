import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import bg from '/bg.png'

function Hero() {
    return (
        <Wrapper>
            <Container>
                <Title>Track, Analyze, Grow.</Title>
                <Caption>
                    Manage your crypto investments effortlessly with FolioX. real-time portfolio tracking, market insights, and performance charts all in one place
                </Caption>
                <Actions>
                        <PrimaryButton><StyledLink to="/signup">Join Now</StyledLink></PrimaryButton>
                    <SecondaryButton>Learn More</SecondaryButton>
                </Actions>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 24px 20px;
`

const Container = styled.div`
    width: 80vw;
    min-height: 600px;
    background-image: url(${bg});
    background-size: cover;
    background-position: center;
    border-radius: 20px;
    padding: 48px 40px;
    color: #0b1020;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;

    @media (max-width: 1200px) {
        width: 100vw;
    }
`

const Title = styled.h1`
    font-size: 56px;
    line-height: 1.05;
    font-weight: 600;
    margin: 0;
    color: #0b1020;
`

const Caption = styled.p`
    max-width: 620px;
    font-size: 16px;
    color: #1f2937;
    margin: 0;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
`

const BaseButton = styled.button`
    padding: 10px 18px;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid transparent;
`

const PrimaryButton = styled(BaseButton)`
    background-color: #111827;
    color: #ffffff;
`

const SecondaryButton = styled(BaseButton)`
    background-color: rgba(255,255,255,0.9);
    border-color: #e5e7eb;
    color: #111827;
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

export default Hero


