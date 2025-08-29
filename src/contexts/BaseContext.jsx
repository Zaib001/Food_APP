import React, { createContext, useContext, useEffect, useState } from "react";

const BaseContext = createContext();
export const useBases = () => useContext(BaseContext);

const LS_KEY = "operational_bases_v1";

export const BaseProvider = ({ children }) => {
  const [bases, setBases] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(bases));
  }, [bases]);

  // Replace these with your API if desired
  const addBase = (payload) => {
    const doc = {
      _id: crypto.randomUUID(),
      name: payload.name.trim(),
      code: payload.code?.trim() || "",
      location: payload.location?.trim() || "",
      contact: payload.contact?.trim() || "",
      notes: payload.notes?.trim() || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBases((p) => [...p, doc]);
  };

  const editBase = (id, updates) => {
    setBases((p) =>
      p.map((b) =>
        b._id === id
          ? { ...b, ...updates, updatedAt: new Date().toISOString() }
          : b
      )
    );
  };

  const removeBase = (id) => setBases((p) => p.filter((b) => b._id !== id));

  return (
    <BaseContext.Provider value={{ bases, addBase, editBase, removeBase }}>
      {children}
    </BaseContext.Provider>
  );
};
