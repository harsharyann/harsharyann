import { NextResponse } from "next/server";
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

    const dataToSave = {
      ...updatedData,
      _lastSavedAt: updatedData._lastSavedAt || Date.now(),
    };

    const success = saveStoredPortfolioData(dataToSave);
    if (!success) {
      return NextResponse.json({ error: "Failed to persist portfolio data" }, { status: 500 });
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
  return NextResponse.json({ success: true, data });
}
