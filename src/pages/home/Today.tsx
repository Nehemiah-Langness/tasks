import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { formatDate } from '../../services/formatDate';
import { Task } from '../../types/SaveFile';
import { getCriticism, getPraise } from '../../features/praise';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faCheckSquare, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { NotificationsButton } from './NotificationsButton';
import { useCompleteTask } from './useCompleteTask';
import { useTasks } from './useTasks';
import { Dates } from '../../services/dates';

export function Today() {
    const now = Dates.today().valueOf();
    const tomorrow = Dates.increment(now, 1, 'day').valueOf();
    const tasks = useTasks(true);

    const pastDue = useMemo(() => tasks?.filter((x) => !x.dueDate || x.dueDate < now) ?? [], [now, tasks]);
    const dueToday = useMemo(() => tasks?.filter((x) => x.dueDate && x.dueDate === now) ?? [], [now, tasks]);
    const dueTomorrow = useMemo(() => tasks?.filter((x) => x.dueDate && x.dueDate === tomorrow) ?? [], [tomorrow, tasks]);
    const completedToday = useMemo(() => tasks?.filter((x) => x.lastCompleted && x.lastCompleted >= now), [now, tasks]);

    const hasPastDueItems = pastDue.length > 0;
    const hasGoodDay = dueToday.length === 0 && !hasPastDueItems;

    const [message, setMessage] = useState<{
        type: 'praise' | 'criticism';
        message: string;
    }>();
    useEffect(() => {
        if (hasPastDueItems) {
            setMessage({
                message: getCriticism(),
                type: 'criticism',
            });
        }
    }, [hasPastDueItems]);

    useEffect(() => {
        if (hasGoodDay) {
            setMessage({
                message: getPraise(),
                type: 'praise',
            });
        }
    }, [hasGoodDay]);

    const clearMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    const DueItems = useMemo(
        () =>
            dueToday?.map((t) => (
                <div key={t.id} className='list-group-item'>
                    <TaskRow task={t} />
                </div>
            )),
        [dueToday]
    );

    const CompletedItems = useMemo(
        () =>
            completedToday?.map((t) => (
                <div key={t.id} className='list-group-item '>
                    <TaskRow task={t} completed />
                </div>
            )),
        [completedToday]
    );

    return (
        <div>
            {message && <Message message={message.message} onComplete={clearMessage} type={message.type} />}

            <div className='d-flex flex-column gap-3'>
                <div className='d-flex gap-2 justify-content-center align-items-center'>
                    <NotificationsButton />
                    <span className='fs-140'>
                        {formatDate(now, {
                            day: true,
                            date: true,
                        })}
                    </span>
                </div>
                {dueToday.length ? (
                    <TaskList>
                        <span className='fs-140 fw-light'>Today's Tasks</span>
                        {DueItems}
                        {!!completedToday?.length && (
                            <div className='list-group-item text-center h5 mb-0 fw-normal bg-success-subtle position-relative overflow-hidden'>
                                <AnimatedBackground />
                                <div className='position-relative' style={{ zIndex: 1 }}>
                                    <b>{completedToday.length}</b> task
                                    {completedToday.length === 1 ? '' : 's'} already completed
                                </div>
                            </div>
                        )}
                        {CompletedItems}
                    </TaskList>
                ) : (
                    <TaskList>
                        <div className='list-group-item d-flex justify-content-center align-items-center bg-success-subtle position-relative overflow-hidden'>
                            <AnimatedBackground />
                            <div className='fs-150 position-relative text-center' style={{ zIndex: 1 }}>
                                All tasks are completed for the day!
                                {!!completedToday?.length && (
                                    <div className='fs-140'>You have finished {completedToday?.length} tasks today!</div>
                                )}
                            </div>
                        </div>
                        {CompletedItems}
                    </TaskList>
                )}
                {!!pastDue.length && (
                    <TaskList>
                        <span className='fs-140 fw-light'>Tasks You've Missed</span>
                        {pastDue.map((t) => (
                            <div key={t.id} className='list-group-item'>
                                <TaskRow task={t} pastDue />
                            </div>
                        ))}
                    </TaskList>
                )}

                {!dueToday.length && !pastDue.length && dueTomorrow.length && (
                    <TaskList title='Tomorrow&rsquo;s Tasks'>
                        {dueTomorrow.map((t) => (
                            <div key={t.id} className='list-group-item'>
                                <TaskRow noComplete task={t} />
                            </div>
                        ))}
                    </TaskList>
                )}
            </div>
        </div>
    );
}

function TaskList({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <>
            {!!title && <span className='fs-140 text-center'>{title}</span>}
            <div className='list-group w-100'>{children}</div>
        </>
    );
}

function AnimatedBackground() {
    return (
        <div
            className='animated-background'
            style={{
                background: 'url(/star-solid.svg) 0 0 /3rem, url(/star-solid.svg) 1.5rem 1.3rem /3rem',
            }}
        ></div>
    );
}

function Message({ message, onComplete, type }: { message: string; type: string; onComplete: () => void }) {
    return (
        <div
            onAnimationEnd={(e) => {
                if (e.animationName === 'message') {
                    onComplete();
                } else {
                    alert(e.animationName);
                }
            }}
            className={`message ${type}`}
            onClick={onComplete}
        >
            <div>{message}</div>
        </div>
    );
}

export function TaskRow({
    task,
    pastDue,
    completed,
    noComplete,
}: {
    task: Task;
    pastDue?: boolean;
    completed?: boolean;
    noComplete?: boolean;
}) {
    const completeTask = useCompleteTask(task.id);

    return (
        <div className='d-flex gap-3 align-items-center justify-content-between flex-wrap'>
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
                <div className='h5 mb-0 fw-normal'>{task.description}</div>
            </div>

            <div className='d-flex gap-2 align-items-center px-3 flex-wrap'>
                {task.lastCompleted && (
                    <div style={{ paddingTop: 2, paddingBottom: 2 }} className='fs-80 rounded-pill text-success'>
                        Completed:{' '}
                        {Dates.format(task.lastCompleted, {
                            date: true,
                            summarize: true,
                        })}
                    </div>
                )}
                {task.dueDate && pastDue && (
                    <div style={{ paddingTop: 2, paddingBottom: 2 }} className='bg-danger px-3 fs-80 rounded-pill text-white'>
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

function CompleteButton({ onClick, completed: alreadyComplete }: { onClick: () => void; completed?: boolean }) {
    const [completed, setCompleted] = useState(false);

    const ButtonIcon = useCallback(() => <FontAwesomeIcon className='fs-200' icon={faCheckSquare} />, []);

    if (completed && !alreadyComplete) {
        return (
            <div
                onAnimationEnd={(e) => {
                    if (e.animationName === 'task-completed-from') {
                        setTimeout(onClick, 500);
                    }
                }}
                className='task-completed '
            >
                <div className='original'>
                    <button
                        className={`btn btn-link text-decoration-none ${
                            alreadyComplete ? 'link-success' : 'link-primary'
                        } d-flex align-items-center`}
                    >
                        <ButtonIcon />
                    </button>
                </div>
                <div className='from text-primary'>
                    <ButtonIcon />
                </div>
                <div className='to text-success'>
                    <FontAwesomeIcon className='fs-200' icon={faCalendarCheck} />
                </div>
            </div>
        );
    }

    return (
        <button
            disabled={alreadyComplete}
            className={`btn btn-link text-decoration-none ${alreadyComplete ? 'link-success' : 'link-primary'} d-flex align-items-center`}
            onClick={() => setCompleted(true)}
        >
            <ButtonIcon />
        </button>
    );
}
