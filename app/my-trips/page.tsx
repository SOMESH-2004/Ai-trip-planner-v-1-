'use client'

import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin, Calendar, Users, Wallet, ChevronRight, Loader2, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TripPlanUi, { TripPlan } from '../create-new-trip/_components/TripPlanUi'
import { motion, AnimatePresence } from 'motion/react'

export default function MyTrips() {
  // Use the same placeholder email used for saving
  // Safely access query to prevent crash if not yet ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getUserTripsQuery = ((api as unknown) as { trips: { getUserTrips: (args: { userEmail: string }) => any } })?.trips?.getUserTrips
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trips = useQuery(getUserTripsQuery || ((() => {}) as any), { userEmail: 'user@example.com' })
  const [selectedTrip, setSelectedTrip] = useState<{ tripData: TripPlan; _id: string; createdAt: number } | null>(null)

  if (trips === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8 pt-20 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">My Saved Trips</h1>
          <p className="text-gray-500">Explore your previously planned adventures.</p>
        </div>
        <Plane className="w-12 h-12 text-primary opacity-20" />
      </div>

      {trips.length === 0 ? (
        <Card className="border-dashed border-2 py-20 bg-gray-50/30 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Plane className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">No trips saved yet</CardTitle>
          <CardDescription className="mt-2">Start a new chat to plan your next journey!</CardDescription>
          <Button asChild className="mt-6 rounded-full px-8 bg-black text-white hover:bg-gray-800">
            <a href="/create-new-trip">Plan a Trip</a>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {trips.map((trip, idx: number) => {
              const data = trip.tripData as TripPlan
              return (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden bg-white">
                  <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-white p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                       <MapPin className="w-24 h-24" />
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2 truncate">
                      <MapPin className="text-primary w-5 h-5 flex-shrink-0" /> 
                      {data.destination}
                    </CardTitle>
                    <p className="text-gray-500 text-xs mt-1">Generated {new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{data.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{data.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Wallet className="w-4 h-4 text-primary" />
                        <span>{data.budget}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all group"
                      onClick={() => setSelectedTrip(trip as { tripData: TripPlan; _id: string; createdAt: number })}
                    >
                      View Itinerary
                      <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )})}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal/Overlay */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-in fade-in zoom-in duration-300">
          <div className="max-w-4xl mx-auto p-5 py-10 relative">
             <Button 
               onClick={() => setSelectedTrip(null)}
               variant="ghost" 
               className="mb-8 rounded-full hover:bg-gray-100"
             >
                <ChevronRight className="rotate-180 mr-2" /> Back to My Trips
             </Button>
             <TripPlanUi planData={selectedTrip.tripData as TripPlan} readOnly={true} />
          </div>
        </div>
      )}
    </div>
  )
}
