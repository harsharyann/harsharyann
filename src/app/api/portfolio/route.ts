import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStoredPortfolioData, saveStoredPortfolioData, resetStoredPortfolioData } from "@/lib/portfolioStore";
import { isAuthenticated } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: Request) {
  // Reading url forces dynamic execution
  new URL(req.url);

  // 1. Try Supabase cloud database if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_data")
        .select("data")
        .eq("id", "main")
        .maybeSingle();

      if (!error && data?.data && data.data.personal) {
        return NextResponse.json(data.data, {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
      }
    } catch (sbErr) {
      console.warn("Supabase fetch notice, falling back to local store:", sbErr);
    }
  }

  // 2. Fallback to local / memory store
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

    const dataToSave = {
      ...updatedData,
      _lastSavedAt: updatedData._lastSavedAt || Date.now(),
    };

    // 1. Always save to local / serverless store
    saveStoredPortfolioData(dataToSave);

    // 2. If Supabase is configured, persist directly to Supabase cloud table!
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: sbErr } = await supabase
          .from("portfolio_data")
          .upsert(
            {
              id: "main",
              data: dataToSave,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (sbErr) {
          console.error("Supabase upsert error:", sbErr);
        }
      } catch (sbErr) {
        console.error("Supabase upsert exception:", sbErr);
      }
    }

    // Optional background sync to GitHub repository if GITHUB_TOKEN is configured in environment
    const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (ghToken) {
      (async () => {
        try {
          const owner = "harsharyann";
          const repo = "harsharyann";
          const filePath = "src/data/portfolio-store.json";
          const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
          const getRes = await fetch(url, {
            headers: {
              Authorization: `Bearer ${ghToken}`,
              Accept: "application/vnd.github.v3+json",
            },
            cache: "no-store",
          });
          let sha: string | undefined;
          if (getRes.ok) {
            const getJson = await getRes.json();
            sha = getJson.sha;
          }
          const content = Buffer.from(JSON.stringify(dataToSave, null, 2)).toString("base64");
          await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${ghToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "chore: update portfolio store via admin console [skip ci]",
              content,
              sha,
            }),
          });
        } catch (syncErr) {
          console.warn("GitHub background sync notice:", syncErr);
        }
      })();
    }

    // Revalidate all pages so visitors immediately see new content
    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin");
    } catch {}

    return NextResponse.json(
      { success: true, data: dataToSave },
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

  const data = getStoredPortfolioData();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("portfolio_data")
        .upsert(
          {
            id: "main",
            data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
    } catch (sbErr) {
      console.error("Supabase reset exception:", sbErr);
    }
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin");
  } catch {}

  return NextResponse.json({ success: true, data });
}
