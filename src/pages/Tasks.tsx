import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TaskEditProvider } from '../contexts/edit-tasks/TaskEditProvider';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../services/formatDate';
import { useStorage } from '../contexts/storage/useStorage';
import { useTasks } from '../contexts/tasks/useTasks';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingMessage } from '../components/LoadingMessage';
import { NewTaskButton } from './tasks/NewTaskButton';
import { EditPoolButton } from './tasks/EditPoolButton';
import { TaskRow } from './tasks/TaskRow';
import { Link } from 'react-router';

export function Tasks() {
    const { data, spaceLeft, spaceUsed } = useStorage();
    const tasks = useTasks(true);
    const spaceRemaining = (spaceUsed * 100) / (spaceLeft + spaceUsed);

    if (data === null) {
        return <ErrorMessage error='Unable to load your data' />;
    }

    if (!data) {
        return <LoadingMessage />;
    }

    return (
        <TaskEditProvider>
            <div className='container d-flex flex-column gap-2'>
                <Link to={'/'} className='text-center text-decoration-none fs-150'>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Today's Agenda
                </Link>
                <div className='d-flex gap-2 justify-content-between align-items-center'>
                    <NewTaskButton />
                    <EditPoolButton />
                </div>
                <div className='d-flex justify-content-between align-items-center gap-2'>
                    <span className='fs-140 fw-light'>Your Tasks List</span>
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

                <div className='d-flex flex-column gap-2 px-3'>
                    {tasks?.map((x) => (
                        <TaskRow key={x.id} task={x} />
                    ))}
                </div>
            </div>
        </TaskEditProvider>
    );
}
