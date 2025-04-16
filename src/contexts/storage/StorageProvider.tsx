import { PropsWithChildren, useEffect, useState, useCallback, useMemo } from 'react';
import { useToken } from '../../hooks/useToken';
import { storageApiUrl } from './storageApiUrl';
import { SaveFile, Task } from '../../types/SaveFile';
import { StorageContext } from './StorageContext';
import { MAX_DATA_LENGTH_PER_USER } from './maxSpace';
import { Tasks } from '../../services/dates';

export function StorageProvider({ children }: PropsWithChildren<object>) {
    const getToken = useToken();
    useEffect(() => {
        const { host, protocol } = new URL(storageApiUrl);
        const stayAlive = () => {
            fetch(protocol + '//' + host + '/stay-alive');
        };

        stayAlive();
        const interval = setInterval(stayAlive, 2 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const [taskPool, setTaskPool] = useState<Task[] | null>();
    const [data, setData] = useState<SaveFile | null>();

    const load = useCallback(
        (signal?: AbortSignal) => {
            let validToken = '';
            return getToken()
                .then((token) => {
                    if (!token) {
                        throw new Error('No Token');
                    }
                    validToken = token;
                    return fetch(storageApiUrl, {
                        headers: {
                            Authorization: token,
                        },
                        signal,
                    });
                })
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error(await response.text());
                        throw new Error('Unable to save');
                    }
                })
                .then(async (result: { data: SaveFile; pool: Task[] }) => {
                    result.data.tasks.forEach((t) => {
                        Tasks.normalize(t);
                    });

                    await fetch(storageApiUrl, {
                        method: 'POST',
                        body: JSON.stringify(result.data),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: validToken,
                        },
                        signal,
                    });

                    setData(result.data);

                    const timezoneOffset = new Date().getTimezoneOffset()
                    result.pool.forEach(x=>{
                        if (new Date(x.dueDate).getHours() !== 0) {
                            x.dueDate += timezoneOffset * 60000;
                            x.startDate += timezoneOffset * 60000;
                        }
                        
                    })
                    console.log(result.pool)

                    setTaskPool(result.pool);
                    return result.data;
                })
                .catch((er) => {
                    console.error(er);
                    setData(null);
                    setTaskPool(null);
                    return null;
                });
        },
        [getToken]
    );

    const save = useCallback(
        (file: SaveFile, signal?: AbortSignal) => {
            file.date = Date.now();
            file.tasks.forEach((t) => {
                Tasks.normalize(t);
            });
            return getToken()
                .then((token) => {
                    if (!token) {
                        throw new Error('No Token');
                    }
                    return fetch(storageApiUrl, {
                        method: 'POST',
                        body: JSON.stringify(file),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                        signal,
                    });
                })
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error(await response.text());
                        throw new Error('Unable to save');
                    }
                })
                .then(async (result: { data: SaveFile; pool: Task[] }) => {
                    setData(result.data);
                    console.log(result.pool)
                    setTaskPool(result.pool);
                    return result.data;
                })
                .catch((er) => {
                    console.error(er);
                    setData(null);
                    setTaskPool(null);
                    return null;
                });
        },
        [getToken]
    );

    const { spaceLeft, spaceUsed } = useMemo(() => {
        const spaceUsed = JSON.stringify(data ?? {}).length;
        const spaceLeft = MAX_DATA_LENGTH_PER_USER - spaceUsed;
        return {
            spaceLeft,
            spaceUsed,
        };
    }, [data]);

    return (
        <StorageContext.Provider
            value={{
                data,
                taskPool,
                spaceUsed,
                spaceLeft,
                load,
                save,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
}
