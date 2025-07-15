"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Star, StarOff } from "lucide-react";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

// Define Note type for type safety
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  updated_at: string;
}

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
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
    fetchNotes();
    // eslint-disable-next-line
  }, [search, tags, sort, favoritesOnly]);

  async function fetchTags() {
    try {
      const res = await fetch("/api/notes");
      const data: Note[] = await res.json();
      const tagSet = new Set<string>();
      data.forEach((note) => {
        (note.tags || []).forEach((tag: string) => tagSet.add(tag));
      });
      setAllTags(Array.from(tagSet));
    } catch {}
  }

  async function fetchNotes() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (tags.length > 0) params.append("tags", tags.join(","));
      if (favoritesOnly) params.append("favorites", "true");
      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch notes");
      let data: Note[] = await res.json();
      if (sort === "title") data = data.sort((a, b) => a.title.localeCompare(b.title));
      else if (sort === "favorites") data = data.sort((a, b) => Number(b.is_favorite) - Number(a.is_favorite));
      else data = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setNotes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  // Favorite toggle handler
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);
  const handleToggleFavorite = async (note: Note) => {
    setFavoriteLoading(note.id);
    const updated = { ...note, is_favorite: !note.is_favorite };
    setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: updated.is_favorite }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update favorite");
      toast.success(updated.is_favorite ? "Marked as favorite" : "Removed from favorites");
    } catch (err: unknown) {
      setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setFavoriteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#f64f59] flex flex-col">
      <header className="sticky top-0 z-20 w-full bg-white/30 backdrop-blur-lg shadow-md flex items-center px-4 py-2 gap-2">
        <h2 className="text-lg font-bold tracking-tight text-gray-900/90 flex-1">Notes</h2>
        <Button onClick={() => router.push("/notes/new")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </header>
      <div className="max-w-3xl mx-auto w-full p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex-1 flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 text-base"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">Tags</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto min-w-[180px]">
              {allTags.length === 0 ? (
                <DropdownMenuItem disabled>No tags</DropdownMenuItem>
              ) : (
                allTags.map(tag => (
                  <DropdownMenuItem key={tag} asChild>
                    <div className="flex items-center gap-2 w-full cursor-pointer" onClick={() => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])}>
                      <Checkbox checked={tags.includes(tag)} />
                      <span className="text-xs font-semibold">#{tag}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              {tags.length > 0 && (
                <DropdownMenuItem onClick={() => setTags([])} className="text-red-500">Clear Tags</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No notes found.</div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -2 }}
                className="cursor-pointer"
                onClick={() => router.push(`/notes/${note.id}`)}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white/60 backdrop-blur-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
                    <CardTitle className="font-bold text-lg text-gray-900 line-clamp-1">{note.title}</CardTitle>
                    <span className="text-xs text-gray-400">{new Date(note.updated_at).toLocaleDateString()}</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-700 text-sm line-clamp-2 mb-2">{note.content}</div>
                    <div className="flex flex-wrap gap-1">
                      {note.tags && note.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">{tag}</Badge>
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