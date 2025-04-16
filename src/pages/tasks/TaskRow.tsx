import { faInfoCircle, faRepeat, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { describeFilter } from '../../services/describeFilter';
import { Task } from '../../types/SaveFile';
import { useEditTasks } from '../../contexts/edit-tasks/useEditTasks';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useDeleteTask } from '../home/useDeleteTask';
import { Dates } from '../../services/dates';

export function TaskRow({ task }: { task: Task }) {
    const { load } = useEditTasks();
    const deleteTask = useDeleteTask(task.id);

    // const nextDueDate = useMemo(() => {
    //     return Tasks.nextDueDate(task.dueDate, task.filters, Dates.increment(Dates.today(), 1, 'day'));
    // }, [task.dueDate, task.filters]);
    return (
        <div className='px-2 py-2 border rounded d-flex flex-column gap-2'>
            <div className='d-flex align-items-start justify-content-between flex-wrap flex-column flex-lg-row align-items-lg-center'>
                <div className='d-flex align-self-stretch gap-2 justify-content-between align-items-center align-self-lg-center'>
                    <div className='h5 mb-0 fw-normal'>{task.description}</div>
                    <div style={{ paddingTop: 2, paddingBottom: 2 }} className='bg-light px-3 fs-80 rounded-pill text-dark text-nowrap'>
                        <FontAwesomeIcon icon={faRepeat} /> {describeFilter(task.filters)}
                    </div>
                </div>

                <div className='text-lg-end'>
                    {task.lastCompleted && (
                        <div className='fs-80 text-success'>
                            Completed: {Dates.format(task.lastCompleted, { date: true, summarize: true })}
                        </div>
                    )}
                    {task.dueDate && (
                        <div className=' fs-80 text-danger-emphasis'>
                            Due: {Dates.format(task.dueDate, { date: true, summarize: true, day: true })}
                        </div>
                    )}
                </div>
            </div>
            <div className='d-flex gap-2 align-items-center px-3 flex-wrap'></div>
            {!task.id.startsWith('pool-') ? (
                <div className='d-flex justify-content-between gap-3'>
                    <button
                        className='btn btn-link text-decoration-none fs-80 d-flex-center gap-1'
                        type='button'
                        onClick={() => load(task)}
                    >
                        <FontAwesomeIcon className='fs-larger' icon={faPenToSquare} /> Edit
                    </button>
                    <button
                        className='btn btn-link link-danger text-decoration-none fs-80 d-flex-center  gap-1'
                        type='button'
                        onClick={deleteTask}
                    >
                        <FontAwesomeIcon className='fs-larger' icon={faTrash} /> Delete
                    </button>
                </div>
            ) : (
                <div className='fs-80 px-3 text-info' title='This tasks comes from a pool of pre-built task to work through'>
                    <FontAwesomeIcon icon={faInfoCircle} /> 5-Minute Task
                </div>
            )}
        </div>
    );
}
