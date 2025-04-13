import { useCallback } from "react";
import { useStorage } from "../../contexts/storage/useStorage";

export function useDeleteTask(id: string) {
  const { data, save } = useStorage();

  return useCallback(() => {
    if (!data) {
      return;
    }
    data.tasks = data.tasks.filter((t) => t.id !== id);
    return save(data);
  }, [data, id, save]);
}
