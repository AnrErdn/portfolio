'use client'

import { useState } from 'react'
import Loader from '@/components/loader'
import Hero from '@/components/hero'

// Manages the Loader → Hero handoff.
// Extracted as a client component so page.tsx can remain a server component.
export default function AppShell() {
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <>
      <Loader onComplete={() => setLoaderDone(true)} />
      <Hero ready={loaderDone} />
    </>
  )
}
