import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {

   const supabase = createClient(
      supabaseURL,
      supabaseKey
   )

   try {
      const body = await request.json()
      const { title, slug, content } = body

      if (!title || !slug || !content) {
         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const { data, error } = await supabase
         .from('poems')
         .insert([{ title, slug, content }])
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

export async function GET() {
   const supabase = createClient(
      supabaseURL,
      supabaseKey
   )

   try {
      const { data, error } = await supabase
         .from('poems')
         .select('*')
         .order('created_at', { ascending: false })

      if (error) {
         throw new Error(error.message)
      }

      return NextResponse.json(data)
   } catch (error) {
      if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 })
   }
}