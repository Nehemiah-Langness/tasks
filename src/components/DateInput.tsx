import { useState, useEffect, useMemo } from 'react';
import { Dates } from '../services/dates';

const convertDateToString = (d: Date) => d.toISOString().split('T')[0];

export function DateInput({ setValue, value }: { value: number; setValue: (date: number) => void; }) {
    const [date, setDate] = useState(convertDateToString(new Date(value)));
    useEffect(() => {
        setDate(convertDateToString(new Date(value)));
    }, [value]);

    const parsedDate = useMemo(() => {
        if (!date) return Dates.today().valueOf();
        return Dates.date(new Date(date)).valueOf();
    }, [date]);

    useEffect(() => {
        const current = Dates.date(value).valueOf();
        if (current !== parsedDate) {
            setValue(parsedDate);
        }
    }, [parsedDate, setValue, value]);

    return <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className='form-control' />;
}
