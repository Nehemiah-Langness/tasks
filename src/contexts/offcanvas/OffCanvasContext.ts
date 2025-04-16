import React from 'react';

export const OffCanvasContext = React.createContext<{
    isOpen: boolean;
    open: () => void;
    close: () => void;
    ref: React.Ref<HTMLDivElement>;
    setTitle: (Node: React.ReactNode) => () => void;
    setContent: (Node: React.ReactNode) => () => void;
    Title: React.ReactNode;
    Content: React.ReactNode;
}>({
    isOpen: false,
    close: () => {},
    open: () => {},
    ref: { current: null },
    Content: null,
    Title: null,
    setTitle: () => () => {},
    setContent: () => () => {},
});
