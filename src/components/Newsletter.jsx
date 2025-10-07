import React, { useState } from 'react'
import styled from 'styled-components'
import bg from '/bg.png'

function Newsletter() {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setEmail('')
    }

    return (
        <Section>
            <Container>
                <Title>Subscribe To Our Newsletter</Title>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <SubscribeButton type="submit">
                            Subscribe
                        </SubscribeButton>
                    </InputGroup>
                </Form>
            </Container>
        </Section>
    )
}

const Section = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    border-radius: 32px;
    width: 80vw;
    height: 450px;
    padding: 80px 20px;
    background-image: url(${bg});
    background-size: cover;
    background-position: center;
    margin-top: 80px;

    @media (max-width: 1200px) {
        width: 95vw;
    }
`

const Container = styled.div`
    max-width: 80vw;
    margin: 0 auto;
    text-align: center;
`

const Title = styled.h2`
    font-size: 48px;
    font-weight: 600;
    width:400px;
    color: #111827;
    margin: 0 0 48px 0;
    line-height: 1.1;

    @media (max-width: 768px) {
        font-size: 36px;
    }
`

const Form = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
`

const InputGroup = styled.div`
    display: flex;
    max-width: 500px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    @media (max-width: 768px) {
        flex-direction: column;
        max-width: 400px;
    }
`

const Input = styled.input`
    flex: 1;
    padding: 16px 20px;
    border: none;
    outline: none;
    font-size: 16px;
    color: #111827;
    background-color: transparent;

    &::placeholder {
        color: #9ca3af;
    }

    @media (max-width: 768px) {
        padding: 14px 16px;
        font-size: 14px;
    }
`

const SubscribeButton = styled.button`
    padding: 16px 32px;
    background-color: #111827;
    color: #ffffff;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    &:hover {
        background-color: #111827;
    }

    &:active {
        transform: translateY(1px);
    }

    @media (max-width: 768px) {
        padding: 14px 24px;
        font-size: 14px;
    }
`

export default Newsletter
