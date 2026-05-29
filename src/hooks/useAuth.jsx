import { createContext, useContext, useMemo } from "react";
import { demoUsers } from "../data/demoData";
import { createId } from "../utils/storage";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("lifepilot_users", demoUsers);
  const [session, setSession] = useLocalStorage("lifepilot_session", null);

  const currentUser = useMemo(
    () => users.find((user) => user.id === session?.userId) ?? null,
    [session?.userId, users]
  );

  function login(email, password) {
    const user = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password
    );

    if (!user) {
      return { ok: false, errorKey: "auth.errorInvalid" };
    }

    setSession({ userId: user.id, loggedInAt: new Date().toISOString() });
    return { ok: true };
  }

  function register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return { ok: false, errorKey: "auth.errorExists" };
    }

    const user = {
      id: createId("user"),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "Growth Planner",
      country: "United States"
    };

    setUsers((current) => [...current, user]);
    setSession({ userId: user.id, loggedInAt: new Date().toISOString() });
    return { ok: true };
  }

  function updateUser(updates) {
    if (!currentUser) return;

    setUsers((current) =>
      current.map((user) => (user.id === currentUser.id ? { ...user, ...updates } : user))
    );
  }

  function logout() {
    setSession(null);
  }

  const value = useMemo(
    () => ({ users, currentUser, login, register, updateUser, logout }),
    [currentUser, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
