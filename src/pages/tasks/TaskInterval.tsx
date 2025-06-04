import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { describeFilter } from '../../services/describeFilter';
import { Task } from '../../types/SaveFile';


export const TaskInterval = memo(({ task }: { task: Task; }) => (
    <div style={{ paddingTop: 2, paddingBottom: 2 }} className='bg-secondary-subtle px-3 fs-80 rounded-pill text-dark text-nowrap'>
        <FontAwesomeIcon icon={faRepeat} /> {describeFilter(task.filters)}
    </div>
));
