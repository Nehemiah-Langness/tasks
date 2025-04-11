import React from "react";
import { Task } from "../types/SaveFile";


export const TaskEditContext = React.createContext<{
  cancel: () => void;
  create: () => void;
  load: (task: Task) => void;
}>({
  cancel: () => {
    throw new Error("No TaskEditContext.Provider");
  },
  create: () => {
    throw new Error("No TaskEditContext.Provider");
  },
  load: () => {
    throw new Error("No TaskEditContext.Provider");
  },
});
