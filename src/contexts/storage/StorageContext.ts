import React from "react";
import { SaveFile } from "../../types/SaveFile";

export const StorageContext = React.createContext<{
  data: SaveFile | undefined | null;
  load: (signal?: AbortSignal) => Promise<SaveFile | null>;
  save: (file: SaveFile, signal?: AbortSignal) => Promise<SaveFile | null>;
}>({
  data: null,
  save: async () => {
    throw new Error("No Storage Provider");
  },
  load: async () => {
    throw new Error("No Storage Provider");
  },
});
