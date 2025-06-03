import { useMemo } from 'react';
import { formatDate } from '../../services/formatDate';
import { useTasks } from '../../contexts/tasks/useTasks';
import { Dates } from '../../services/dates';
import { TaskList } from './TaskList';
import { AnimatedBackground } from './AnimatedBackground';
import { TaskRow } from './TaskRow';

export function Today() {
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
        <div className='d-flex flex-column gap-3 mt-5'>
            <div className='d-flex gap-2 justify-content-center align-items-center'>
                <div className='d-flex flex-column align-items-center'>
                    <div className='fs-200 fw-normal'>
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
                    {/* {!!completedToday?.length && (
                        <div className='list-group-item text-center py-3 bg-success-subtle position-relative overflow-hidden'>
                            <AnimatedBackground />
                            <div className='position-relative h5 mb-0 fw-normal' style={{ zIndex: 1 }}>
                                <b>{completedToday.length}</b> task
                                {completedToday.length === 1 ? '' : 's'} already completed
                            </div>
                        </div>
                    )} */}
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
    );
}
