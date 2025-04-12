import { PropsWithChildren, useState, useCallback, useEffect } from "react";
import { useOffCanvas } from "../offcanvas/useOffCanvas";
import { useStorage } from "../storage/useStorage";
import { Task } from "../../types/SaveFile";
import { TaskEditContext } from "./TaskEditContext";
import { TaskEditForm } from "../../pages/home/TaskEditForm";
import { toDay } from "../../services/toDay";

export function TaskEditProvider({ children }: PropsWithChildren) {
  const [task, setTask] = useState<Task>();
  const { open, close, setContent, setTitle } = useOffCanvas();
  const { data, save: saveData } = useStorage();

  const create = useCallback(() => {
    setTitle("Create Task");
    setTask({
      description: "",
      id: crypto.randomUUID(),
      startDate: toDay(new Date()).valueOf(),
      filters: {
        day: [new Date().getDay()],
      },
    });
  }, [setTitle]);

  const cancel = useCallback(() => {
    setTask(undefined);
  }, []);

  const save = useCallback(
    async (newTask: Task) => {
      if (!data) {
        return;
      }

      const success = await saveData({
        ...data,
        date: Date.now(),
        tasks: data.tasks.filter((x) => x.id !== newTask.id).concat(newTask),
      });
      if (success) {
        setTask(undefined);
      }
    },
    [data, saveData]
  );

  const load = useCallback(
    (task: Task) => {
      setTitle("Edit Task");
      setTask(task);
    },
    [setTitle]
  );

  useEffect(() => {
    if (task) {
      setContent(<TaskEditForm save={save} task={task} />);
    }
  }, [save, setContent, task]);

  useEffect(() => {
    if (task) {
      open();
    } else {
      setTitle(null);
      setContent(null);
      close();
    }
  }, [close, open, setContent, setTitle, task]);

  return (
    <TaskEditContext.Provider value={{ create, cancel, load }}>
      {children}
    </TaskEditContext.Provider>
  );
}
