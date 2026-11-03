import { NextResponse } from "next/server";
import { getStoredMessages, saveStoredMessage, deleteStoredMessage, clearAllStoredMessages } from "@/lib/portfolioStore";
import { isAuthenticated } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("timestamp", { ascending: false });

      if (!error && Array.isArray(data)) {
        return NextResponse.json({ success: true, messages: data });
      }
    } catch (sbErr) {
      console.warn("Supabase messages fetch notice:", sbErr);
    }
  }

  const messages = getStoredMessages();
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, category, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const saved = saveStoredMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      category: String(category || subject || "General Inquiry").trim(),
      message: String(message).trim(),
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("contact_messages")
          .insert([
            {
              id: saved.id,
              name: saved.name,
              email: saved.email,
              category: saved.category,
              message: saved.message,
              timestamp: saved.timestamp,
              read: saved.read || false,
            },
          ]);
      } catch (sbErr) {
        console.error("Supabase insert message error:", sbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Message received successfully", data: saved });
  } catch (err) {
    console.error("Save message error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    }

    if (id === "all") {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from("contact_messages").delete().neq("id", "");
        } catch (sbErr) {
          console.error("Supabase clear messages error:", sbErr);
        }
      }
      const ok = clearAllStoredMessages();
      return NextResponse.json({ success: ok, clearedAll: true });
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("contact_messages").delete().eq("id", id);
      } catch (sbErr) {
        console.error("Supabase delete message error:", sbErr);
      }
    }

    const ok = deleteStoredMessage(id);
    return NextResponse.json({ success: ok });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
