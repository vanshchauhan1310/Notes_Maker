'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Save, X, Plus, Tag, Globe, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchMetadata } from '@/lib/metadata'
import toast from 'react-hot-toast'
import Head from 'next/head'

export type Bookmark = {
  id?: string
  url: string
  title: string
  description: string
  tags: string[]
  is_favorite: boolean
  favicon_url?: string
}

interface BookmarkFormProps {
  bookmark?: Bookmark
  onSave: (bookmark: Bookmark) => void
  onCancel: () => void
}

export default function BookmarkForm({ bookmark, onSave, onCancel }: BookmarkFormProps) {
  const [formData, setFormData] = useState<Bookmark>({
    url: '',
    title: '',
    description: '',
    tags: [],
    is_favorite: false,
    favicon_url: '',
  })
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false)

  useEffect(() => {
    if (bookmark) {
      setFormData(bookmark)
    }
  }, [bookmark])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.url.trim() || !formData.title.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate URL
    try {
      new URL(formData.url)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      toast.error('Failed to save bookmark')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, url }))
    
    // Auto-fetch metadata if URL is valid and title is empty
    if (url && !formData.title && !bookmark) {
      try {
        new URL(url)
        setIsFetchingMetadata(true)
        const metadata = await fetchMetadata(url)
        setFormData(prev => ({
          ...prev,
          title: metadata.title || url,
          description: metadata.description || '',
          favicon_url: metadata.favicon || '',
        }))
      } catch (error) {
        // Invalid URL, don't fetch metadata
      } finally {
        setIsFetchingMetadata(false)
      }
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;400&display=swap" rel="stylesheet" />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-indigo-200/80 via-sky-100/70 to-fuchsia-100/60 backdrop-blur-2xl rounded-3xl p-2">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif' }}>
              {bookmark ? 'Edit Bookmark' : 'Create New Bookmark'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-base font-semibold text-gray-700">URL *</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="pl-10 text-lg focus:ring-2 focus:ring-blue-400 transition-all rounded-xl"
                    required
                  />
                  {isFetchingMetadata && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-gray-700">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter bookmark title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg focus:ring-2 focus:ring-purple-400 transition-all rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this bookmark..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="focus:ring-2 focus:ring-blue-200 transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-700">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 focus:ring-2 focus:ring-blue-400 transition-all rounded-xl"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTag}
                    disabled={!newTag.trim()}
                    className="rounded-full font-semibold transition-transform duration-200 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-200 to-purple-200 text-blue-900 border-0 text-xs rounded-full px-3 py-1"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="favorite"
                  checked={formData.is_favorite}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_favorite: checked }))}
                />
                <Label htmlFor="favorite" className="text-base font-semibold text-gray-700">Add to favorites</Label>
              </div>
              <div className="flex space-x-4 pt-4 border-t border-gray-200 mt-8 pt-8">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 font-bold rounded-full py-3 shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-green-400"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Bookmark'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="rounded-full font-semibold transition-transform duration-200 hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}