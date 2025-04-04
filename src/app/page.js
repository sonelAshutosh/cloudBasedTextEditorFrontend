'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function Home() {
  useEffect(() => {
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1]

    const userId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userId='))
      ?.split('=')[1]

    if (accessToken && userId) {
      redirect('/home')
    } else {
      redirect('/login')
    }
  }, [])

  return null
}
