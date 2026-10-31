import { NextResponse } from "next/server";
import { getStoredMessages, saveStoredMessage, deleteStoredMessage } from "@/lib/portfolioStore";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const messages = getStoredMessages();
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const saved = saveStoredMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      category: String(category || "General Inquiry").trim(),
      message: String(message).trim(),
    });

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

    const ok = deleteStoredMessage(id);
    return NextResponse.json({ success: ok });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
