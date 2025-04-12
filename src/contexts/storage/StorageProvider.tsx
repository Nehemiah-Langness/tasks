import {
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useToken } from "../../hooks/useToken";
import { storageApiUrl } from "./storageApiUrl";
import { SaveFile } from "../../types/SaveFile";
import { StorageContext } from "./StorageContext";
import { MAX_DATA_LENGTH_PER_USER } from "./maxSpace";
import { toDay } from "../../services/toDay";
import { dateMatchesFilter } from "../../services/dateMatchesFilter";
import { getNextPassingDate } from "../../services/getNextPassingDate";

export function StorageProvider({ children }: PropsWithChildren<object>) {
  const getToken = useToken();
  useEffect(() => {
    const { host, protocol } = new URL(storageApiUrl);
    const stayAlive = () => {
      fetch(protocol + "//" + host + "/stay-alive");
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
      return getToken()
        .then((token) => {
          if (!token) {
            throw new Error("No Token");
          }
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
            throw new Error("Unable to save");
          }
        })
        .then((data: Partial<SaveFile>) => {
          const file: SaveFile = {
            date: Date.now(),
            tasks: [],
            ...data,
          };

          file.tasks.forEach((t) => {
            if (typeof t.startDate !== "number") {
              console.log(
                t.description,
                "has no start date",
                (t.filters?.interval as { startDate: number } | undefined)
                  ?.startDate ?? toDay(new Date())
              );
              t.startDate =
                (t.filters?.interval as { startDate: number } | undefined)
                  ?.startDate ?? toDay(new Date()).valueOf();
            }
            if (
              t.filters?.date?.length ||
              t.filters?.day?.length ||
              t.filters?.month?.length
            ) {
              if (!dateMatchesFilter(new Date(t.startDate), t.filters)) {
                t.startDate =
                  getNextPassingDate(
                    new Date(t.startDate),
                    {
                      ...t.filters,
                      interval: undefined,
                    },
                    true
                  )?.valueOf() ?? toDay(Date.now()).valueOf();
              }
            }
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
      return getToken()
        .then((token) => {
          if (!token) {
            throw new Error("No Token");
          }
          return fetch(storageApiUrl, {
            method: "POST",
            body: JSON.stringify(file),
            headers: {
              "Content-Type": "application/json",
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
            throw new Error("Unable to save");
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
