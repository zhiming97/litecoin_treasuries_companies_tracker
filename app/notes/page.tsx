'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      try {
        const { data, error } = await supabase.from('notes').select()
        if (error) {
          console.error('Error fetching notes:', error)
          return
        }
        setNotes(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    getData()
  }, [])

  if (!notes) return <div>Loading...</div>
  if (notes.length === 0) return <div>No notes found. Make sure you have added some notes to your database.</div>

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
