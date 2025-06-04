import { useMemo } from 'react';
import { formatDate } from '../../services/formatDate';
import { useTasks } from '../../contexts/tasks/useTasks';
import { Dates } from '../../services/dates';
import { TaskList } from './TaskList';
import { AnimatedBackground } from './AnimatedBackground';
import { TaskRow } from './TaskRow';
import { useVacation } from './useVacation';
import { translateMonth } from '../../services/translateMonth';

export function Today() {
    const now = Dates.today().valueOf();
    const tomorrow = Dates.increment(now, 1, 'day').valueOf();
    const tasks = useTasks();

    const { onVacation } = useVacation();

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
        <div className='d-flex flex-column gap-4'>
            <div
                className={`d-flex gap-3 justify-content-center align-items-stretch pb-3 ${onVacation ? 'text-dark' : 'text-white'} shadow`}
                style={{
                    background: onVacation
                        ? 'linear-gradient(180deg, var(--bs-info-bg-subtle) 30%, #a3d1cc)'
                        : 'linear-gradient(180deg, var(--bs-primary) 30%, #2161b0)',
                    borderRadius: '0 0 1rem 1rem',
                }}
            >
                <div style={{ fontSize: '5rem', lineHeight: 1 }}>{new Date(now).getDate()}</div>
                <div className='d-flex flex-column align-items-center justify-content-evenly' style={{ lineHeight: 1 }}>
                    <div className='fs-150 fw-normal'>
                        {formatDate(now, {
                            day: true,
                        })}
                    </div>
                    <div className='fs-150'>
                        {translateMonth(new Date(now).getMonth())}, {new Date(now).getFullYear()}
                    </div>
                </div>
            </div>
            <div className='container'>
                {!tasks ? (
                    <TaskList>
                        {new Array(5).fill(0).map((_x, i) => (
                            <div
                                key={i}
                                style={{
                                    animationDelay: `0.${i}s`,
                                }}
                                className='list-group-item skeleton fs-200 border-0 my-1 rounded'
                            >
                                &nbsp;
                            </div>
                        ))}
                    </TaskList>
                ) : dueToday.length || pastDue.length ? (
                    <TaskList>
                        <div className='list-group-item text-center py-3 bg-primary-subtle border-0 position-relative overflow-hidden'>
                            <AnimatedBackground icon='soap-solid' />
                            <div className='position-relative h5 mb-0 fw-normal' style={{ zIndex: 1 }}>
                                You have <b>{dueToday.length + pastDue.length}</b> task
                                {dueToday.length + pastDue.length === 1 ? '' : 's'} to do today
                            </div>
                        </div>

                        {pastDue.map((t) => (
                            <div key={t.id} className='list-group-item'>
                                <TaskRow task={t} pastDue />
                            </div>
                        ))}
                        {DueItems}
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
    );
}
