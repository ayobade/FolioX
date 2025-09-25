import React from 'react'
import styled from 'styled-components'
import logo from '/Logoblack.png'

function Header() {
    return (
        <HeaderBar>
            <HeaderInner>
                <Logo>
                    <LogoImg src={logo} alt="logo" />
                </Logo>
                <Actions>
                    <Button>Login</Button>
                    <PrimaryButton>Sign up</PrimaryButton>
                </Actions>
            </HeaderInner>
        </HeaderBar>
    )
}

const HeaderBar = styled.header`
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
`

const HeaderInner = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    margin: 0 auto;
    width: 80vw;

    @media (max-width: 1200px) {
        width: 100vw;
    }
`

const Logo = styled.div`
    text-align: left;
`

const LogoImg = styled.img`
    height: 32px;
    width: auto;
    display: block;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const Button = styled.button`
    padding: 8px 14px;
    font-size: 14px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #111827;
    background-color: transparent;
    color: #111827;
`

const PrimaryButton = styled(Button)`
    background-color: #111827;
    color: #ffffff;
`

export default Header