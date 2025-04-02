'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const TextEditor = dynamic(() => import('@/components/TextEditor'), {
  ssr: false,
})

function uid() {
  return (
    <div>
      <TextEditor />
    </div>
  )
}

export default uid
