import { createContext, useContext, useState, useEffect } from 'react'


export const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // on app load — restore from sessionStorage (not localStorage)
  // sessionStorage is cleared automatically when the browser/tab closes
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token')
    const storedUser  = sessionStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    // use sessionStorage so data is wiped when tab/browser closes
    sessionStorage.setItem('token', authToken)
    sessionStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)