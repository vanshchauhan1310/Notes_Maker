"use client";

import { useRouter } from "next/navigation";
import BookmarkForm from "@/components/forms/bookmark-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useCallback } from "react";
import type { Bookmark } from "@/components/forms/bookmark-form";

export default function NewBookmarkPage() {
  const router = useRouter();

  const handleSave = useCallback(async (bookmark: Bookmark) => {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookmark),
    });
    if (res.ok) {
      router.push("/dashboard");
    }
    // Optionally handle error
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
            <BookmarkForm onSave={handleSave} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 