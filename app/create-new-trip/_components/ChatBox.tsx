'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Send } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import EmptyBox from './EmptyBox'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import TripDurationUi from './TripDurationUi'
import TripPlanUi, { TripPlan } from './TripPlanUi'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

import { GoogleGenAI } from '@google/genai'

type ChatMessage = {
  role: 'user' | 'model' | 'system'
  content: string ,
  ui?: string ,
  data?: Record<string, unknown>,
  autoSaved?: boolean
}

// Initialize individual AI client
const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
})

const MODEL_NAME = "gemini-3-flash-preview"

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Wait for the user's answer before asking the next.
Return a JSON response only:
{
  "resp": "Text Response",
  "ui": "budget/groupSize/duration/Final",
  "destination": "Optional City Name",
  "planData": { ... } // Only when ui is 'Final'
}`

function ChatBox({ onDestinationFound }: { onDestinationFound?: (dest: string) => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [userInput, setUserInput] = useState<string>('')
    const [isSending, setIsSending] = useState(false)
    const searchParams = useSearchParams()
    const sentInitialRef = useRef(false)

    // Safely access mutation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveTripMutation = ((api as unknown) as { trips: { saveTrip: (args: { userEmail: string, tripData: TripPlan }) => any } })?.trips?.saveTrip
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveTrip = useMutation(saveTripMutation || ((() => {}) as any))

    const sendMessage = async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const userMsg: ChatMessage = { role: 'user', content: trimmed }
      const newMessages = [...messages, userMsg]
      setMessages(newMessages)
      setUserInput('')

      try {
        setIsSending(true)
        
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }))

        const result = await ai.models.generateContent({
            model: MODEL_NAME,
            config: {
                systemInstruction: PROMPT,
            },
            contents: [...history, { role: 'user', parts: [{ text: trimmed }] }]
        })

        const responseText = result.text || ''
        console.log('AI raw response:', responseText)

        let parsed: Record<string, unknown> = {}
        try {
            // Remove markdown code blocks if any
            const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
            parsed = JSON.parse(cleaned)
        } catch {
            parsed = { resp: responseText, ui: 'Final' }
        }

        if (parsed.destination && typeof parsed.destination === 'string' && onDestinationFound) {
            onDestinationFound(parsed.destination)
        } else if (messages.length === 0 && onDestinationFound) {
            onDestinationFound(trimmed)
        }

        const content = typeof parsed.resp === 'string' ? parsed.resp : responseText
        const ui = typeof parsed.ui === 'string' ? parsed.ui : undefined
        const data = (parsed.planData as Record<string, unknown>) || parsed

        let wasAutoSaved = false
        if (ui === 'Final' && data) {
          try {
            await saveTrip({
              userEmail: 'user@example.com',
              tripData: data as TripPlan
            })
            wasAutoSaved = true
            toast.success('Trip auto-saved to your dashboard!')
          } catch (saveErr) {
            console.error('Auto-save error:', saveErr)
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content,
            ui,
            data,
            autoSaved: wasAutoSaved
          },
        ])

      } catch (err) {
        console.error('AI error:', err)
        setMessages((prev) => [
          ...prev,
          { role: 'model', content: `Error: ${err instanceof Error ? err.message : 'Failed to connect to AI'}` },
        ])
      } finally {
        setIsSending(false)
      }
    }
    
    const RenderGenerativeUi = (msg: ChatMessage) => {
      const ui = msg.ui
      if (ui === 'budget') {
        return <BudgetUi onSelectOption={(v) => { void sendMessage(v) }} />
      }
      if (ui === 'groupSize') {
        return <GroupSizeUi onSelectOption={(v) => { void sendMessage(v) }} />
      }
      if (ui === 'duration') {
        return <TripDurationUi onSelectOption={(v) => { void sendMessage(v) }} />
      }
      if (ui === 'Final' && msg.data) {
        return <TripPlanUi planData={msg.data as unknown as TripPlan} initialSaved={msg.autoSaved} />
      }
      return null
    }

    const onSend = async() => {
      await sendMessage(userInput)
    }

    useEffect(() => {
      const initial = searchParams.get('q')
      if (!initial || sentInitialRef.current) return
      sentInitialRef.current = true
      
      const sendInitial = async () => {
          await sendMessage(initial)
      }
      sendInitial()
    }, [searchParams])

  return (
    <div className='h-[93vh] flex flex-col p-5 justify-between '>
      {messages?.length === 0 && 
      <EmptyBox onSelectOption ={(v:string) => {sendMessage(v)}}/>}
      {/* display msg */}
      <section className='flex flex-col w-full gap-3 p-5 overflow-y-auto'>
        {messages.map((msg, idx) => (
          <div
            key={`${msg.role}-${idx}`}
            className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <div
              className={
                msg.role === 'user'
                  ? 'max-w-lg bg-primary text-white px-3 py-2 rounded-2xl'
                  : 'max-w-xl bg-gray-100 text-black px-6 py-2 rounded-2xl'
              }
            >
              {msg.content && msg.content !== msg.ui && msg.ui !== 'groupSize' && msg.ui !== 'budget' && msg.ui !== 'Final' && (
                <p className='text-sm whitespace-pre-wrap'>{msg.content}</p>
              )}
              {RenderGenerativeUi(msg)}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="max-w-lg bg-gray-100 text-black px-6 py-2 rounded-2xl">
              <Loader className="animate-spin" />
            </div>
          </div>
        )}
      </section>
      {/* user input */}
      <section>
        <div className='flex items-center justify-center'>
        <div className='border rounded-2xl p-1 shadow relative w-[80vh] h-30 '>
          <Textarea 
          className=' h-30  bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-xs'
          placeholder='create a trip from shen ghat to nagthana'
          onChange={(event) => setUserInput(event.target.value)}
          value={userInput}
          />

          <Button size={'icon'} className='absolute bottom-3 right-3 active:scale-75' onClick={onSend} disabled={isSending}>
            <Send  className='h-4 w-4'/>
          </Button>
        </div>
        </div>
      </section>
    </div>
  )
}

export default ChatBox
