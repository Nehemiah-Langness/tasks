import { useCallback } from 'react';
import { useStorage } from '../../contexts/storage/useStorage';
import { Dates, Tasks } from '../../services/dates';

export function useCompleteTask(id: string) {
    const { data, save } = useStorage();

    return useCallback(() => {
        if (!data) {
            return;
        }

        if (id.startsWith('pool-')) {
            const poolId = +id.replace('pool-', '');
            data.pool = data.pool
                .filter((x) => x.id !== poolId)
                .concat({
                    id: poolId,
                    lastCompleted: Dates.today().valueOf(),
                });
        } else {
            const t = data.tasks.find((t) => t.id === id);
            if (!t) {
                return;
            }
            Tasks.complete(t);
        }

        return save(data);
    }, [data, id, save]);
}
