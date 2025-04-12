import React from "react";
import { SaveFile } from "../../types/SaveFile";
import { MAX_DATA_LENGTH_PER_USER } from "./maxSpace";

export const StorageContext = React.createContext<{
  spaceLeft: number;
  spaceUsed: number;
  data: SaveFile | undefined | null;
  load: (signal?: AbortSignal) => Promise<SaveFile | null>;
  save: (file: SaveFile, signal?: AbortSignal) => Promise<SaveFile | null>;
}>({
  data: null,
  spaceLeft: MAX_DATA_LENGTH_PER_USER,
  spaceUsed: 0,
  save: async () => {
    throw new Error("No Storage Provider");
  },
  load: async () => {
    throw new Error("No Storage Provider");
  },
});
