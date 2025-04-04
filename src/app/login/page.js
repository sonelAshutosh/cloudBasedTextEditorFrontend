'use client'

import API from '@/axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // ✅ Correct import
import React, { useState } from 'react'

function LoginPage() {
  const router = useRouter() // ✅ Now it works in Next.js App Router

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await API.post('/users/signin', { email, password })
      const { accessToken, userId } = response.data

      document.cookie = `accessToken=${accessToken}; path=/; max-age=${
        60 * 60 * 24
      }`
      document.cookie = `userId=${userId}; path=/; max-age=${60 * 60 * 24}`

      alert('Login successful!')
      router.push('/home')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <p className="mt-4 text-sm text-center text-gray-600">
          Do not have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
