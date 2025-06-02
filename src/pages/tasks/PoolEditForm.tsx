import { useState, useCallback, useEffect } from 'react';
import { formatDate } from '../../services/formatDate';
import { PoolConfiguration } from '../../types/SaveFile';
import { DateInput } from '../../components/DateInput';

export function PoolEditForm({
    save,
    poolConfiguration,
    pool,
}: {
    poolConfiguration: PoolConfiguration;
    save: (t: PoolConfiguration) => void;
    pool: { id: number; title: string }[];
}) {
    const [form, setForm] = useState(poolConfiguration);

    const changeForm = useCallback(<T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((x) => ({ ...x, [key]: value }));
    }, []);

    useEffect(() => {
        setForm(poolConfiguration);
    }, [poolConfiguration]);

    const days = Math.ceil(pool.length / (form.tasksPerDay < 1 ? 1 : form.tasksPerDay));
    const leftOverDays = days * form.tasksPerDay - pool.length;

    return (
        <div className='d-flex flex-column h-100 gap-2'>
            <div className='flex-grow-1'>
                <div className='form'>
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
                </div>
            </div>
            <div className='form-group'>
                <label className='fs-140'>5-Minute Task Pool</label>
                <div className='d-flex flex-column gap-1 py-1'>
                    You will finish the pool of {pool.length} tasks in {days} day{days === 1 ? '' : 's'} starting on{' '}
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
