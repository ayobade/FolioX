import React from 'react'

function Header() {
    return (
        <div style={styles.header}>
            <div style={styles.logo}>
                <h1 style={styles.logoText}>FolioX</h1>
            </div>
            
            <div style={styles.searchContainer}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    style={styles.searchInput}
                    onChange={(e) => console.log('Search:', e.target.value)}
                />
            </div>
            
        </div>
    )
}

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 20px',
        height: '60px',
        boxSizing: 'border-box',
        borderBottom: '1px solid #e0e0e0',
        maxWidth: '1240px',
        margin: '0 auto'
    },
    logo: {
        textAlign: 'left'
    },
    logoText: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        margin: 0
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    searchInput: {
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: '20px',
        fontSize: '14px',
        width: '200px',
        outline: 'none',
        backgroundColor: '#f9f9f9'
    }
}

export default Header