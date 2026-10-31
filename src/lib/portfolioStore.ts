import fs from "fs";
import path from "path";
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

let memoryPortfolioCache: PortfolioData | null = null;
let memoryMessagesCache: ContactMessage[] | null = null;

export function getStoredPortfolioData(): PortfolioData {
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

  if (memoryPortfolioCache) {
    return memoryPortfolioCache;
  }

  // Fallback to default portfolioData and write store
  memoryPortfolioCache = portfolioData;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(portfolioData, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing initial portfolio-store.json:", err);
  }

  return portfolioData;
}

export function saveStoredPortfolioData(newData: PortfolioData): boolean {
  try {
    memoryPortfolioCache = newData;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(newData, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error saving portfolio-store.json:", err);
    return false;
  }
}

export function resetStoredPortfolioData(): boolean {
  try {
    memoryPortfolioCache = portfolioData;
    fs.writeFileSync(STORE_PATH, JSON.stringify(portfolioData, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error resetting portfolio data:", err);
    return false;
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
  } catch (err) {
    console.error("Error reading messages-store.json:", err);
  }

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
  } catch (err) {
    console.error("Error writing messages-store.json:", err);
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
  } catch (err) {
    console.error("Error deleting message:", err);
    return false;
  }
}
