import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStoredPortfolioData, saveStoredPortfolioData, resetStoredPortfolioData } from "@/lib/portfolioStore";
import { isAuthenticated } from "@/lib/auth";


export async function GET(req: Request) {
  // Reading url forces dynamic execution
  new URL(req.url);
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
  if (!authed && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized access: Admin session expired or invalid" }, { status: 401 });
  }

  try {
    const updatedData = await req.json();
    if (!updatedData || !updatedData.personal) {
      return NextResponse.json({ error: "Invalid portfolio data payload" }, { status: 400 });
    }

    const success = saveStoredPortfolioData(updatedData);
    if (!success) {
      return NextResponse.json({ error: "Failed to persist portfolio data" }, { status: 500 });
    }

    // Fast, non-blocking path revalidation for main public site
    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation notice:", e);
    }

    return NextResponse.json(
      { success: true, data: updatedData },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    console.error("Save portfolio error:", err);
    return NextResponse.json({ error: err?.message || "Server error while saving" }, { status: 500 });
  }
}

export async function PUT() {
  const authed = await isAuthenticated();
  if (!authed && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const success = resetStoredPortfolioData();
  if (!success) {
    return NextResponse.json({ error: "Failed to reset portfolio data" }, { status: 500 });
  }

  try {
    revalidatePath("/");
  } catch (e) {
    console.warn("Revalidation notice:", e);
  }

  const data = getStoredPortfolioData();
  return NextResponse.json({ success: true, data });
}
