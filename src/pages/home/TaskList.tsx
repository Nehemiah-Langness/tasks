import { PropsWithChildren } from 'react';

export function TaskList({ children, title }: PropsWithChildren<{ title?: string; }>) {
    return (
        <>
            {!!title && <span className='fs-140 text-center'>{title}</span>}
            <div className='list-group list-group-flush w-100'>{children}</div>
        </>
    );
}
