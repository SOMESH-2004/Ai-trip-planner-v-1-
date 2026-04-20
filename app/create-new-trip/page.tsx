'use client'

import React, { Suspense, useState } from 'react'
import ChatBox from './_components/ChatBox'
import dynamic from 'next/dynamic'

// Dynamic import for MapComponent as it uses window/leaflet
const MapComponent = dynamic(() => import('./_components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[93vh] w-full bg-gray-100 flex items-center justify-center rounded-2xl border">Loading Map...</div>
})

const Page = () => {
  const [destination, setDestination] = useState<string>('')

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-4 max-w-[1600px] mx-auto'>
      <div className=''>
        {/* chatBox */}
        <Suspense fallback={<div>Loading chat...</div>}>
          <ChatBox onDestinationFound={(dest) => setDestination(dest)} />
        </Suspense>
      </div>
      <div className='sticky top-4 h-fit'>
        {/* map */}
        <MapComponent destination={destination} />
      </div>
    </div>
  )
}

export default Page
