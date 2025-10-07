import React, { useState } from 'react'
import styled from 'styled-components'
import bg from '/bg.png'
import { Link } from 'react-router-dom'
import logo from '/Logoblack.png'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleGoogleSignUp = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            navigate('/dashboard')
        } catch (err) {
            const code = err?.code || ''
            if (code === 'auth/popup-closed-by-user') {
                return
            } else if (code === 'auth/popup-blocked') {
                setError('Popup was blocked. Please allow popups for this site.')
            } else if (code === 'auth/cancelled-popup-request') {
                return
            } else {
                setError('Unable to sign up with Google. Please try again.')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            if (cred?.user) {
                await sendEmailVerification(cred.user, {
                    url: 'http://localhost:5173/login',
                })
            }
            setShowSuccess(true)
        } catch (err) {
            const code = err?.code || ''
            if (code === 'auth/email-already-in-use') {
                setError('Email already in use.')
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.')
            } else if (code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.')
            } else {
                setError('Unable to sign up. Please try again.')
            }
        }
    }

    return (
        <div>
        <Container>
            <LeftSection>
                <Logo>
                    <Link to="/" aria-label="Go to home">
                        <LogoImg src={logo} alt="FolioX Logo" />
                    </Link>
                </Logo>
                <Content>
                    <Title>Already a member of FolioX?</Title>
                    <Description>
                        Login to your account to continue.
                    </Description>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <SignUpButton>
                            Login
                        </SignUpButton>
                    </Link>
                </Content>
            </LeftSection>

            <RightSection>
                <FormContainer>
                    <FormTitle>
                        Welcome to FolioX Dashboard
                    </FormTitle>

                    <SocialButtons>
                        <SocialButton onClick={handleGoogleSignUp} type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign up with Google
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
                            <PasswordField>
                                <PasswordInput
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <ToggleVisibility
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 3l18 18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M10.584 10.584A3 3 0 0012 15a3 3 0 002.828-4.116M4.5 12C6.5 7 10 5 12 5s5.5 2 7.5 7c-.566 1.416-1.338 2.676-2.287 3.74M6.29 6.29C4.94 7.45 3.79 9.03 3 12c2 5 6 7 9 7 1.533 0 3.064-.47 4.5-1.37" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </ToggleVisibility>
                            </PasswordField>
                        </InputGroup>
                        {error ? <ErrorText>{error}</ErrorText> : null}

                        <Options>
                            <CheckboxGroup>
                                <Checkbox type="checkbox" id="remember" />
                                <Label htmlFor="remember">Remember me</Label>
                            </CheckboxGroup>
                            <ForgotLink href="#">Forgot password?</ForgotLink>
                        </Options>

                        <SubmitButton type="submit">
                            {isLogin ? 'Sign up' : 'Login'}
                        </SubmitButton>
                    </Form>

                    <BottomText>
                        Already a member of FolioX?{' '}
                        <SignUpLink to="/login">Login</SignUpLink>
                    </BottomText>
                </FormContainer>
            </RightSection>
        </Container>
        {showSuccess && (
            <ModalOverlay>
                <ModalCard>
                    <ModalTitle>Signup successful!</ModalTitle>
                    <ModalText>Please check your email to verify your account.</ModalText>
                    <ModalActions>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <PrimaryAction onClick={() => setShowSuccess(false)}>Go to Login</PrimaryAction>
                        </Link>
                        <SecondaryAction onClick={() => setShowSuccess(false)}>Close</SecondaryAction>
                    </ModalActions>
                </ModalCard>
            </ModalOverlay>
        )}
    </div>
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

const PasswordField = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 44px 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;

    &:focus-within {
        border-color: #111827;
    }
`

const PasswordInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: #111827;

    &::placeholder {
        color: #9ca3af;
    }
`

const ToggleVisibility = styled.button`
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    color: #6b7280;

    &:hover {
        color: #111827;
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

const SignUpLink = styled(Link)`
    color: #111827;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: #374151;
    }
`

const ErrorText = styled.p`
    color: #ef4444;
    font-size: 12px;
    margin: 0 0 8px 0;
`



const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

const ModalCard = styled.div`
    background: #ffffff;
    width: 90%;
    max-width: 420px;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    text-align: center;
`

const ModalTitle = styled.h3`
    margin: 0 0 8px 0;
    font-size: 20px;
    color: #111827;
    font-weight: 700;
`

const ModalText = styled.p`
    margin: 0 0 20px 0;
    color: #374151;
    font-size: 14px;
`

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
`

const PrimaryAction = styled.button`
    padding: 10px 16px;
    background: #111827;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
`

const SecondaryAction = styled.button`
    padding: 10px 16px;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
`

export default Signup