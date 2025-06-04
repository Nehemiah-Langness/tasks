import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TaskEditProvider } from '../contexts/edit-tasks/TaskEditProvider';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../services/formatDate';
import { useStorage } from '../contexts/storage/useStorage';
import { useTasks } from '../contexts/tasks/useTasks';
import { ErrorMessage } from '../components/ErrorMessage';
import { NewTaskButton } from './tasks/NewTaskButton';
import { EditPoolButton } from './tasks/EditPoolButton';
import { TaskRow } from './tasks/TaskRow';
import { Link } from 'react-router';
import { VacationButton } from './tasks/VacationButton';

export function Tasks() {
    const { data, spaceLeft, spaceUsed } = useStorage();
    const tasks = useTasks();
    const spaceRemaining = (spaceUsed * 100) / (spaceLeft + spaceUsed);

    if (data === null) {
        return <ErrorMessage error='Unable to load your tasks' />;
    }

    return (
        <TaskEditProvider>
            <div className='container d-flex flex-column gap-2 mt-5'>
                <Link to={'/'} className={`btn btn-outline-primary align-self-lg-center rounded-0 fw-bold px-5 py-3`}>
                    View Today's Agenda
                </Link>
                <div className='d-flex gap-2 align-items-center flex-wrap'>
                    <NewTaskButton />
                    <EditPoolButton />
                    <VacationButton />
                </div>

                <div className='d-flex flex-column gap-2'>
                    {tasks
                        ? tasks.map((x) => <TaskRow key={x.id} task={x} />)
                        : new Array(3).fill(0).map((_x, i) => <div key={i} className='skeleton rounded' style={{ height: '7rem' }}></div>)}
                </div>
                {data && (
                    <div className='d-flex justify-content-center align-items-center gap-2'>
                        <div className='fs-80 '>
                            <div>
                                <FontAwesomeIcon className='text-success' icon={faSave} /> {formatDate(data.date)}
                            </div>
                            <div>
                                <div
                                    className='progress position-relative'
                                    role='progressbar'
                                    aria-label='Example with label'
                                    aria-valuenow={spaceRemaining}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className='progress-bar overflow-visible text-dark'
                                        style={{ width: `${spaceRemaining.toFixed()}%` }}
                                    ></div>
                                    <div className='position-absolute start-0 end-0 top-0 bottom-0 d-flex align-items-center justify-content-center'>
                                        {(100 - spaceRemaining).toFixed()}% Available Space
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TaskEditProvider>
    );
}
