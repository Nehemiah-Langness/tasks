import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Task } from '../../types/SaveFile';
import { useEditTasks } from '../../contexts/edit-tasks/useEditTasks';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useDeleteTask } from '../home/useDeleteTask';
import { Dates } from '../../services/dates';
import { TaskDescription } from './TaskDescription';
import { TaskInterval } from './TaskInterval';

export function TaskRow({ task }: { task: Task }) {
    const { load, create } = useEditTasks();
    const deleteTask = useDeleteTask(task.id);

    return (
        <div>
            <div
                className='p-2 px-4 bg-white d-inline-block border border-bottom-0'
                style={{ borderRadius: 'var(--bs-border-radius) var(--bs-border-radius) 0 0', marginBottom: -1 }}
            >
                <TaskDescription task={task} />
            </div>
            <div
                className='px-2 pt-3 py-2 border d-flex flex-column gap-2 bg-white shadow-sm'
                style={{ borderRadius: '0 var(--bs-border-radius) var(--bs-border-radius) var(--bs-border-radius)' }}
            >
                <div className='d-flex align-items-start gap-2 justify-content-between flex-wrap flex-column flex-lg-row px-2'>
                    <div className='d-flex flex-wrap gap-2 '>
                        <TaskInterval task={task} />
                        {typeof task.poolId === 'number' && (
                            <div
                                style={{ paddingTop: 2, paddingBottom: 2 }}
                                className='bg-secondary-subtle px-3 fs-80 rounded-pill text-dark text-nowrap'
                            >
                                5-Minute Task Pool
                            </div>
                        )}
                    </div>
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
                            className='btn btn-link link-danger text-decoration-none fs-80 d-flex-center gap-1'
                            type='button'
                            onClick={deleteTask}
                        >
                            <FontAwesomeIcon className='fs-larger' icon={faTrash} /> Delete
                        </button>
                    </div>
                ) : (
                    <div className='d-flex align-items-center gap-2'>
                        <button
                            className='btn btn-link text-decoration-none fs-80 d-flex-center gap-1'
                            type='button'
                            onClick={() =>
                                create({
                                    description: task.description,
                                    poolId: +task.id.replace('pool-', ''),
                                })
                            }
                        >
                            <FontAwesomeIcon className='fs-larger' icon={faPlus} /> <div>Convert to Regular Task</div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
