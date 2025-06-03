import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { describeFilter } from '../../services/describeFilter';
import { Task } from '../../types/SaveFile';

export const TaskDescription = memo(({ task, interval, centerTitle }: { task: Task; interval?: boolean; centerTitle?: boolean }) => (
    <div
        className={`d-flex align-self-stretch gap-2 justify-content-between align-items-center ${
            centerTitle ? 'align-self-lg-stretch' : 'align-self-lg-start'
        } `}
    >
        <div className='h5 mb-0 fw-normal'>{task.description}</div>
        {interval && (
            <div style={{ paddingTop: 2, paddingBottom: 2 }} className='bg-light px-3 fs-80 rounded-pill text-dark text-nowrap'>
                <FontAwesomeIcon icon={faRepeat} /> {describeFilter(task.filters)}
            </div>
        )}
    </div>
));
