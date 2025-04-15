import { Dates } from '../../services/dates';
import { RecurrenceType, Task } from '../../types/SaveFile';
import pool from './tasks.json';

function createTasks(poolCycleTime = 10, daysInCycle = 0) {
    const itemsPerDay = Math.ceil(pool.length / poolCycleTime);

    const baseDay = Dates.increment(Dates.today(), -daysInCycle, 'day');

    return (pool as [string, number][]).map((x, i) => {
        const dueDate = Dates.increment(baseDay, Math.floor(i / itemsPerDay), 'day').valueOf();

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
            startDate: dueDate,
            dueDate: dueDate,
        };

        return task;
    });
}

export function getTaskPool(all = false, poolCycleTime = 10, daysInCycle = 0) {
    const taskPool = createTasks(poolCycleTime, daysInCycle);

    if (all) return taskPool;
    const now = Dates.today().valueOf();
    return taskPool.filter((x) => x.startDate === now);
}
