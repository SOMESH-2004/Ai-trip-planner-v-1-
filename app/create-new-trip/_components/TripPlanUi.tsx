'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Users, Wallet, Utensils, Camera, Hotel, Save, Check, Loader2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

export type TripPlan = {
  destination: string
  duration: string
  budget: string
  groupSize: string
  itinerary: {
    day: number
    theme: string
    activities: {
      time: string
      place: string
      desc: string
      icon?: string
    }[]
  }[]
  recommendations: {
    hotels: { name: string; price: string; desc: string }[]
    food: { name: string; type: string; desc: string }[]
  }
}

type TripPlanUiProps = {
  planData: TripPlan
  readOnly?: boolean
  initialSaved?: boolean
}

const TripPlanUi = ({ planData, readOnly, initialSaved = false }: TripPlanUiProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(initialSaved)
  
  // Safely access mutation to prevent crash if not yet ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveTripMutation = ((api as unknown) as { trips: { saveTrip: (args: { userEmail: string, tripData: TripPlan }) => any } })?.trips?.saveTrip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveTrip = useMutation(saveTripMutation || ((() => {}) as any))

  if (!planData) return null

  const handleSaveTrip = async () => {
    try {
      setIsSaving(true)
      // For now using a placeholder email as no auth is established
      // In a real app, this would come from a user session
      await saveTrip({
        userEmail: 'user@example.com', 
        tripData: planData
      })
      setIsSaved(true)
      toast.success('Trip saved successfully!')
    } catch (error) {
      console.error('Error saving trip:', error)
      toast.error('Failed to save trip')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='flex flex-col gap-6 mt-4 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='bg-primary/5 border border-primary/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h2 className='text-3xl font-bold flex items-center gap-2 text-primary'>
            <MapPin className='text-primary' /> {planData.destination}
          </h2>
          <p className='text-gray-500 mt-1'>Custom AI Generated Itinerary</p>
        </div>
        <div className='flex flex-col items-end gap-3'>
          <div className='flex flex-wrap gap-2 justify-end'>
            <Badge variant="outline" className="flex items-center gap-1 bg-white">
              <Calendar className='w-3 h-3' /> {planData.duration}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-white">
              <Users className='w-3 h-3' /> {planData.groupSize}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-white">
              <Wallet className='w-3 h-3' /> {planData.budget}
            </Badge>
          </div>
          {!readOnly && (
            <Button 
              onClick={handleSaveTrip} 
              disabled={isSaving || isSaved}
              variant={isSaved ? "outline" : "default"}
              className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
            >
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : isSaved ? (
                <><Check className="mr-2 h-4 w-4 text-green-500" /> Saved</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Trip</>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card className='rounded-2xl border-none shadow-sm bg-blue-50/50'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Hotel className='w-5 h-5 text-blue-600' /> Stay Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            {planData.recommendations?.hotels?.map((hotel, idx) => (
              <div key={idx} className='bg-white p-3 rounded-xl border border-blue-100 shadow-sm'>
                <h4 className='font-bold text-sm'>{hotel.name}</h4>
                <p className='text-xs text-gray-600 mt-1'>{hotel.desc}</p>
                <div className='mt-2 text-xs font-semibold text-blue-600'>{hotel.price}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='rounded-2xl border-none shadow-sm bg-orange-50/50'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Utensils className='w-5 h-5 text-orange-600' /> Local Cuisines
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            {planData.recommendations?.food?.map((food, idx) => (
              <div key={idx} className='bg-white p-3 rounded-xl border border-orange-100 shadow-sm'>
                <h4 className='font-bold text-sm'>{food.name}</h4>
                <p className='text-xs text-gray-500'>{food.type}</p>
                <p className='text-xs text-gray-600 mt-1'>{food.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-4'>
        <h3 className='font-bold text-xl flex items-center gap-2 px-2'>
          <Camera className='text-primary w-6 h-6' /> Daily Itinerary
        </h3>
        {planData.itinerary?.map((day, idx) => (
          <div key={idx} className='relative pl-6 pb-6 border-l-2 border-primary/20 last:border-0 ml-2'>
            <div className='absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm' />
            <div className='bg-white rounded-2xl p-5 border shadow-sm'>
              <h4 className='font-bold text-lg text-primary'>Day {day.day}: {day.theme}</h4>
              <div className='flex flex-col gap-4 mt-4'>
                {day.activities?.map((act, actIdx) => (
                  <div key={actIdx} className='flex gap-4 items-start group'>
                    <div className='text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded min-w-16 text-center group-hover:bg-primary group-hover:text-white transition-colors'>
                      {act.time}
                    </div>
                    <div>
                      <h5 className='font-bold text-sm'>{act.place}</h5>
                      <p className='text-xs text-gray-500 mt-1 leading-relaxed'>{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripPlanUi
