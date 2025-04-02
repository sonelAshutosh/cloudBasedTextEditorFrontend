'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import io from 'socket.io-client'
import { useParams } from 'next/navigation'

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
  const { id: documentId } = useParams()

  useEffect(() => {
    const s = io('http://localhost:3001')
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

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

  return <div className="container" ref={wrapperRef}></div>
}

export default TextEditor
