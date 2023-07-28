import { DEBUG } from "../config/config";

export function debug(...args: any[]) {
  if (DEBUG) {
    console.debug("[DEBUG]", ...args);
  }
}
