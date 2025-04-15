import { Offcanvas } from 'bootstrap';
import React, { PropsWithChildren, useRef, useState, useCallback, useEffect } from 'react';
import { OffCanvasContext } from './OffCanvasContext';

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

    const [isOpen, setIsOpen] = useState(false);
    const element = ref.current;
    useEffect(() => {
        if (element) {
            const onShown = () => {
                setIsOpen(true);
            };
            const onHidden = () => {
                setIsOpen(false);
            };
            element.addEventListener('hidden.bs.offcanvas', onHidden);
            element.addEventListener('show.bs.offcanvas', onShown);
            return () => {
                element.removeEventListener('hidden.bs.offcanvas', onHidden);
                element.removeEventListener('show.bs.offcanvas', onShown);
            };
        }
    }, [element]);

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
                isOpen,
            }}
        >
            {children}
        </OffCanvasContext.Provider>
    );
}
