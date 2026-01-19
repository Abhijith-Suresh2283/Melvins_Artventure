import { supabase } from "../lib/supabaseClient";

// NOTE: This assumes table: "testimonials"
// columns: id, name, quote, course, stars, avatar_url, drawing_urls, drawing_titles, created_at

async function getAll() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get all error:", error);
    throw error;
  }
  return data || [];
}

async function submit(payload, profileFile, drawingFiles) {
  // 1) Upload avatar (optional)
  let avatar_url = null;

  if (profileFile) {
    // Clean filename to avoid issues
    const cleanName = profileFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const avatarPath = `avatars/${Date.now()}-${cleanName}`;
    
    const { data: uploadData, error: upErr } = await supabase.storage
      .from("testimonials-assets")
      .upload(avatarPath, profileFile, { 
        cacheControl: '3600',
        upsert: false 
      });

    if (upErr) {
      console.error("Avatar upload error:", upErr);
      throw upErr;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("testimonials-assets")
      .getPublicUrl(avatarPath);
    
    avatar_url = urlData.publicUrl;
    console.log("Avatar uploaded:", avatar_url); // Debug log
  }

  // 2) Upload drawings (optional)
  const drawing_urls = [];

  if (drawingFiles?.length) {
    for (const file of drawingFiles) {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const path = `drawings/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${cleanName}`;

      const { data: uploadData, error: upErr } = await supabase.storage
        .from("testimonials-assets")
        .upload(path, file, { 
          cacheControl: '3600',
          upsert: false 
        });

      if (upErr) {
        console.error("Drawing upload error:", upErr);
        throw upErr;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("testimonials-assets")
        .getPublicUrl(path);
      
      drawing_urls.push(urlData.publicUrl);
      console.log("Drawing uploaded:", urlData.publicUrl); // Debug log
    }
  }

  // 3) Insert row + return inserted row so UI can show immediately
  const insertRow = {
    name: payload.name,
    quote: payload.quote,
    course: payload.course,
    stars: payload.stars,
    avatar_url,
    drawing_urls,
    drawing_titles: payload.drawing_titles || [],
  };

  const { data, error } = await supabase
    .from("testimonials")
    .insert(insertRow)
    .select("*")
    .single();

  if (error) {
    console.error("Insert error:", error);
    throw error;
  }
  
  return data;
}

export const testimonialService = { getAll, submit };