import { faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Task } from '../../types/SaveFile';
import { useEditTasks } from '../../contexts/edit-tasks/useEditTasks';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useDeleteTask } from '../home/useDeleteTask';
import { Dates } from '../../services/dates';
import { TaskDescription } from './TaskDescription';

export function TaskRow({ task }: { task: Task }) {
    const { load } = useEditTasks();
    const deleteTask = useDeleteTask(task.id);

    return (
        <div className='px-2 py-2 border rounded d-flex flex-column gap-2'>
            <div className='d-flex align-items-start justify-content-between flex-wrap flex-column flex-lg-row align-items-lg-center'>
                <TaskDescription task={task} interval />

                <div className='text-lg-end'>
                    {task.lastCompleted && (
                        <div className='fs-80 text-success text-nowrap'>
                            Completed: {Dates.format(task.lastCompleted, { date: true, summarize: true })}
                        </div>
                    )}
                    {task.dueDate && (
                        <div className='fs-80 text-danger-emphasis text-nowrap'>
                            Due: {Dates.format(task.dueDate, { date: true, summarize: true, day: true })}
                        </div>
                    )}
                </div>
            </div>
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
