"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NoteForm from "@/components/forms/note-form";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit2, ArrowLeft, Star, StarOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import type { Note } from "@/components/forms/note-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch note");
        const data = await res.json();
        // Ensure all required fields are present
        setNote({
          id: data.id,
          title: data.title || "",
          content: data.content || "",
          tags: data.tags || [],
          is_favorite: data.is_favorite ?? false,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchNote();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete note");
      toast.success("Note deleted");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSave = async (updatedNote: Note) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update note");
      setNote(await res.json());
      setEditing(false);
      toast.success("Note updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!note) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#f64f59] flex flex-col">
      {/* Sticky Glassy Header */}
      <header className="sticky top-0 z-20 w-full bg-white/30 backdrop-blur-lg shadow-md flex items-center px-4 py-2 gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="mr-2"><ArrowLeft className="w-5 h-5" /></Button>
        <h2 className="text-lg font-bold tracking-tight text-gray-900/90">{editing ? "Edit Note" : "Note Details"}</h2>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <Card className="shadow-2xl border-0 bg-white/30 backdrop-blur-2xl rounded-3xl p-2 ring-1 ring-white/40 hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold text-gray-900/90">{editing ? "Edit Note" : note.title}</CardTitle>
                {note.is_favorite ? <Star className="w-5 h-5 text-yellow-400" /> : <StarOff className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex gap-2">
                {!editing && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" onClick={() => setEditing(true)} size="icon"><Edit2 className="w-4 h-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive" onClick={() => setShowDeleteModal(true)} size="icon" disabled={deleting}>
                        {deleting ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <NoteForm
                    note={note}
                    onSave={handleSave}
                    onCancel={() => setEditing(false)}
                  />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="prose max-w-none text-gray-800">
                    <div className="mb-2 text-xs text-gray-500 flex items-center gap-2">
                      {note.is_favorite && <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Favorite</span>}
                    </div>
                    <div className="mb-4 whitespace-pre-line text-base leading-relaxed">{note.content}</div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 text-blue-900 border-0 text-xs font-semibold shadow-sm hover:scale-105 transition-transform">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this note? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4 mr-1" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 