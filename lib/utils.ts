import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const inputDate = new Date(date);
  const today = new Date();
  
  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return `Today at ${inputDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }

  return inputDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateText(text: string, length: number) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function generateVersionLabel(versionNumber: number) {
  return `Version ${versionNumber}`;
}

export function getLatestVersion(versions: { version_number: number }[]) {
  if (!versions.length) return 0;
  return Math.max(...versions.map((v) => v.version_number));
}

export function formatTimeDiff(date: Date | string) {
  const diff = new Date().getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
