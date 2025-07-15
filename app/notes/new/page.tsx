"use client";

import { useRouter } from "next/navigation";
import NoteForm from "@/components/forms/note-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useCallback } from "react";
import type { Note } from "@/components/forms/note-form";

export default function NewNotePage() {
  const router = useRouter();

  const handleSave = useCallback(async (note: Note) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(note),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const error = await res.json();
      alert(error.error || "Failed to save note");
    }
  }, [router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#f64f59] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-2xl border-0 bg-white/20 backdrop-blur-2xl rounded-3xl p-2 ring-1 ring-white/30 hover:scale-[1.02] transition-transform duration-300">
         
          <CardContent>
            <NoteForm onSave={handleSave} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 