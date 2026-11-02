import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStoredPortfolioData, saveStoredPortfolioData, resetStoredPortfolioData } from "@/lib/portfolioStore";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: Request) {
  // Reading url or headers forces dynamic execution
  const url = new URL(req.url);
  const data = getStoredPortfolioData();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const updatedData = await req.json();
    if (!updatedData || !updatedData.personal) {
      return NextResponse.json({ error: "Invalid portfolio data payload" }, { status: 400 });
    }

    const success = saveStoredPortfolioData(updatedData);
    if (!success) {
      return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
    }

    // Automatically revalidate root layout, pages, and SEO sitemap
    try {
      revalidatePath("/", "layout");
      revalidatePath("/sitemap.xml");
      revalidatePath("/robots.txt");
    } catch (e) {
      console.warn("Revalidation notice:", e);
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (err) {
    console.error("Save portfolio error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const success = resetStoredPortfolioData();
  if (!success) {
    return NextResponse.json({ error: "Failed to reset portfolio data" }, { status: 500 });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
  } catch (e) {
    console.warn("Revalidation notice:", e);
  }

  const data = getStoredPortfolioData();
  return NextResponse.json({ success: true, data });
}
