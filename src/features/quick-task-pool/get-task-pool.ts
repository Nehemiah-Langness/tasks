import { toDay } from "../../services/toDay";
import { RecurrenceType, Task } from "../../types/SaveFile";
import pool from "./tasks.json";

const itemsPerDay = Math.ceil(pool.length / 7);
const incrementDate = (d: Date, days: number) => {
  const newDate = toDay(d);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const taskPool = (pool as [string, number][]).map((x, i) => {
  const task: Task & { poolId: number } = {
    poolId: x[1],
    id: "pool-" + x[1],
    description: x[0],
    filters: {
      type: RecurrenceType.Daily,
    },
    startDate: incrementDate(new Date(), Math.floor(i / itemsPerDay)).valueOf(),
  };

  return task;
});

export function getTaskPool(all = false) {
  if (all) return taskPool;
  const now = toDay(new Date()).valueOf();
  return taskPool.filter((x) => x.startDate === now);
}
