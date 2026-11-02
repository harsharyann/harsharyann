import fs from "fs";
import path from "path";
import os from "os";
import { portfolioData, PortfolioData } from "@/data/portfolioData";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STORE_PATH = path.join(DATA_DIR, "portfolio-store.json");
const MESSAGES_PATH = path.join(DATA_DIR, "messages-store.json");

const TMP_STORE_PATH = path.join(os.tmpdir(), "portfolio-store.json");
const TMP_MESSAGES_PATH = path.join(os.tmpdir(), "messages-store.json");

let memoryPortfolioCache: PortfolioData | null = null;
let memoryMessagesCache: ContactMessage[] | null = null;

export function getStoredPortfolioData(): PortfolioData {
  if (memoryPortfolioCache) {
    return memoryPortfolioCache;
  }

  // 1. Try local src/data/portfolio-store.json
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      memoryPortfolioCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Error reading portfolio-store.json:", err);
  }

  // 2. Try serverless /tmp
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const raw = fs.readFileSync(TMP_STORE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      memoryPortfolioCache = parsed;
      return parsed;
    }
  } catch {}

  // 3. Fallback to default portfolioData
  memoryPortfolioCache = portfolioData;
  return portfolioData;
}

export function saveStoredPortfolioData(newData: PortfolioData): boolean {
  memoryPortfolioCache = newData;

  // Try writing to project folder (local dev)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(newData, null, 2), "utf8");
    return true;
  } catch {
    // If running in read-only filesystem (Vercel serverless)
    try {
      fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(newData, null, 2), "utf8");
      return true;
    } catch (tmpErr) {
      console.warn("Could not write to tmp, relying on in-memory cache:", tmpErr);
      return true; // Still return true so API doesn't fail
    }
  }
}

export function resetStoredPortfolioData(): boolean {
  memoryPortfolioCache = portfolioData;
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(portfolioData, null, 2), "utf8");
    return true;
  } catch {
    try {
      fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(portfolioData, null, 2), "utf8");
      return true;
    } catch {
      return true;
    }
  }
}

export function getStoredMessages(): ContactMessage[] {
  if (memoryMessagesCache) {
    return memoryMessagesCache;
  }

  try {
    if (fs.existsSync(MESSAGES_PATH)) {
      const raw = fs.readFileSync(MESSAGES_PATH, "utf8");
      const parsed = JSON.parse(raw);
      memoryMessagesCache = parsed;
      return parsed;
    }
  } catch {}

  try {
    if (fs.existsSync(TMP_MESSAGES_PATH)) {
      const raw = fs.readFileSync(TMP_MESSAGES_PATH, "utf8");
      const parsed = JSON.parse(raw);
      memoryMessagesCache = parsed;
      return parsed;
    }
  } catch {}

  memoryMessagesCache = [];
  return [];
}

export function saveStoredMessage(msg: Omit<ContactMessage, "id" | "timestamp" | "read">): ContactMessage {
  const current = getStoredMessages();
  const newMsg: ContactMessage = {
    ...msg,
    id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    read: false,
  };

  const updated = [newMsg, ...current];
  memoryMessagesCache = updated;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    try {
      fs.writeFileSync(TMP_MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
    } catch {}
  }

  return newMsg;
}

export function deleteStoredMessage(id: string): boolean {
  const current = getStoredMessages();
  const updated = current.filter((m) => m.id !== id);
  memoryMessagesCache = updated;

  try {
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
    return true;
  } catch {
    try {
      fs.writeFileSync(TMP_MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
      return true;
    } catch {
      return false;
    }
  }
}

export function clearAllStoredMessages(): boolean {
  memoryMessagesCache = [];

  try {
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify([], null, 2), "utf8");
    return true;
  } catch {
    try {
      fs.writeFileSync(TMP_MESSAGES_PATH, JSON.stringify([], null, 2), "utf8");
      return true;
    } catch {
      return false;
    }
  }
}
