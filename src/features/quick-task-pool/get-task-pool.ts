import { toDay } from '../../services/toDay';
import { RecurrenceType, Task } from '../../types/SaveFile';
import pool from './tasks.json';

const incrementDate = (d: Date, days: number) => {
    const newDate = new Date(d);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

function createTasks(poolCycleTime = 10, daysInCycle = 0) {
    const itemsPerDay = Math.ceil(pool.length / poolCycleTime);

    const baseDay = toDay(new Date());
    baseDay.setDate(baseDay.getDate() - daysInCycle);

    return (pool as [string, number][]).map((x, i) => {
        const task: Task & { poolId: number } = {
            poolId: x[1],
            id: 'pool-' + x[1],
            description: x[0],
            filters: {
                type: RecurrenceType.IntervalDay,
                interval: {
                    length: poolCycleTime,
                    step: 'day',
                },
            },
            startDate: incrementDate(baseDay, Math.floor(i / itemsPerDay)).valueOf(),
        };

        return task;
    });
}

export function getTaskPool(all = false, poolCycleTime = 10, daysInCycle = 0) {
    const taskPool = createTasks(poolCycleTime, daysInCycle);

    if (all) return taskPool;
    const now = toDay(new Date()).valueOf();
    return taskPool.filter((x) => x.startDate === now);
}
