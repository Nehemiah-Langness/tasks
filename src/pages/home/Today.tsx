import { useMemo } from 'react';
import { formatDate } from '../../services/formatDate';
import { useTasks } from '../../contexts/tasks/useTasks';
import { Dates } from '../../services/dates';
import { TaskList } from './TaskList';
import { AnimatedBackground } from './AnimatedBackground';
import { TaskRow } from './TaskRow';
import { useStorage } from '../../contexts/storage/useStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

export function Today() {
    const { data } = useStorage();
    const now = Dates.today().valueOf();
    const tomorrow = Dates.increment(now, 1, 'day').valueOf();
    const tasks = useTasks();

    const pastDue = useMemo(() => tasks?.filter((x) => !x.dueDate || x.dueDate < now) ?? [], [now, tasks]);
    const dueToday = useMemo(() => tasks?.filter((x) => x.dueDate && x.dueDate === now) ?? [], [now, tasks]);
    const dueTomorrow = useMemo(() => tasks?.filter((x) => x.dueDate && x.dueDate === tomorrow) ?? [], [tomorrow, tasks]);
    const completedToday = useMemo(() => tasks?.filter((x) => x.lastCompleted && x.lastCompleted >= now), [now, tasks]);

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
        <>
            {!!data?.streak.days && (
                <div className='streak'>
                    <div className='position-absolute'>
                        <FontAwesomeIcon icon={faFire} />
                    </div>
                    <span className='position-relative'>You are on a {data.streak.days} day streak!</span>
                </div>
            )}
            <div>
                <div className='d-flex flex-column gap-3'>
                    <div className='d-flex gap-2 justify-content-center align-items-center'>
                        <div className='d-flex flex-column align-items-center'>
                            <div className='fs-200'>
                                {formatDate(now, {
                                    day: true,
                                })}
                            </div>
                            <div className='fs-140'>
                                {formatDate(now, {
                                    date: true,
                                })}
                            </div>
                        </div>
                    </div>
                    {dueToday.length || pastDue.length ? (
                        <TaskList>
                            {pastDue.map((t) => (
                                <div key={t.id} className='list-group-item'>
                                    <TaskRow task={t} pastDue />
                                </div>
                            ))}
                            {DueItems}
                            {!!completedToday?.length && (
                                <div className='list-group-item text-center py-3 bg-success-subtle position-relative overflow-hidden'>
                                    <AnimatedBackground />
                                    <div className='position-relative h5 mb-0 fw-normal' style={{ zIndex: 1 }}>
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
                            <div className='list-group-item d-flex justify-content-center align-items-center bg-secondary-subtle position-relative overflow-hidden'>
                                <div className='fs-150 position-relative text-center' style={{ zIndex: 1 }}>
                                    {!!completedToday?.length && (
                                        <div className='fs-140'>You have {dueTomorrow?.length} tasks coming up tomorrow</div>
                                    )}
                                </div>
                            </div>
                            {dueTomorrow.map((t) => (
                                <div key={t.id} className='list-group-item'>
                                    <TaskRow noComplete task={t} />
                                </div>
                            ))}
                        </TaskList>
                    )}
                </div>
            </div>
        </>
    );
}
