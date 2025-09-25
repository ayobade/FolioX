import React, { useState } from 'react'
import styled from 'styled-components'
import bg from '/bg.png'
import { Link } from 'react-router-dom'
import logo from '/Logoblack.png'

function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
      
        console.log(isLogin ? 'Login' : 'Signup', { email, password })
    }

    return (
        <Container>
            <LeftSection>
                <Logo>
                    <LogoImg src={logo} alt="FolioX Logo" />
                </Logo>
                <Content>
                    <Title>New to FolioX?</Title>
                    <Description>
                        Start for free and see how our portfolio tracking can help you manage your crypto investments.
                    </Description>
                    <SignUpButton onClick={() => setIsLogin(false)}>
                        Sign up
                    </SignUpButton>
                </Content>
            </LeftSection>

            <RightSection>
                <FormContainer>
                    <FormTitle>
                        Welcome to FolioX Dashboard
                    </FormTitle>

                    <SocialButtons>
                        <SocialButton>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Log in with Google
                        </SocialButton>
                    </SocialButtons>

                    <Divider>
                        <DividerLine />
                        <DividerText>OR</DividerText>
                        <DividerLine />
                    </Divider>

                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <Options>
                            <CheckboxGroup>
                                <Checkbox type="checkbox" id="remember" />
                                <Label htmlFor="remember">Remember me</Label>
                            </CheckboxGroup>
                            <ForgotLink href="#">Forgot password?</ForgotLink>
                        </Options>

                        <SubmitButton type="submit">
                            {isLogin ? 'Login' : 'Sign up'}
                        </SubmitButton>
                    </Form>

                    <BottomText>
                        New to FolioX? Start now{' '}
                        <SignUpLink as={Link} to="/signup">
                            Sign up
                        </SignUpLink>
                    </BottomText>
                </FormContainer>
            </RightSection>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    width: 100%;
`

const LeftSection = styled.div`
    flex: 0 0 35%;
    background-image: url(${bg});
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 40px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);
    }
@media (max-width: 1200px) {
        flex: 0 0 40%;
    }
    @media (max-width: 768px) {
        display: none;
    }
`

const Logo = styled.div`
    position: relative;
    z-index: 1;
`

const LogoImg = styled.img`
    height: 24px;
    width: auto;
    display: block;
`

const Content = styled.div`
    position: relative;
    z-index: 1;
    text-align: center;
    color: #111827;
    margin-top: 200px;
`

const Title = styled.h2`
    font-size: 32px;
    font-weight: 600;
    margin: 0 0 24px 0;
    line-height: 1.1;

    @media (max-width: 1024px) {
        font-size: 36px;
    }
`

const Description = styled.p`
    font-size: 16px;
    line-height: 1.4;
    margin: 0 0 32px 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
`

const SignUpButton = styled.button`
    padding: 12px 32px;
    background-color:  #ffffff;
    color: #111827;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #ffffff;
    }
`

const RightSection = styled.div`
    flex: 1;
    background-color: #ffffff;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px;
    padding-top: 200px;
`

const FormContainer = styled.div`
    width: 100%;
    max-width: 400px;
`

const FormTitle = styled.h2`
    font-size: 32px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 32px 0;
    text-align: center;
`

const SocialButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
`

const SocialButton = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    color: #374151;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f9fafb;
        border-color: #d1d5db;
    }
`

const Divider = styled.div`
    display: flex;
    align-items: center;
    margin: 24px 0;
`

const DividerLine = styled.div`
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
`

const DividerText = styled.span`
    padding: 0 16px;
    color: #6b7280;
    font-size: 14px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
`

const Input = styled.input`
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    color: #111827;
    background-color: #ffffff;
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: #111827;
    }

    &::placeholder {
        color: #9ca3af;
    }
`

const Options = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
`

const CheckboxGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

const Checkbox = styled.input`
    width: 16px;
    height: 16px;
    accent-color: #111827;
`

const Label = styled.label`
    font-size: 14px;
    color: #374151;
    cursor: pointer;
`

const ForgotLink = styled.a`
    font-size: 14px;
    color: #111827;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
        color: #374151;
    }
`

const SubmitButton = styled.button`
    padding: 12px 24px;
    background-color: #111827;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 8px;

    &:hover {
        background-color: #374151;
    }
`

const BottomText = styled.p`
    text-align: center;
    font-size: 14px;
    color: #6b7280;
    margin: 24px 0 0 0;
`

const SignUpLink = styled.a`
    color: #111827;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: #374151;
    }
`

export default Login