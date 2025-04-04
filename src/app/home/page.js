'use client'

import API from '@/axios'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function HomePage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDocuments = async () => {
      const storedUserId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='))
        ?.split('=')[1]
      try {
        const res = await API.get(`/documents/getAll/${storedUserId}`)
        const data = res.data
        setDocuments(data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  console.log('Documents:', documents)

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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Documents</h1>
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
            <li key={doc._id} className="border-b pb-2">
              <Link
                href={`/document/${doc._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HomePage
