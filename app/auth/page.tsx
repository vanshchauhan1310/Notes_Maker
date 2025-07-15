'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/auth-form'
import { getCurrentUser } from '@/lib/auth'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <AuthForm />
    </div>
  )
}