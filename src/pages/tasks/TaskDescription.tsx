import { memo } from 'react';
import { Task } from '../../types/SaveFile';

export const TaskDescription = memo(({ task, centerTitle }: { task: Task; centerTitle?: boolean }) => (
    <div
        className={`d-flex align-self-stretch gap-2 justify-content-between align-items-center ${
            centerTitle ? 'align-self-lg-stretch' : 'align-self-lg-start'
        } `}
    >
        <div className='h5 mb-0 fw-normal'>{task.description}</div>
    </div>
));


