import { PropsWithChildren, useEffect, useState, useCallback, useMemo } from 'react';
import { useToken } from '../../hooks/useToken';
import { storageApiUrl } from './storageApiUrl';
import { SaveFile } from '../../types/SaveFile';
import { StorageContext } from './StorageContext';
import { MAX_DATA_LENGTH_PER_USER } from './maxSpace';
import { Dates, Tasks } from '../../services/dates';

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

    const [data, setData] = useState<SaveFile | null | undefined>();

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
                .then(async (data: Partial<SaveFile>) => {
                    const file: SaveFile = {
                        date: Date.now(),
                        tasks: [],
                        pool: [],
                        poolConfiguration: {
                            cycleSize: 10,
                            disabledTasks: [],
                            startDate: Dates.today().valueOf(),
                        },
                        ...data,
                    };

                    file.tasks.forEach((t) => {
                        Tasks.normalize(t);
                    });

                    await fetch(storageApiUrl, {
                        method: 'POST',
                        body: JSON.stringify(file),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: validToken,
                        },
                        signal,
                    });

                    setData(file);
                    return file;
                })
                .catch((er) => {
                    console.error(er);
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
                .then((data: boolean) => {
                    if (data) {
                        const copy = structuredClone(file);
                        setData(copy);
                        return copy;
                    }
                    return null;
                })
                .catch((er) => {
                    console.error(er);
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
