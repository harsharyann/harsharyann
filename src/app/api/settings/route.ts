import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { defaultSettings, PortfolioSettings } from "@/data/portfolioSettings";

const SETTINGS_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "persistedSettings.json"
);

function getPersistedSettings(): PortfolioSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error("Failed to read persisted settings:", error);
  }
  return defaultSettings;
}

export async function GET() {
  const settings = getPersistedSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getPersistedSettings();
    const updated = { ...current, ...body };

    fs.writeFileSync(
      SETTINGS_FILE_PATH,
      JSON.stringify(updated, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Failed to save settings to disk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist settings to disk" },
      { status: 500 }
    );
  }
}
