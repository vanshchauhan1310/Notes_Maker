"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Define Bookmark type for type safety
interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  is_favorite: boolean;
  favicon_url?: string;
  updated_at: string;
}

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("updated");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line
  }, [search, tags, sort, favoritesOnly]);

  async function fetchTags() {
    try {
      const res = await fetch("/api/bookmarks");
      const data: Bookmark[] = await res.json();
      const tagSet = new Set<string>();
      data.forEach((bookmark) => {
        (bookmark.tags || []).forEach((tag: string) => tagSet.add(tag));
      });
      setAllTags(Array.from(tagSet));
    } catch {}
  }

  async function fetchBookmarks() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (tags.length > 0) params.append("tags", tags.join(","));
      if (favoritesOnly) params.append("favorites", "true");
      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch bookmarks");
      let data: Bookmark[] = await res.json();
      if (sort === "title") data = data.sort((a: Bookmark, b: Bookmark) => a.title.localeCompare(b.title));
      else if (sort === "favorites") data = data.sort((a: Bookmark, b: Bookmark) => Number(b.is_favorite) - Number(a.is_favorite));
      else data = data.sort((a: Bookmark, b: Bookmark) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setBookmarks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#f64f59] flex flex-col">
      <header className="sticky top-0 z-20 w-full bg-white/30 backdrop-blur-lg shadow-md flex items-center px-4 py-2 gap-2">
        <h2 className="text-lg font-bold tracking-tight text-gray-900/90 flex-1">Bookmarks</h2>
        <Button onClick={() => router.push("/bookmarks/new")} className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-full px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Bookmark
        </Button>
      </header>
      <div className="max-w-3xl mx-auto w-full p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex-1 flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {allTags.map(tag => (
              <Badge
                key={tag}
                className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold transition-colors ${tags.includes(tag) ? "bg-gradient-to-r from-green-400 to-blue-400 text-white" : "bg-gray-200 text-gray-700 hover:bg-green-100"}`}
                onClick={() => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])}
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 0 && (
              <Button size="sm" variant="outline" onClick={() => setTags([])} className="ml-2">Clear Tags</Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort("updated")}>Last Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("title")}>Title (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("favorites")}>Favorites First</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={favoritesOnly ? "default" : "outline"}
            className="ml-2 flex items-center gap-1"
            onClick={() => setFavoritesOnly(fav => !fav)}
          >
            <Star className={favoritesOnly ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
            Favorites
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No bookmarks found.</div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map(bookmark => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -2 }}
                className="cursor-pointer"
                onClick={() => router.push(`/bookmarks/${bookmark.id}`)}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-white/60 backdrop-blur-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      {bookmark.favicon_url ? (
                        <img src={bookmark.favicon_url} alt="favicon" className="w-4 h-4 rounded shadow-sm" />
                      ) : (
                        <Globe className="w-4 h-4 text-gray-400" />
                      )}
                      <CardTitle className="font-bold text-lg text-gray-900 line-clamp-1">{bookmark.title}</CardTitle>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(bookmark.updated_at).toLocaleDateString()}</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 text-sm line-clamp-2 mb-2">{bookmark.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags && bookmark.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-200">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 