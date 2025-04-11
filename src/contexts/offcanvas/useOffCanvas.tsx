import { useContext } from "react";
import { OffCanvasContext } from "./OffCanvasContext";

export function useOffCanvas() {
  return useContext(OffCanvasContext);
}
