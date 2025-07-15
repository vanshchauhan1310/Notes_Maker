'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Bookmark, Star, TrendingUp, Plus, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/header'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import Head from 'next/head'

export default function Dashboard() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalBookmarks: 0,
    favoriteNotes: 0,
    favoriteBookmarks: 0,
  })
  const [recentNotes, setRecentNotes] = useState<{ id: string; title: string; updated_at: string; tags: string[] }[]>([])
  const [recentBookmarks, setRecentBookmarks] = useState<{ id: string; title: string; url: string; updated_at: string; tags: string[] }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth');
      return;
    }
    if (user) {
      fetchDashboardData(user.id);
    }
    setIsLoading(false);
    // eslint-disable-next-line
  }, [user]);

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch stats
      const [notesResponse, bookmarksResponse] = await Promise.all([
        supabase.from('notes').select('id, is_favorite').eq('user_id', userId),
        supabase.from('bookmarks').select('id, is_favorite').eq('user_id', userId)
      ])

      const totalNotes = notesResponse.data?.length || 0
      const totalBookmarks = bookmarksResponse.data?.length || 0
      const favoriteNotes = notesResponse.data?.filter(n => n.is_favorite).length || 0
      const favoriteBookmarks = bookmarksResponse.data?.filter(b => b.is_favorite).length || 0

      setStats({
        totalNotes,
        totalBookmarks,
        favoriteNotes,
        favoriteBookmarks,
      })

      // Fetch recent items
      const [recentNotesResponse, recentBookmarksResponse] = await Promise.all([
        supabase
          .from('notes')
          .select('id, title, updated_at, tags')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(5),
        supabase
          .from('bookmarks')
          .select('id, title, url, updated_at, tags')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(5)
      ])

      setRecentNotes(recentNotesResponse.data || [])
      setRecentBookmarks(recentBookmarksResponse.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dashboard-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a21caf" />
            </linearGradient>
          </defs>
          <ellipse cx="720" cy="400" rx="700" ry="220" fill="url(#dashboard-gradient)" fillOpacity="0.10">
            <animate attributeName="rx" values="700;750;700" dur="8s" repeatCount="indefinite" />
          </ellipse>
        </svg>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Notes',
      value: stats.totalNotes,
      icon: BookOpen,
      color: 'from-blue-600 to-blue-700',
      href: '/notes'
    },
    {
      title: 'Total Bookmarks',
      value: stats.totalBookmarks,
      icon: Bookmark,
      color: 'from-green-600 to-green-700',
      href: '/bookmarks'
    },
    {
      title: 'Favorite Notes',
      value: stats.favoriteNotes,
      icon: Star,
      color: 'from-purple-600 to-purple-700',
      href: '/notes?favorites=true'
    },
    {
      title: 'Favorite Bookmarks',
      value: stats.favoriteBookmarks,
      icon: Star,
      color: 'from-orange-600 to-orange-700',
      href: '/bookmarks?favorites=true'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <Head>
        <link href='https://fonts.googleapis.com/css2?family=Sora:wght@700;400&display=swap' rel='stylesheet' />
      </Head>
      <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dashboard-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
        </defs>
        <ellipse cx="720" cy="400" rx="700" ry="220" fill="url(#dashboard-gradient)" fillOpacity="0.10">
          <animate attributeName="rx" values="700;750;700" dur="8s" repeatCount="indefinite" />
        </ellipse>
      </svg>
      <div className="relative z-10">
        <Header user={user} currentPath="/dashboard" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg text-white text-3xl font-bold" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                  Welcome back, {user?.email?.split('@')[0]}!
                </h1>
                <p className="text-lg text-gray-600">Here's what's happening with your notes and bookmarks</p>
              </div>
            </div>
          </motion.div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-indigo-200/80 via-sky-100/70 to-fuchsia-100/60 backdrop-blur-2xl border-0 rounded-2xl p-2"
                  onClick={() => router.push(stat.href)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                      {stat.title}
                    </CardTitle>
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 inline" />
                      View all
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-indigo-200/80 via-sky-100/70 to-fuchsia-100/60 backdrop-blur-2xl border-0 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 text-center" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <Button 
                    className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-bold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    onClick={() => router.push('/notes/new')}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Note
                  </Button>
                  <Button 
                    className="h-14 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg font-bold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    onClick={() => router.push('/bookmarks/new')}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Bookmark
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Recent Notes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-indigo-200/80 via-sky-100/70 to-fuchsia-100/60 backdrop-blur-2xl border-0 rounded-2xl shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                      Recent Notes
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/notes')} className="font-semibold text-blue-700 hover:underline">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentNotes.length > 0 ? (
                    <div className="space-y-4">
                      {recentNotes.map((note: any) => (
                        <div 
                          key={note.id} 
                          className="p-4 rounded-xl border border-blue-100 bg-white/70 hover:bg-blue-50 cursor-pointer transition-colors shadow-sm flex flex-col gap-2"
                          onClick={() => router.push(`/notes/${note.id}`)}
                        >
                          <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{note.title}</h4>
                          <p className="text-xs text-gray-500 mb-1">
                            {new Date(note.updated_at).toLocaleDateString()}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-blue-200 to-purple-200 text-blue-900 border-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                      <BookOpen className="h-14 w-14 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-semibold">No notes yet. Create your first note!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            {/* Recent Bookmarks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-indigo-200/80 via-sky-100/70 to-fuchsia-100/60 backdrop-blur-2xl border-0 rounded-2xl shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
                      Recent Bookmarks
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/bookmarks')} className="font-semibold text-blue-700 hover:underline">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentBookmarks.length > 0 ? (
                    <div className="space-y-4">
                      {recentBookmarks.map((bookmark: any) => (
                        <div 
                          key={bookmark.id} 
                          className="p-4 rounded-xl border border-purple-100 bg-white/70 hover:bg-purple-50 cursor-pointer transition-colors shadow-sm flex flex-col gap-2"
                          onClick={() => router.push(`/bookmarks/${bookmark.id}`)}
                        >
                          <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>{bookmark.title}</h4>
                          <p className="text-xs text-gray-500 mb-1">
                            {bookmark.url.length > 50 ? `${bookmark.url.substring(0, 50)}...` : bookmark.url}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(bookmark.updated_at).toLocaleDateString()}
                          </p>
                          {bookmark.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {bookmark.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-purple-200 to-blue-200 text-purple-900 border-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                      <Bookmark className="h-14 w-14 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-semibold">No bookmarks yet. Add your first bookmark!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}