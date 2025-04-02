'use client'

import dynamic from 'next/dynamic'

const TextEditor = dynamic(() => import('@/components/TextEditor'), {
  ssr: false,
})

export default function Home() {
  return (
    <div>
      <TextEditor />
    </div>
  )
}
