'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidV4 } from 'uuid'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const randomId = uuidV4()
    router.push(`/document/${randomId}`)
  }, [])

  return <div>Home</div>
}
