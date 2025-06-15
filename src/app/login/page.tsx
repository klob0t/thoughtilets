"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })

      if (!response.ok) {
        throw new Error('Incorrect secret word.')
      }
      
      
      router.push('/submit')

    } catch (err) {
      if (err instanceof Error) setError(err.message)
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={styles.loginContainer}>
      <form onSubmit={handleSubmit}>
        <p>Are you thcl?</p>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Access'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </main>
  )
}