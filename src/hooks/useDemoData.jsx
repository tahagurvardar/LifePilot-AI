import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createDemoData, hydrateDemoData } from "../data/demoData";
import { createId, readStorage, writeStorage } from "../utils/storage";
import { useAuth } from "./useAuth";

const DemoDataContext = createContext(null);

function dataKey(userId) {
  return `lifepilot_data_${userId}`;
}

function loadData(user) {
  if (!user) return createDemoData();
  const stored = readStorage(dataKey(user.id), null);
  return hydrateDemoData(stored, user);
}

export function DemoDataProvider({ children }) {
  const { currentUser } = useAuth();
  const [storageKey, setStorageKey] = useState(() =>
    currentUser ? dataKey(currentUser.id) : null
  );
  const [data, setData] = useState(() => loadData(currentUser));

  useEffect(() => {
    if (!currentUser) {
      setStorageKey(null);
      setData(createDemoData());
      return;
    }

    setData(loadData(currentUser));
    setStorageKey(dataKey(currentUser.id));
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

  function updateBudget(updates) {
    setData((current) => ({
      ...current,
      budget: { ...current.budget, ...updates }
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

  function updateTransaction(id, updates) {
    setData((current) => ({
      ...current,
      transactions: current.transactions.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...updates,
              amount: updates.amount != null ? Number(updates.amount) : transaction.amount
            }
          : transaction
      )
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

  function toggleRoadmapStep(id) {
    setData((current) => ({
      ...current,
      career: {
        ...current.career,
        roadmap: (current.career.roadmap ?? []).map((step) =>
          step.id === id ? { ...step, done: !step.done } : step
        )
      }
    }));
  }

  function resetDemoData() {
    setData(createDemoData(currentUser ?? undefined));
  }

  const value = useMemo(
    () => ({
      data,
      addApplication,
      addSkill,
      addTransaction,
      removeSkill,
      removeTransaction,
      resetDemoData,
      toggleRoadmapStep,
      updateApplication,
      updateBudget,
      updateCareer,
      updatePreferences,
      updateProfile,
      updateSavingsGoal,
      updateTransaction
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
