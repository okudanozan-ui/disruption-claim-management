import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const handleLogin = async (credentials) => {
    try {
      console.log(credentials)
      const result = await window.api.user.login(credentials)
      if (result.success) {
        onLogin(result.user)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu.')
      console.error(error)
    }
  }

  const handleSignup = async (userData) => {
    try {
      const result = await window.api.user.register(userData)
      if (result.success) {
        // Kayıt başarılı, giriş sayfasına yönlendir
        setIsLogin(true)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Kayıt olurken bir hata oluştu.')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent max-w-2xl">
      <h1 className="text-4xl font-bold text-center text-neutral-700 pb-8">DCM Tool</h1>
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-neutral-700 pb-8">
          {isLogin ? 'Login' : 'Create an Account'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded  mb-5!">
            {error}
          </div>
        )}

        {isLogin ? <LoginForm onSubmit={handleLogin} /> : <SignupForm onSubmit={handleSignup} />}

        <div className="text-center pt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {isLogin ? 'No account yet? Signup' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
