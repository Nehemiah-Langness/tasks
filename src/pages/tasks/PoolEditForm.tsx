import { useState, useCallback, useEffect } from 'react';
import { formatDate } from '../../services/formatDate';
import { PoolConfiguration } from '../../types/SaveFile';
import { DateInput } from '../../components/DateInput';

export function PoolEditForm({ save, poolConfiguration }: { poolConfiguration: PoolConfiguration; save: (t: PoolConfiguration) => void }) {
    const [form, setForm] = useState(poolConfiguration);

    const changeForm = useCallback(<T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((x) => ({ ...x, [key]: value }));
    }, []);

    useEffect(() => {
        setForm(poolConfiguration);
    }, [poolConfiguration]);

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
                            <span className='input-group-text'>Complete Every</span>
                            <input
                                type='number'
                                value={form.cycleSize}
                                onChange={(e) => (e.target.valueAsNumber ? changeForm('cycleSize', e.target.valueAsNumber) : null)}
                                className='form-control'
                            />
                            <span className='input-group-text'>Days</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='form-group'>
                <label className='fs-140'>Upcoming Schedule</label>
                <div className='d-flex flex-column gap-1 py-1'>
                    Finish pool in {form.cycleSize} day{form.cycleSize === 1 ? '' : 's'} starting on{' '}
                    {formatDate(new Date(form.startDate), {
                        date: true,
                    })}
                </div>
            </div>
            <button className='btn btn-success' onClick={() => save(form)}>
                Save
            </button>
        </div>
    );
}
