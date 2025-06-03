import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dates } from '../../services/dates';
import { Task } from '../../types/SaveFile';
import { TaskDescription } from '../tasks/TaskDescription';
import { CompleteButton } from './CompleteButton';
import { useCompleteTask } from './useCompleteTask';


export function TaskRow({
    task, pastDue, completed, noComplete,
}: {
    task: Task;
    pastDue?: boolean;
    completed?: boolean;
    noComplete?: boolean;
}) {
    const completeTask = useCompleteTask(task.id);

    return (
        <div className='d-flex align-items-start justify-content-between flex-wrap flex-column flex-lg-row align-items-lg-center'>
            <div className='d-flex gap-3 align-items-center'>
                {!noComplete ? (
                    <div>
                        <CompleteButton onClick={completeTask} completed={completed} />
                    </div>
                ) : (
                    <div className='btn'>
                        <FontAwesomeIcon className='fs-200 text-secondary' icon={faStopwatch} />
                    </div>
                )}
                <TaskDescription task={task} centerTitle />
            </div>
            <div className='align-self-stretch text-center align-self-lg-start'>
                {task.dueDate && pastDue && (
                    <div style={{ paddingTop: 2, paddingBottom: 2 }} className='bg-danger-subtle px-3 fs-80 rounded-1 text-danger-emphasis'>
                        Due:{' '}
                        {Dates.format(task.dueDate, {
                            date: true,
                            summarize: true,
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
