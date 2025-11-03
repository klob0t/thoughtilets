import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'


const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_THOUGHTILETS_SUPABASE_ANON_KEY!

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
   const supabase = createClient(
      supabaseURL,
      supabaseKey
   )

   try {
      const { slug } = await context.params

      const { data, error } = await supabase
         .from('thoughtilets')
         .select('*')
         .eq('slug', slug)
         .single()

      if (error || !data) {
         return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
      }

      return NextResponse.json(data)
   } catch (error) {
      if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 })
   }
}