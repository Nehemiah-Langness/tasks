import { useMemo } from 'react';
import { useStorage } from '../../contexts/storage/useStorage';
import { getTaskPool } from '../../features/quick-task-pool/get-task-pool';
import { getNextPassingDate } from '../../services/getNextPassingDate';
import { toDay } from '../../services/toDay';
import { daysBetween } from '../../services/daysBetween';

export function useTasks(allPool = false) {
    const { data } = useStorage();
    return useMemo(
        () =>
            data?.tasks
                .map((t) => {
                    const nextDueDate = getNextPassingDate(new Date(t.startDate), t.filters, true);
                    return { task: t, nextDueDate };
                })
                .concat(
                    getTaskPool(
                        allPool,
                        data.poolConfiguration.cycleSize,
                        daysBetween(data.poolConfiguration.startDate, toDay(new Date()))
                    ).map((x) => {
                        x.lastCompleted = data.pool.find((p) => p.id === x.poolId)?.lastCompleted;
                        return {
                            task: x,
                            nextDueDate:
                                x.lastCompleted && x.lastCompleted >= x.startDate
                                    ? getNextPassingDate(new Date(x.lastCompleted), x.filters)
                                    : new Date(x.startDate),
                        };
                    })
                )
                .sort((a, b) => (a.nextDueDate?.valueOf() ?? 0) - (b.nextDueDate?.valueOf() ?? 0)),
        [allPool, data?.pool, data?.poolConfiguration.cycleSize, data?.poolConfiguration.startDate, data?.tasks]
    );
}
