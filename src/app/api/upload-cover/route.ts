import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settingsPath = path.join(process.cwd(), "src", "data", "persistedSettings.json");
    const currentSettings = fs.existsSync(settingsPath)
      ? JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
      : {};

    let imageUrl = body.image || body.coverImage;

    // If it's a data URL, save it directly to public/custom-cover.jpg
    if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("data:image")) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const publicDir = path.join(process.cwd(), "public");

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filePath = path.join(publicDir, "custom-cover.jpg");
      fs.writeFileSync(filePath, buffer);
      imageUrl = `/custom-cover.jpg?v=${Date.now()}`;
    }

    const updated = {
      ...currentSettings,
      ...body,
      ...(imageUrl ? { coverImage: imageUrl } : {}),
    };
    delete updated.image;

    fs.writeFileSync(settingsPath, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      settings: updated,
      url: updated.coverImage,
    });
  } catch (error) {
    console.error("Failed to save cover settings:", error);
    return NextResponse.json(
      { error: "Internal server error saving settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), "src", "data", "persistedSettings.json");
    if (fs.existsSync(settingsPath)) {
      const data = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      return NextResponse.json(data);
    }
    return NextResponse.json({});
  } catch {
    return NextResponse.json({});
  }
}
