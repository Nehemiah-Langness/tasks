import { Offcanvas } from "bootstrap";
import React, { PropsWithChildren, useRef, useState, useCallback } from "react";
import { OffCanvasContext } from "./OffCanvasContext";

export function OffCanvasProvider({ children }: PropsWithChildren<object>) {
  const ref = useRef<HTMLDivElement>(null);
  const [Title, setTitle] = useState<React.ReactNode>(null);
  const [Content, setContent] = useState<React.ReactNode>(null);

  const getOffCanvas = useCallback(() => {
    if (ref.current) {
      return Offcanvas.getOrCreateInstance(ref.current);
    } else {
      return null;
    }
  }, []);

  const show = useCallback(() => {
    const offCanvas = getOffCanvas();
    if (offCanvas) {
      offCanvas.show();
    }
  }, [getOffCanvas]);

  const hide = useCallback(() => {
    const offCanvas = getOffCanvas();
    if (offCanvas) {
      offCanvas.hide();
    }
  }, [getOffCanvas]);

  return (
    <OffCanvasContext.Provider
      value={{
        ref: ref,
        open: show,
        close: hide,
        Content,
        setContent,
        Title,
        setTitle,
      }}
    >
      {children}
    </OffCanvasContext.Provider>
  );
}
