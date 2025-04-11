import { useContext } from "react";
import { TaskEditContext } from "./TaskEditContext";


export function useEditTasks() {
  return useContext(TaskEditContext);
}
