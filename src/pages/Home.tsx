import { useCallback, useEffect, useState } from 'react';
import { useStorage } from '../contexts/storage/useStorage';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingMessage } from '../components/LoadingMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilSquare, faSave } from '@fortawesome/free-solid-svg-icons';
import { useOffCanvas } from '../contexts/offcanvas/useOffCanvas';
import { formatDate } from '../services/formatDate';
import { NewTaskButton } from './home/NewTaskButton';
import { Today } from './home/Today';
import { TaskEditProvider } from '../contexts/edit-tasks/TaskEditProvider';
import { TaskRow } from './home/TaskRow';
import { useTasks } from './home/useTasks';
import { PoolConfiguration } from '../types/SaveFile';
import { PoolEditForm } from './home/PoolEditForm';

export function Home() {
    const { data, load, spaceLeft, spaceUsed } = useStorage();
    const { open } = useOffCanvas();

    const tasks = useTasks(true);

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => {
            controller.abort();
        };
    }, [load]);

    if (data === null) {
        return <ErrorMessage error='Unable to load your data' />;
    }

    if (!data) {
        return <LoadingMessage />;
    }

    const spaceRemaining = (spaceUsed * 100) / (spaceLeft + spaceUsed);

    return (
        <TaskEditProvider>
            <div className='container d-flex flex-column gap-2'>
                <Today />

                <div className='d-flex justify-content-between align-items-center gap-2' onClick={open}>
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
                <EditPoolButton />
                <NewTaskButton />

                <div className='d-flex flex-column gap-2 px-3'>
                    {tasks?.map((x) => (
                        <TaskRow key={x.id} task={x} />
                    ))}
                </div>
            </div>
        </TaskEditProvider>
    );
}

function EditPoolButton() {
    const { data, save } = useStorage();
    const { setContent, setTitle, close, open } = useOffCanvas();
    const [poolConfig, setPoolConfig] = useState<PoolConfiguration>();

    const savePool = useCallback(
        async (config: PoolConfiguration) => {
            if (data) {
                data.poolConfiguration = config;
                const success = await save(data);
                if (success) {
                    setPoolConfig(undefined);
                }
            }
        },
        [data, save]
    );

    useEffect(() => {
        if (poolConfig) {
            setTitle('Edit 5-Minute Task Pool');
            setContent(<PoolEditForm poolConfiguration={poolConfig} save={savePool} />);
            return () => {
                setTitle(null);
                setContent(null);
            };
        }
    }, [poolConfig, savePool, setContent, setTitle]);

    useEffect(() => {
        if (poolConfig) {
            open();
            return () => {
                close();
            };
        }
    }, [close, open, poolConfig]);

    return (
        <button
            className='btn btn-link link-success text-decoration-none d-flex align-items-center gap-2'
            onClick={() => setPoolConfig(data?.poolConfiguration)}
        >
            <FontAwesomeIcon style={{ fontSize: '1.1em' }} icon={faPencilSquare} /> Edit 5-Minute Tasks
        </button>
    );
}
