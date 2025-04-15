import { useMemo } from 'react';
import { useStorage } from '../../contexts/storage/useStorage';
import { getTaskPool } from '../../features/quick-task-pool/get-task-pool';
import { Dates, Tasks } from '../../services/dates';

export function useTasks(allPool = false) {
    const { data } = useStorage();
    return useMemo(
        () =>
            data?.tasks
                .concat(
                    getTaskPool(
                        allPool,
                        data.poolConfiguration.cycleSize,
                        Dates.daysBetween(data.poolConfiguration.startDate, Dates.today())
                    ).map((x) => {
                        x.lastCompleted = data.pool.find((p) => p.id === x.poolId)?.lastCompleted;
                        x.dueDate = (
                            Tasks.nextDueDate(
                                x.startDate,
                                x.filters,
                                x.lastCompleted ? Dates.increment(x.lastCompleted, 1, 'day') : undefined
                            ) ?? Dates.today()
                        ).valueOf();
                        return x;
                    })
                )
                .sort((a, b) =>
                    a.dueDate < b.dueDate
                        ? -1
                        : a.dueDate > b.dueDate
                        ? 1
                        : (a.lastCompleted ?? 0) < (b.lastCompleted ?? 0)
                        ? -1
                        : (a.lastCompleted ?? 0) > (b.lastCompleted ?? 0)
                        ? 1
                        : a.description < b.description
                        ? -1
                        : a.description > b.description
                        ? 1
                        : 0
                ),
        [allPool, data?.pool, data?.poolConfiguration.cycleSize, data?.poolConfiguration.startDate, data?.tasks]
    );
}
