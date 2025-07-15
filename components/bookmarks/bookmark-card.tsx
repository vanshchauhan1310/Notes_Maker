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
import { Heart, MoreHorizontal, Edit, Trash2, ExternalLink, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { extractDomain } from '@/lib/metadata'
import { useRouter } from "next/navigation";

interface Bookmark {
  id: string
  url: string
  title: string
  description: string
  tags: string[]
  created_at: string
  updated_at: string
  is_favorite: boolean
  favicon_url?: string
}

interface BookmarkCardProps {
  bookmark: Bookmark
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export default function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }: BookmarkCardProps) {
  const [faviconError, setFaviconError] = useState(false)
  const domain = extractDomain(bookmark.url)
  const router = useRouter();

  const truncateDescription = (description: string, maxLength: number = 120) => {
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card
        className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-white/50 backdrop-blur-sm cursor-pointer"
        onClick={() => router.push(`/bookmarks/${bookmark.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                {bookmark.favicon_url && !faviconError ? (
                  <img
                    src={bookmark.favicon_url}
                    alt=""
                    className="w-4 h-4"
                    onError={() => setFaviconError(true)}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {domain}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(bookmark.updated_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            {/* Favorite and Dropdown actions below */}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {bookmark.description && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {truncateDescription(bookmark.description)}
              </p>
            </div>
          )}
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bookmark.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        {/* Favorite and Dropdown actions absolutely positioned over the card */}
        <div className="flex items-center space-x-2 absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={e => { e.stopPropagation(); onToggleFavorite(bookmark.id, !bookmark.is_favorite); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart 
              className={`h-4 w-4 ${bookmark.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={e => { e.stopPropagation(); window.open(bookmark.url, '_blank'); }}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit(bookmark); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={e => { e.stopPropagation(); onDelete(bookmark.id); }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  )
}