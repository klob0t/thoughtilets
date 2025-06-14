// src/app/api/poems/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    const body = await request.json()

    // --- ADD THIS DEBUGGING LINE ---
    console.log('API received this body:', body);
    // -------------------------------

    const { title, slug, content } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('poems')
      .insert([ { title, slug, content } ])
      .select()

    if (error) {
      console.error('Supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ poem: data[0] }, { status: 201 })

  } catch (error) {
    console.error('Catch block error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}