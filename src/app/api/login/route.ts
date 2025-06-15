import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
   try {
      const { secret } = await request.json()
      if (secret === process.env.SECRET_WORD) {

         const cookieStore = await cookies()

         cookieStore.set('submit-auth-token', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // Cookie lasts for 1 day
         })

         return NextResponse.json({ success: true })
      } else {
         // If it doesn't match, return an error
         return NextResponse.json({ success: false, error: 'Invalid secret word' }, { status: 401 })
      }
   } catch (err) {
      return NextResponse.json({ error: 'Internal Server Error', err }, { status: 500 })
   }
}