import { useMemo } from "react";
import { useStorage } from "../../contexts/storage/useStorage";
import { getTaskPool } from "../../features/quick-task-pool/get-task-pool";
import { getNextPassingDate } from "../../services/getNextPassingDate";

export function useTasks() {
  const { data } = useStorage();
  return useMemo(
    () => data?.tasks
      .map((t) => {
        const nextDueDate = getNextPassingDate(
          new Date(t.startDate),
          t.filters,
          true
        );
        return { task: t, nextDueDate };
      })
      .concat(
        getTaskPool().map((x) => {
          x.lastCompleted = data.pool.find(
            (p) => p.id === x.poolId
          )?.lastCompleted;
          return {
            task: x,
            nextDueDate: x.lastCompleted && x.lastCompleted >= x.startDate
              ? getNextPassingDate(new Date(x.lastCompleted), x.filters)
              : new Date(x.startDate),
          };
        })
      )
      .sort(
        (a, b) => (a.nextDueDate?.valueOf() ?? 0) - (b.nextDueDate?.valueOf() ?? 0)
      ),
    [data?.pool, data?.tasks]
  );
}
