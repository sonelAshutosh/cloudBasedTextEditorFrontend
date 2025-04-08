'use client'

import API from '@/axios'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function HomePage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    const storedUserId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userId='))
      ?.split('=')[1]

    const fetchUserAndDocuments = async () => {
      try {
        const userRes = await API.get(`/users/user/${storedUserId}`)
        setUserName(userRes.data.name)

        const docsRes = await API.get(`/documents/getAll/${storedUserId}`)
        setDocuments(docsRes.data)
      } catch (error) {
        console.error('Error fetching user/documents:', error)
      } finally {
        setLoading(false)
      }
    }

    if (storedUserId) {
      fetchUserAndDocuments()
    }
  }, [])

  const handleCreateNewDocument = () => {
    const newUuid = uuidv4()
    router.push(`/document/${newUuid}`)
  }

  const handleLogout = () => {
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  if (!isMounted || loading) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome {userName}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleCreateNewDocument}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            Create New Document
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      {documents.length === 0 ? (
        <p className="text-gray-600">No documents found.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc._id} className="border-b pb-2 flex justify-between">
              <Link
                href={`/document/${doc._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {doc.title}
              </Link>
              <div className="py-0.5 px-2 rounded-lg bg-red-500 hover:bg-red-800 text-white cursor-pointer">
                Delete
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HomePage
