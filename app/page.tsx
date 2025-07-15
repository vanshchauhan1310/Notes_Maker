'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Bookmark, Star, Search, Shield, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCurrentUser } from '@/lib/auth'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Create rich-text notes with Markdown support, tags, and favorites.'
    },
    {
      icon: Bookmark,
      title: 'Bookmark Manager',
      description: 'Save and organize your favorite links with auto-metadata fetching.'
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find anything instantly with fuzzy search and tag filtering.'
    },
    {
      icon: Star,
      title: 'Favorites System',
      description: 'Mark important notes and bookmarks for quick access.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and only accessible to you.'
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;400&display=swap" rel="stylesheet" />
      </Head>
      {/* Animated SVG Background */}
      <svg className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hero-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
        </defs>
        <path fill="url(#hero-gradient)" fillOpacity="0.12">
          <animate attributeName="d" dur="8s" repeatCount="indefinite"
            values="M0,160L80,186.7C160,213,320,267,480,245.3C640,224,800,128,960,117.3C1120,107,1280,181,1360,218.7L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z;
            M0,96L80,122.7C160,149,320,203,480,181.3C640,160,800,64,960,53.3C1120,43,1280,117,1360,154.7L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z;
            M0,160L80,186.7C160,213,320,267,480,245.3C640,224,800,128,960,117.3C1120,107,1280,181,1360,218.7L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </path>
      </svg>
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                {/* Upgraded icon for logo, can be replaced with a custom SVG if available */}
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                NoteMark
              </span>
            </div>
            <Button onClick={() => router.push('/auth')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full px-6 py-2 shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400">
              Get Started
            </Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 md:pb-24 flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Your Personal
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                Knowledge Hub
              </span>
            </h1>
            <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Organize your thoughts, save your discoveries, and never lose track of important information again.<br />
              <span className="text-lg text-gray-500">A beautiful and powerful notes and bookmarks manager built for the modern web.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl px-10 py-4 text-lg font-bold transition-transform duration-200 hover:scale-105"
              >
                Start Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/auth')}
                className="border-2 border-blue-600 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-10 py-4 text-lg font-bold transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
              >
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-xl shadow-inner">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you capture, organize, and find your information effortlessly.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-shadow border-0 bg-gradient-to-br from-blue-100/80 via-purple-100/70 to-white/60 backdrop-blur-2xl rounded-2xl p-2 border border-blue-100">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              Ready to Get Organized?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who have transformed their digital workflow with NoteMark.
            </p>
            <Button 
              size="lg" 
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl px-10 py-4 text-lg font-bold transition-transform duration-200 hover:scale-105"
            >
              Get Started for Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              NoteMark
            </span>
          </div>
          <p className="text-gray-400 text-base">
            © 2024 NoteMark. Built with <span className="text-pink-400">❤️</span> for productivity enthusiasts.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:underline text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:underline text-gray-400 hover:text-white transition">Contact</a>
            <a href="#" className="hover:underline text-gray-400 hover:text-white transition">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}