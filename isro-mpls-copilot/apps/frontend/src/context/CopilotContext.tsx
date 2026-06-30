"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CopilotResponse } from "../types";

interface CopilotContextType {
  apiResponse: CopilotResponse | null;
  setApiResponse: (res: CopilotResponse | null) => void;
  activeTelemetry: Record<string, string>;
  setActiveTelemetry: (telemetry: Record<string, string>) => void;
  demoActive: boolean;
  setDemoActive: (active: boolean) => void;
  recoveryState: "IDLE" | "REROUTING" | "RESOLVED";
  setRecoveryState: (state: "IDLE" | "REROUTING" | "RESOLVED") => void;
  logs: string[];
  addLog: (msg: string) => void;
  clearLogs: () => void;
  isQuerying: boolean;
  setIsQuerying: (isQuerying: boolean) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [apiResponse, setApiResponse] = useState<CopilotResponse | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState<Record<string, string>>({});
  const [demoActive, setDemoActive] = useState(false);
  const [recoveryState, setRecoveryState] = useState<"IDLE" | "REROUTING" | "RESOLVED">("IDLE");
  const [logs, setLogs] = useState<string[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);

  const addLog = (msg: string) => {
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}]`;
    setLogs((prev) => [...prev, `${timeStr} ${msg}`]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <CopilotContext.Provider
      value={{
        apiResponse,
        setApiResponse,
        activeTelemetry,
        setActiveTelemetry,
        demoActive,
        setDemoActive,
        recoveryState,
        setRecoveryState,
        logs,
        addLog,
        clearLogs,
        isQuerying,
        setIsQuerying,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }
  return context;
}
