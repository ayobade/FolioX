import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function PrivateRoute({ children }) {
    const { currentUser, loading } = useAuth()
    if (loading) {
        return <div>Loading...</div>
    }
    return currentUser ? children : <Navigate to="/login" />
}

export default PrivateRoute