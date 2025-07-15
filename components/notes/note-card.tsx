'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Heart, MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
  is_favorite: boolean
}

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart 
                  className={`h-4 w-4 ${note.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(note)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(note.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-4">
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
              >
                {isExpanded ? note.content : truncateContent(note.content)}
              </ReactMarkdown>
            </div>
          </div>
          
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}