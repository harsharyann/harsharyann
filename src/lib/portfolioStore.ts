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
  // 1. Check serverless /tmp first (where runtime edits are written)
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const raw = fs.readFileSync(TMP_STORE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.personal) {
        if (fs.existsSync(STORE_PATH)) {
          const tmpMtime = fs.statSync(TMP_STORE_PATH).mtimeMs;
          const storeMtime = fs.statSync(STORE_PATH).mtimeMs;
          if (tmpMtime >= storeMtime) {
            memoryPortfolioCache = parsed;
            return parsed;
          }
        } else {
          memoryPortfolioCache = parsed;
          return parsed;
        }
      }
    }
  } catch {}

  // 2. Read from local src/data/portfolio-store.json on disk
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.personal) {
        memoryPortfolioCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading portfolio-store.json:", err);
  }

  // 3. Fallback to in-memory cache if available
  if (memoryPortfolioCache) {
    return memoryPortfolioCache;
  }

  // 4. Fallback to default portfolioData
  memoryPortfolioCache = portfolioData;
  return portfolioData;
}

export function saveStoredPortfolioData(newData: PortfolioData): boolean {
  memoryPortfolioCache = newData;

  // 1. Always write to serverless /tmp (guaranteed writable on Vercel / Lambda)
  try {
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(newData, null, 2), "utf8");
  } catch (tmpErr) {
    console.warn("Could not write to tmp:", tmpErr);
  }

  // 2. Also write to project data folder if filesystem is writable (local dev)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(newData, null, 2), "utf8");
  } catch {
    // Normal on serverless (read-only filesystem)
  }

  return true;
}

export function resetStoredPortfolioData(): boolean {
  memoryPortfolioCache = portfolioData;
  try {
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(portfolioData, null, 2), "utf8");
  } catch {}
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(portfolioData, null, 2), "utf8");
  } catch {}
  return true;
}

export function getStoredMessages(): ContactMessage[] {
  if (memoryMessagesCache) {
    return memoryMessagesCache;
  }

  // 1. Try /tmp
  try {
    if (fs.existsSync(TMP_MESSAGES_PATH)) {
      const raw = fs.readFileSync(TMP_MESSAGES_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryMessagesCache = parsed;
        return parsed;
      }
    }
  } catch {}

  // 2. Try disk
  try {
    if (fs.existsSync(MESSAGES_PATH)) {
      const raw = fs.readFileSync(MESSAGES_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryMessagesCache = parsed;
        return parsed;
      }
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
    fs.writeFileSync(TMP_MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
  } catch {}
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
  } catch {}

  return newMsg;
}

export function deleteStoredMessage(id: string): boolean {
  const current = getStoredMessages();
  const updated = current.filter((m) => m.id !== id);
  memoryMessagesCache = updated;

  try {
    fs.writeFileSync(TMP_MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
  } catch {}
  try {
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(updated, null, 2), "utf8");
  } catch {}

  return true;
}

export function clearAllStoredMessages(): boolean {
  memoryMessagesCache = [];

  try {
    fs.writeFileSync(TMP_MESSAGES_PATH, JSON.stringify([], null, 2), "utf8");
  } catch {}
  try {
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify([], null, 2), "utf8");
  } catch {}

  return true;
}
