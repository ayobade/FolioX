import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  height: auto;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  margin: 0;
`;

const CloseBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
`;

const Form = styled.form`
  padding: 24px;
`;

const FieldGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow: auto;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
`;

const CoinSymbol = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  min-width: 50px;
`;

const CoinName = styled.span`
  font-size: 16px;
  color: #6b7280;
  flex: 1;
  margin-left: 12px;
`;

const CoinPrice = styled.span`
  font-size: 16px;
  color: #111827;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
`;

const Preview = styled.div`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
`;

const PreviewLabel = styled.div`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const PreviewValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #111827;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const AddBtn = styled.button`
  background-color: #111827;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0f172a;
  }
`;

const Segments = styled.div`
  background: #eef2f7;
  border-radius: 12px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

const SegmentBtn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background: ${(p) => (p.$active ? '#ffffff' : 'transparent')};
  color: ${(p) => (p.$active ? '#111827' : '#6b7280')};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
`;

const DateInputLike = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  color: #111827;
  background: #ffffff;
  text-align: left;
`;

const PickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const NavBtn = styled.button`
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: #374151;
`;

const MonthLabel = styled.div`
  font-weight: 600;
`;

const Select = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 10px;
  background: #ffffff;
  color: #111827;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const DayCell = styled.button`
  height: 36px;
  border-radius: 10px;
  border: none;
  background: ${(p) => (p.$selected ? '#111827' : '#f9fafb')};
  color: ${(p) => (p.$selected ? '#ffffff' : '#374151')};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(p) => (p.$selected ? '#0f172a' : '#e5e7eb')};
  }
`;

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const TimeInput = styled.input`
  width: 140px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
`;

const ApplyBtn = styled.button`
  width: 100%;
  margin-top: 14px;
  background: #111827;
  color: #ffffff;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0f172a;
  }
`;

const ScreenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #374151;
`;

