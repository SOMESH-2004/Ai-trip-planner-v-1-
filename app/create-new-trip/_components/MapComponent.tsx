'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Leaflet + Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIcon = (L: any) => {
  if (typeof window === 'undefined') return undefined
  return L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

type MapComponentProps = {
  destination?: string
}

const MapComponent = ({ destination }: MapComponentProps) => {
  const [position, setPosition] = useState<[number, number]>([20, 0]) // Default world view
  const [zoom, setZoom] = useState(2)
  const icon = getIcon(L)

  useEffect(() => {
    if (!destination) {
      Promise.resolve().then(() => {
        setPosition([20, 0])
        setZoom(2)
      })
      return
    }

    const geocode = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`
        )
        const data = await response.json()
        if (data && data.length > 0) {
          const { lat, lon } = data[0]
          setPosition([parseFloat(lat), parseFloat(lon)])
          setZoom(10)
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }

    geocode()
  }, [destination])

  return (
    <div className='h-[93vh] w-full rounded-[32px] overflow-hidden border-8 border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5'>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <ChangeView center={position} zoom={zoom} />
        {destination && (
          <Marker position={position} icon={icon}>
            <Popup>{destination}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default MapComponent
