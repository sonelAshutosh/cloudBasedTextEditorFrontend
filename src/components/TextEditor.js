'use client'

import { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import io from 'socket.io-client'
import { useParams } from 'next/navigation'
import API from '@/axios'

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
]

function TextEditor() {
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [title, setTitle] = useState('Loading...')
  const { id: documentId } = useParams()

  useEffect(() => {
    const userId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userId='))
      ?.split('=')[1]

    const baseURL = API.defaults.baseURL?.replace('/api/', '') || ''
    const s = io(baseURL, {
      query: { userId: userId },
    })
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!documentId) return
    const fetchTitle = async () => {
      try {
        const res = await API.get(`/documents/${documentId}`)
        setTitle(res.data.title)
      } catch (err) {
        console.error('Error fetching title:', err)
      }
    }

    fetchTitle()
  }, [documentId])

  useEffect(() => {
    if (quill == null || socket == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return

      socket.emit('send-changes', delta)
    }

    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (quill == null || socket == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (quill == null || socket == null) return

    socket.once('load-document', (document) => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit('get-document', documentId)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (quill == null || socket == null) return

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  const handleTitleChange = async (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    try {
      await API.patch(`/documents/${documentId}`, { title: newTitle })
    } catch (err) {
      console.error('Failed to update title:', err)
    }
  }

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return

    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    wrapper.append(editor)

    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    })

    q.disable()
    q.setText('Loading...')
    setQuill(q)
  }, [])

  return (
    <div>
      <input
        className="w-full px-4 font-bold "
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled Document"
      />
      <div className="container mt-4" ref={wrapperRef}></div>
    </div>
  )
}

export default TextEditor
