'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Save, X, Plus, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Head from 'next/head'

export type Note = {
  id?: string
  title: string
  content: string
  tags: string[]
  is_favorite: boolean
}

interface NoteFormProps {
  note?: Note
  onSave: (note: Note) => void
  onCancel: () => void
}

export default function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [formData, setFormData] = useState<Note>({
    title: '',
    content: '',
    tags: [],
    is_favorite: false,
  })
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (note) {
      setFormData(note)
    }
  }, [note])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setIsLoading(false)
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
              {note ? 'Edit Note' : 'Create New Note'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-gray-700">Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter note title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg focus:ring-2 focus:ring-blue-400 transition-all rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-semibold text-gray-700">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your note here... (Markdown supported)"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="font-mono text-base focus:ring-2 focus:ring-purple-400 transition-all rounded-xl"
                  required
                />
                <p className="text-xs text-gray-500">Supports Markdown formatting (bold, italic, lists, etc.)</p>
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold rounded-full py-3 shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Note'}
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