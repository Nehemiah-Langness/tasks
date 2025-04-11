import { PropsWithChildren, useEffect, useState, useCallback } from "react";
import { useToken } from "../../hooks/useToken";
import { storageApiUrl } from "./storageApiUrl";
import { SaveFile } from "../../types/SaveFile";
import { StorageContext } from "./StorageContext";

export function StorageProvider({ children }: PropsWithChildren<object>) {
  const getToken = useToken();
  useEffect(() => {
    const { host, protocol } = new URL(storageApiUrl);
    const stayAlive = () => {
      fetch( protocol + '//' + host + "/stay-alive");
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
            ...data,
          };
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
            setData(file);
            return file;
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

  return (
    <StorageContext.Provider
      value={{
        data,
        load,
        save,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}
