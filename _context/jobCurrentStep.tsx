"use client";

import { createContext, useContext, useState } from "react";

// Define the type for the context value
interface JobCurrentStepContextType {
  currentStep: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with the correct type
export const JobCurrentStepContext = createContext<JobCurrentStepContextType | undefined>(undefined);

export const JobCurrentStepContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<string>("");

  return (
    <JobCurrentStepContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </JobCurrentStepContext.Provider>
  );
};

// Custom hook for consuming the context
export const useJobCurrentStepContext = () => {
    const context = useContext(JobCurrentStepContext);

    if (!context) {
      throw new Error("useJobCurrentStepContext must be used within a JobCurrentStepContextProvider");
    }
    return context
};
