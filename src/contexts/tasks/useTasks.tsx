import { useMemo } from 'react';
import { useStorage } from '../storage/useStorage';

export function useTasks() {
    const { data, taskPool } = useStorage();
    return useMemo(
        () =>
            data && taskPool
                ? data.tasks
                      .concat(taskPool)
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
                      )
                : data === null ? null : undefined,
        [data, taskPool]
    );
}
