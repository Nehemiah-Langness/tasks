import { useState, useCallback, useEffect } from 'react';
import { formatDate } from '../../services/formatDate';
import { PoolConfiguration, Task } from '../../types/SaveFile';
import { DateInput } from '../../components/DateInput';

export function PoolEditForm({
    save,
    poolConfiguration,
    pool: fullPool,
    tasks
}: {
    poolConfiguration: PoolConfiguration;
    save: (t: PoolConfiguration) => void;
    pool: { id: number; title: string }[];
    tasks: Task[]
}) {
    const [form, setForm] = useState(poolConfiguration);

    const changeForm = useCallback(<T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((x) => ({ ...x, [key]: value }));
    }, []);

    useEffect(() => {
        setForm(poolConfiguration);
    }, [poolConfiguration]);

    const activePool = fullPool.filter((x) => !form.disabledTasks.includes(x.id));

    const days = Math.ceil(activePool.length / (form.tasksPerDay < 1 ? 1 : form.tasksPerDay));
    const leftOverDays = days * form.tasksPerDay - activePool.length;

    return (
        <div className='d-flex flex-column h-100 gap-2'>
            <div className='flex-grow-1 overflow-hidden'>
                <div className='form d-flex flex-column h-100'>
                    <div className='form-group'>
                        <label>Beginning On</label>
                        <DateInput value={form.startDate} setValue={(v) => changeForm('startDate', v)} />
                    </div>

                    <div className='form-group'>
                        <label>Pool Cycle Length</label>
                        <div className='input-group'>
                            <span className='input-group-text'>Complete</span>
                            <input
                                type='number'
                                value={form.tasksPerDay === 0 ? '' : form.tasksPerDay}
                                onChange={(e) =>
                                    !e.target.value
                                        ? changeForm('tasksPerDay', 0)
                                        : e.target.valueAsNumber
                                        ? changeForm('tasksPerDay', e.target.valueAsNumber)
                                        : null
                                }
                                className='form-control'
                            />
                            <span className='input-group-text'>Tasks/Days</span>
                        </div>
                    </div>
                    <div className='form-group flex-grow-1 overflow-auto'>
                        <label>Task Pool</label>
                        <div className='ps-1'>
                            {fullPool.map((p) => (
                                <div className='form-check form-switch'>
                                    <input
                                        disabled={tasks.some(t=> t.poolId === p.id && !t.id.startsWith('pool-'))}
                                        checked={!form.disabledTasks.includes(p.id)}
                                        onChange={(e) =>
                                            changeForm(
                                                'disabledTasks',
                                                (form.disabledTasks.filter((x) => x !== p.id) as (number | null)[])
                                                    .concat(!e.target.checked ? p.id : null)
                                                    .filter((x) => x !== null) as number[]
                                            )
                                        }
                                        className='form-check-input'
                                        type='checkbox'
                                        role='switch'
                                        id={`checkbox-${p.id}`}
                                    />
                                    <label className='form-check-label' htmlFor={`checkbox-${p.id}`}>
                                        {p.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='form-group'>
                <label className='fs-140'>5-Minute Task Pool</label>
                <div className='d-flex flex-column gap-1 py-1'>
                    You will finish the pool of {activePool.length} tasks in {days} day{days === 1 ? '' : 's'} starting on{' '}
                    {formatDate(new Date(form.startDate), {
                        date: true,
                    })}
                    .
                    <br /> You will do {form.tasksPerDay} task{form.tasksPerDay === 1 ? '' : 's'} per day
                    {leftOverDays > 0
                        ? ` for ${days - 1} day${days - 1 === 1 ? '' : 's'}, and ${form.tasksPerDay - leftOverDays} task${
                              form.tasksPerDay - leftOverDays === 1 ? '' : 's'
                          } on the last day of the cycle`
                        : ''}
                    .
                </div>
            </div>

            <button className='btn btn-success' onClick={() => save(form)}>
                Save
            </button>
        </div>
    );
}
