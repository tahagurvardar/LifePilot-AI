import { DATA_VERSION, createDemoData, demoUsers } from "../data/demoData";
import { readStorage, writeStorage } from "./storage";

const VERSION_KEY = "lifepilot_schema_version";
const USERS_KEY = "lifepilot_users";
const DEMO_USER_ID = "demo-user";

/**
 * One-time, browser-side data migration.
 *
 * Older deployments stored the demo profile under the previous name. Running
 * this before the app mounts guarantees the stored demo account and workspace
 * are refreshed to the current defaults (e.g. "Jordan Blake"), while any
 * user-registered accounts are preserved. Registered users' own workspaces are
 * left untouched — hydrateDemoData backfills any new fields at read time.
 */
export function runMigrations() {
  const version = Number(readStorage(VERSION_KEY, 0)) || 0;
  if (version >= DATA_VERSION) return;

  // Refresh the built-in demo account fields, keep other accounts as-is.
  const storedUsers = readStorage(USERS_KEY, null);
  if (Array.isArray(storedUsers)) {
    const demoDefaults = demoUsers[0];
    const hasDemo = storedUsers.some((user) => user?.id === DEMO_USER_ID);
    const nextUsers = storedUsers.map((user) =>
      user?.id === DEMO_USER_ID ? { ...user, ...demoDefaults } : user
    );
    if (!hasDemo) nextUsers.unshift(demoDefaults);
    writeStorage(USERS_KEY, nextUsers);
  }

  // Reset the demo user's saved workspace so stale profile data is regenerated.
  writeStorage(`lifepilot_data_${DEMO_USER_ID}`, createDemoData(demoUsers[0]));

  writeStorage(VERSION_KEY, DATA_VERSION);
}
