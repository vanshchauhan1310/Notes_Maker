export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const favorites = searchParams.get('favorites') === 'true'

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (q) {
      query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    }

    if (tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    if (favorites) {
      query = query.eq('is_favorite', true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[NOTES][POST] Handler called");
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    console.log("[NOTES][POST] User:", user);
    if (!user) {
      console.error("[NOTES][POST] Unauthorized: No user found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log("[NOTES][POST] Request body:", body);
    const { title, content, tags = [], is_favorite = false } = body;
    console.log("[NOTES][POST] title:", title);
    console.log("[NOTES][POST] content:", content);
    console.log("[NOTES][POST] tags:", tags);
    console.log("[NOTES][POST] is_favorite:", is_favorite);
    console.log("[NOTES][POST] user_id:", user.id);

    if (!title || !content) {
      console.error("[NOTES][POST] Missing title or content");
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title,
        content,
        tags,
        user_id: user.id,
        is_favorite,
      })
      .select()
      .single();

    console.log("[NOTES][POST] Supabase insert result:", data);
    if (error) {
      console.error("[NOTES][POST] Supabase insert error:", error, error?.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("[NOTES][POST] API route error:", error, error.stack);
    } else {
      console.error("[NOTES][POST] API route error:", error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}