function AddCoinModal({ isOpen, onClose, onAddCoin }) {
    const [selectedCoin, setSelectedCoin] = useState('')
    const [selectedCoinId, setSelectedCoinId] = useState('')
    const [selectedCoinObj, setSelectedCoinObj] = useState(null)
    const [amount, setAmount] = useState('')
    const [price, setPrice] = useState('')
    const [datePurchased, setDatePurchased] = useState(new Date().toISOString().split('T')[0])
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const modalRef = useRef(null)
    const dropdownRef = useRef(null)
    const [screen, setScreen] = useState('form')
    const now = useMemo(() => new Date(), [])
    const [pickerYear, setPickerYear] = useState(now.getFullYear())
    const [pickerMonth, setPickerMonth] = useState(now.getMonth())
    const [pickerDay, setPickerDay] = useState(now.getDate())
    const [pickerTime, setPickerTime] = useState(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    const [txType, setTxType] = useState('Buy')
    const [transferDirection, setTransferDirection] = useState('Transfer In')

    useEffect(() => {
        if (isOpen) {
            const now = new Date()
            setScreen('form')
            setDatePurchased(now.toISOString())
            setPickerYear(now.getFullYear())
            setPickerMonth(now.getMonth())
            setPickerDay(now.getDate())
            setPickerTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
        }
    }, [isOpen])

    const [coinsList, setCoinsList] = useState([])
    const filteredCoins = coinsList.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedCoinData = selectedCoinObj || coinsList.find(coin => coin.id === selectedCoinId) || coinsList.find(coin => coin.symbol === selectedCoin)

    useEffect(() => {
        if (selectedCoinData && !price) {
            setPrice(String(selectedCoinData.price ?? selectedCoinData.current_price ?? ''))
        }
    }, [selectedCoinData, price])

    useEffect(() => {
        if (!selectedCoinData || !datePurchased) {
            if (selectedCoinData) {
                setPrice(String(selectedCoinData.price ?? selectedCoinData.current_price ?? ''))
            }
            return
        }
        
        const fetchHistoricalPrice = async () => {
            try {
                const coinId = selectedCoinData.id
                const purchaseDate = new Date(datePurchased)
                const today = new Date()
                
                if (purchaseDate > today || (today - purchaseDate) < 24 * 60 * 60 * 1000) {
                    setPrice(String(selectedCoinData.price ?? selectedCoinData.current_price ?? ''))
                    return
                }
                
                const formattedDate = purchaseDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, '-')

                const cacheKey = `cg_history_${coinId}_${formattedDate}`
                const cached = localStorage.getItem(cacheKey)
                if (cached) {
                    const cachedPrice = Number(cached)
                    if (!Number.isNaN(cachedPrice) && cachedPrice > 0) {
                        setPrice(String(cachedPrice))
                        return
                    }
                }

                if (!window.__cgHistoryInflight) {
                    window.__cgHistoryInflight = new Set()
                }
                const inflightKey = `${coinId}_${formattedDate}`
                if (window.__cgHistoryInflight.has(inflightKey)) {
                    return
                }
                window.__cgHistoryInflight.add(inflightKey)
                
                const url = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${formattedDate}`
                
                const res = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                    }
                })
                
                if (res.ok) {
                    const data = await res.json()
                    const historicalPrice = data.market_data?.current_price?.usd
                    if (historicalPrice) {
                        localStorage.setItem(cacheKey, String(historicalPrice))
                        setPrice(String(historicalPrice))
                    } else {
                        setPrice(String(selectedCoinData.price ?? selectedCoinData.current_price ?? ''))
                    }
                } else {
                    setPrice(String(selectedCoinData.price ?? selectedCoinData.current_price ?? ''))
                }

                window.__cgHistoryInflight.delete(inflightKey)
            } catch (error) {
                setPrice(String(selectedCoinData.price ?? selectedCoinData.current_price ?? ''))
            }
        }
        
        fetchHistoricalPrice()
    }, [selectedCoinData, datePurchased])

    useEffect(() => {
        if (!isOpen) return
        const controller = new AbortController()
        const load = async () => {
            try {
                const url = `/cg/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
                const res = await fetch(url, { 
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                  }
                })
                if (!res.ok) return
                const data = await res.json()
                const mapped = data.map((d) => ({ id: d.id, symbol: (d.symbol || '').toUpperCase(), name: d.name, price: d.current_price }))
                setCoinsList(mapped)
            } catch {}
        }
        load()
        return () => controller.abort()
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const controller = new AbortController()
        const timeout = setTimeout(async () => {
            try {
                const q = searchTerm.trim()
                if (!q) return
                const sRes = await fetch(`/cg/api/v3/search?query=${encodeURIComponent(q)}` , { 
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                  }
                })
                if (!sRes.ok) return
                const sJson = await sRes.json()
                const coins = (sJson.coins || []).slice(0, 25)
                const ids = coins.map((c) => c.id)
                if (!ids.length) { setCoinsList([]); return }
                const pRes = await fetch(`/cg/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`, { 
                  signal: controller.signal,
                  headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY
                  }
                })
                if (!pRes.ok) return
                const prices = await pRes.json()
                setCoinsList(coins.map((c) => ({ id: c.id, symbol: (c.symbol || '').toUpperCase(), name: c.name, price: prices[c.id]?.usd ?? null })))
            } catch {}
        }, 250)
        return () => { clearTimeout(timeout); controller.abort() }
    }, [isOpen, searchTerm])

    const totalValue = amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedCoin && amount && price && datePurchased) {
            if (!selectedCoinData) {
                window.alert('Please select a coin from the list')
                return
            }
            const coinData = {
                symbol: selectedCoin,
                name: selectedCoinData?.name || selectedCoin,
                amount: parseFloat(amount),
                price: parseFloat(price),
                datePurchased,
                totalValue: parseFloat(totalValue),
                type: txType,
                transferDirection: txType === 'Transfer' ? transferDirection : undefined
            }
            onAddCoin(coinData)
            handleClose()
        }
    }

    const handleClose = () => {
        setSelectedCoin('')
        setAmount('')
        setPrice('')
        const now = new Date()
        setDatePurchased(now.toISOString())
        setPickerYear(now.getFullYear())
        setPickerMonth(now.getMonth())
        setPickerDay(now.getDate())
        setPickerTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
        setSearchTerm('')
        setShowDropdown(false)
        setSelectedCoinObj(null)
        setSelectedCoinId('')
        onClose()
    }

    useEffect(() => {
        if (txType === 'Sell') {
            const now = new Date()
            setDatePurchased(now.toISOString())
            setPickerYear(now.getFullYear())
            setPickerMonth(now.getMonth())
            setPickerDay(now.getDate())
            setPickerTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
        }
    }, [txType])

    useEffect(() => {
        if (!isOpen) return
        const onDocClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [isOpen])

    if (!isOpen) return null

    return (
        <Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose() }}>
            <Modal ref={modalRef}>
                {screen === 'form' && (
                  <>
                    <Header>
                        <Title>Add Transaction</Title>
                        <CloseBtn onClick={handleClose}>×</CloseBtn>
                    </Header>

                    <Form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Segments>
                                <SegmentBtn $active={txType==='Buy'} onClick={(e) => { e.preventDefault(); setTxType('Buy') }}>Buy</SegmentBtn>
                                <SegmentBtn $active={txType==='Sell'} onClick={(e) => { e.preventDefault(); setTxType('Sell') }}>Sell</SegmentBtn>
                                <SegmentBtn $active={txType==='Transfer'} onClick={(e) => { e.preventDefault(); setTxType('Transfer') }}>Transfer</SegmentBtn>
                            </Segments>
                        </FieldGroup>
                        {txType==='Transfer' && (
                          <FieldGroup>
                            <Label>Transfer</Label>
                            <Select value={transferDirection} onChange={(e) => setTransferDirection(e.target.value)}>
                              <option>Transfer In</option>
                              <option>Transfer Out</option>
                            </Select>
                          </FieldGroup>
                        )}
                        <FieldGroup>
                            <Label>Select Coin</Label>
                            <DropdownContainer ref={dropdownRef}>
                                <SearchInput
                                    type="text"
                                    placeholder="Search coins..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setShowDropdown(true)
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                />
                                {showDropdown && (
                                    <Dropdown>
                                        {filteredCoins.map(coin => (
                                            <DropdownItem
                                                key={coin.id || `${coin.symbol}-${coin.name}`}
                                                onClick={() => {
                                                    setSelectedCoin(coin.symbol)
                                                    setSelectedCoinId(coin.id || '')
                                                    setSelectedCoinObj(coin)
                                                    setSearchTerm(`${coin.name} (${coin.symbol})`)
                                                    setShowDropdown(false)
                                                }}
                                            >
                                                <CoinSymbol>{coin.symbol}</CoinSymbol>
                                                <CoinName>{coin.name}</CoinName>
                                                <CoinPrice>{coin.price != null ? `$${Number(coin.price).toLocaleString()}` : '--'}</CoinPrice>
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                )}
                            </DropdownContainer>
                        </FieldGroup>

                        <FieldGroup>
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                step="0.00000001"
                                placeholder="0.00000000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </FieldGroup>

                        <FieldGroup>
                            <Label>{txType==='Sell' ? 'Date Sold' : 'Date Purchased'}</Label>
                            <DateInputLike onClick={() => setScreen('datetime')}>
                                {new Date(datePurchased).toLocaleString()}
                            </DateInputLike>
                        </FieldGroup>

                        <FieldGroup>
                            <Label>Price per Coin (USD) - {txType==='Sell' ? 'Sale Date' : 'Purchase Date'}</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder={datePurchased ? "Auto-filled from historical data" : "Enter price manually"}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                            {datePurchased && (
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                    Price from {new Date(datePurchased).toLocaleDateString()}
                                </div>
                            )}
                        </FieldGroup>

                        <Preview>
                            <PreviewLabel>Total Value</PreviewLabel>
                            <PreviewValue>${totalValue}</PreviewValue>
                        </Preview>

                        <Actions>
                            <CancelBtn type="button" onClick={handleClose}>Cancel</CancelBtn>
                            <AddBtn type="submit">Add Transaction</AddBtn>
                        </Actions>
                    </Form>
                  </>
                )}

                {screen === 'datetime' && (
                  <>
                    <ScreenHeader>
                      <BackBtn onClick={() => setScreen('form')}>←</BackBtn>
                      <Title>Date & Time</Title>
                    </ScreenHeader>
                    <Form onSubmit={(e) => { e.preventDefault() }}>
                      <div style={{ padding: '16px 24px 0 24px' }}>
                        <PickerHeader>
                          <NavBtn onClick={(e) => { e.preventDefault(); const d = new Date(pickerYear, pickerMonth - 1, 1); setPickerYear(d.getFullYear()); setPickerMonth(d.getMonth()) }}>&lt;</NavBtn>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Select value={pickerMonth} onChange={(e) => setPickerMonth(parseInt(e.target.value, 10))}>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>{new Date(2000, i, 1).toLocaleString(undefined, { month: 'long' })}</option>
                              ))}
                            </Select>
                            <Select value={pickerYear} onChange={(e) => setPickerYear(parseInt(e.target.value, 10))}>
                              {(() => { const y = new Date().getFullYear(); const years = []; for (let i = y + 5; i >= 2009; i--) years.push(i); return years; })().map((y) => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </Select>
                          </div>
                          <NavBtn onClick={(e) => { e.preventDefault(); const d = new Date(pickerYear, pickerMonth + 1, 1); setPickerYear(d.getFullYear()); setPickerMonth(d.getMonth()) }}>&gt;</NavBtn>
                        </PickerHeader>
                        <Grid>
                          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (<div key={d} style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>{d}</div>))}
                          {(() => {
                            const first = new Date(pickerYear, pickerMonth, 1).getDay()
                            const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate()
                            const blanks = Array.from({ length: first }, (_, i) => <div key={`b${i}`} />)
                            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                              <DayCell key={d} $selected={d === pickerDay} onClick={() => setPickerDay(d)}>{d}</DayCell>
                            ))
                            return [...blanks, ...days]
                          })()}
                        </Grid>
                        <TimeRow>
                          <div>Time</div>
                          <TimeInput type="time" value={pickerTime} onChange={(e) => setPickerTime(e.target.value)} />
                        </TimeRow>
                        <ApplyBtn onClick={(e) => {
                          e.preventDefault()
                          const [hh, mm] = pickerTime.split(':').map((n) => parseInt(n || '0', 10))
                          const d = new Date(pickerYear, pickerMonth, pickerDay, hh, mm)
                          const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
                          setDatePurchased(iso)
                          setScreen('form')
                        }}>Change Date & Time</ApplyBtn>
                      </div>
                    </Form>
                  </>
                )}
            </Modal>
        </Overlay>
    )
}

export default AddCoinModal
