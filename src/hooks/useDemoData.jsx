import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createDemoData } from "../data/demoData";
import { createId, readStorage, writeStorage } from "../utils/storage";
import { useAuth } from "./useAuth";

const DemoDataContext = createContext(null);

function dataKey(userId) {
  return `lifepilot_data_${userId}`;
}

export function DemoDataProvider({ children }) {
  const { currentUser } = useAuth();
  const [storageKey, setStorageKey] = useState(() =>
    currentUser ? dataKey(currentUser.id) : null
  );
  const [data, setData] = useState(() =>
    currentUser ? readStorage(dataKey(currentUser.id), createDemoData(currentUser)) : createDemoData()
  );

  useEffect(() => {
    if (!currentUser) {
      setStorageKey(null);
      setData(createDemoData());
      return;
    }

    const nextKey = dataKey(currentUser.id);
    setData(readStorage(nextKey, createDemoData(currentUser)));
    setStorageKey(nextKey);
  }, [currentUser]);

  useEffect(() => {
    if (storageKey && data) {
      writeStorage(storageKey, data);
    }
  }, [data, storageKey]);

  function updateProfile(updates) {
    setData((current) => ({
      ...current,
      profile: { ...current.profile, ...updates },
      career: {
        ...current.career,
        targetRole: updates.targetRole ?? current.career.targetRole
      }
    }));
  }

  function updatePreferences(updates) {
    setData((current) => ({
      ...current,
      preferences: { ...current.preferences, ...updates }
    }));
  }

  function updateSavingsGoal(updates) {
    setData((current) => ({
      ...current,
      savingsGoal: { ...current.savingsGoal, ...updates }
    }));
  }

  function addTransaction(transaction) {
    setData((current) => ({
      ...current,
      transactions: [
        {
          ...transaction,
          id: createId("tx"),
          amount: Number(transaction.amount),
          date: transaction.date || new Date().toISOString().slice(0, 10)
        },
        ...current.transactions
      ]
    }));
  }

  function removeTransaction(id) {
    setData((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => transaction.id !== id)
    }));
  }

  function updateCareer(updates) {
    setData((current) => ({
      ...current,
      career: { ...current.career, ...updates }
    }));
  }

  function addSkill(skill, listName = "skills") {
    const value = skill.trim();
    if (!value) return;

    setData((current) => {
      const list = current.career[listName] ?? [];
      if (list.some((item) => item.toLowerCase() === value.toLowerCase())) {
        return current;
      }

      return {
        ...current,
        career: {
          ...current.career,
          [listName]: [...list, value]
        }
      };
    });
  }

  function removeSkill(skill, listName = "skills") {
    setData((current) => ({
      ...current,
      career: {
        ...current.career,
        [listName]: current.career[listName].filter((item) => item !== skill)
      }
    }));
  }

  function addApplication(application) {
    setData((current) => ({
      ...current,
      career: {
        ...current.career,
        applications: [
          {
            ...application,
            id: createId("job"),
            date: application.date || new Date().toISOString().slice(0, 10)
          },
          ...current.career.applications
        ]
      }
    }));
  }

  function updateApplication(id, updates) {
    setData((current) => ({
      ...current,
      career: {
        ...current.career,
        applications: current.career.applications.map((application) =>
          application.id === id ? { ...application, ...updates } : application
        )
      }
    }));
  }

  const value = useMemo(
    () => ({
      data,
      addApplication,
      addSkill,
      addTransaction,
      removeSkill,
      removeTransaction,
      updateApplication,
      updateCareer,
      updatePreferences,
      updateProfile,
      updateSavingsGoal
    }),
    [data]
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used inside DemoDataProvider");
  }
  return context;
}
