import { useCallback } from "react";
import { useStorage } from "../../contexts/storage/useStorage";
import { getNextPassingDate } from "../../services/getNextPassingDate";
import { toDay } from "../../services/toDay";

export function useCompleteTask(id: string) {
  const { data, save } = useStorage();

  return useCallback(() => {
    if (!data) {
      return;
    }

    if (id.startsWith("pool-")) {
      const poolId = +id.replace("pool-", "");
      data.pool = data.pool
        .filter((x) => x.id !== poolId)
        .concat({
          id: poolId,
          lastCompleted: toDay(Date.now()).valueOf(),
        });
    } else {
      const t = data.tasks.find((t) => t.id === id);
      if (!t) {
        return;
      }
      const now = toDay(Date.now());
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      t.lastCompleted = now.valueOf();
      while (toDay(t.startDate).valueOf() <= now.valueOf()) {
        t.startDate = toDay(
          getNextPassingDate(new Date(t.startDate), t.filters) ?? tomorrow
        ).valueOf();
      }
    }

    return save(data);
  }, [data, id, save]);
}
