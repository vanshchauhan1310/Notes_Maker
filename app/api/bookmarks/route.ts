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
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,url.ilike.%${q}%`)
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
    console.log("[BOOKMARKS][POST] Handler called");
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    console.log("[BOOKMARKS][POST] User:", user);
    if (!user) {
      console.error("[BOOKMARKS][POST] Unauthorized: No user found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log("[BOOKMARKS][POST] Request body:", body);
    const { url, title, description = '', tags = [], is_favorite = false, favicon_url } = body;
    console.log("[BOOKMARKS][POST] url:", url);
    console.log("[BOOKMARKS][POST] title:", title);
    console.log("[BOOKMARKS][POST] description:", description);
    console.log("[BOOKMARKS][POST] tags:", tags);
    console.log("[BOOKMARKS][POST] is_favorite:", is_favorite);
    console.log("[BOOKMARKS][POST] favicon_url:", favicon_url);
    console.log("[BOOKMARKS][POST] user_id:", user.id);

    if (!url) {
      console.error("[BOOKMARKS][POST] Missing URL");
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      console.error("[BOOKMARKS][POST] Invalid URL:", url);
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        url,
        title: title || url,
        description,
        tags,
        user_id: user.id,
        is_favorite,
        favicon_url,
      })
      .select()
      .single();

    console.log("[BOOKMARKS][POST] Supabase insert result:", data);
    if (error) {
      console.error("[BOOKMARKS][POST] Supabase insert error:", error, error?.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[BOOKMARKS][POST] API route error:", error, error?.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}