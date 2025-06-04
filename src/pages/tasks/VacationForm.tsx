import { useState, useCallback, useEffect } from 'react';
import { Vacation } from '../../types/SaveFile';
import { DateInput } from '../../components/DateInput';

export function VacationForm({ save, vacation }: { vacation: Vacation; save: (t: Vacation | undefined) => void }) {
    const [form, setForm] = useState(vacation);
    const [enabled, setEnabled] = useState(true);

    const changeForm = useCallback(<T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((x) => ({ ...x, [key]: value }));
    }, []);

    useEffect(() => {
        setForm(vacation);
        if (vacation) {
            setEnabled(true)
        }
    }, [vacation]);

    return (
        <div className='d-flex flex-column h-100 gap-2'>
            <div className='flex-grow-1 overflow-hidden'>
                <div className='form d-flex flex-column h-100'>
                    <div className='form-group px-1'>
                        <div className='form-check form-switch'>
                            <input
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                className='form-check-input'
                                type='checkbox'
                                role='switch'
                                id={`checkbox-vacation`}
                            />
                            <label className='form-check-label' htmlFor={`checkbox-vacation`}>
                                Schedule Vacation
                            </label>
                        </div>
                    </div>
                    {enabled && (
                        <>
                            <div className='form-group'>
                                <label>Beginning On</label>
                                <DateInput value={form.start} setValue={(v) => changeForm('start', v)} />
                            </div>
                            <div className='form-group'>
                                <label>Ending On</label>
                                <DateInput value={form.end} setValue={(v) => changeForm('end', v)} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <button className='btn btn-success' onClick={() => save(enabled ? form : undefined)}>
                Save
            </button>
        </div>
    );
}
