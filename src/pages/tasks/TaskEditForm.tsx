import { useState, useCallback, useEffect, useMemo, CSSProperties } from 'react';
import { formatDate } from '../../services/formatDate';
import { RecurrenceType, Task } from '../../types/SaveFile';
import { getRecurrenceMode } from '../../services/getRecurrenceMode';
import { Radio } from '../../components/Radio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faSquare } from '@fortawesome/free-regular-svg-icons';
import { Dates, Tasks } from '../../services/dates';
import { DateInput } from '../../components/DateInput';
import { useStorage } from '../../contexts/storage/useStorage';
import { translateDayOfWeek } from '../../services/translateDayOfWeek';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';

export function TaskEditForm({ save, task }: { task: Task; save: (t: Task) => void }) {
    const { allTasksInPool } = useStorage();
    const [form, setForm] = useState(task);
    const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceType>(RecurrenceType.Daily);

    const [dayOfWeek, setDayOfWeek] = useState([Dates.today().getUTCDay()]);
    const [dayOfMonth, setDayOfMonth] = useState([Dates.today().getUTCDate()]);
    const [yearInterval, setYearInterval] = useState(1);
    const [monthInterval, setMonthInterval] = useState(1);
    const [weekInterval, setWeekInterval] = useState(1);
    const [dayInterval, setDayInterval] = useState(1);

    const changeForm = useCallback(<T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((x) => ({ ...x, [key]: value }));
    }, []);

    useEffect(() => {
        setForm(task);
        const mode = getRecurrenceMode(task.filters);
        if (mode !== null) {
            setRecurrenceMode(mode);
            if (mode === RecurrenceType.WeekDay) {
                setDayOfWeek(task.filters.day ?? [0]);
            } else if (mode === RecurrenceType.MonthDay) {
                setDayOfMonth(task.filters?.date ?? [1]);
                setMonthInterval(task.filters.interval?.length ?? 1);
            } else if (mode === RecurrenceType.IntervalDay) {
                setDayInterval(task.filters.interval?.length ?? 1);
            } else if (mode === RecurrenceType.IntervalWeek) {
                setWeekInterval(task.filters.interval?.length ?? 1);
            } else if (mode === RecurrenceType.IntervalMonth) {
                setMonthInterval(task.filters.interval?.length ?? 1);
            } else if (mode === RecurrenceType.IntervalYear) {
                setYearInterval(task.filters.interval?.length ?? 1);
            }
        }
    }, [task]);

    const stageStartDate = useMemo(
        () =>
            recurrenceMode === RecurrenceType.MonthDay
                ? Tasks.nextDueDate(form.startDate, {
                      date: dayOfMonth,
                  })?.valueOf() ?? 0
                : recurrenceMode === RecurrenceType.WeekDay
                ? Tasks.nextDueDate(form.startDate, {
                      day: dayOfWeek,
                  })?.valueOf() ?? 0
                : form.startDate,
        [dayOfMonth, dayOfWeek, form.startDate, recurrenceMode]
    );

    const stagedTask = useMemo(() => {
        const newTask: Task = {
            ...task,
            description: form.description,
            startDate: stageStartDate,
            filters:
                recurrenceMode === RecurrenceType.MonthDay
                    ? {
                          type: recurrenceMode,
                          date: dayOfMonth,
                          interval: {
                              length: 1,
                              step: 'day',
                          },
                      }
                    : recurrenceMode === RecurrenceType.WeekDay
                    ? {
                          type: recurrenceMode,
                          day: dayOfWeek,
                          interval: {
                              length: 1,
                              step: 'day',
                          },
                      }
                    : recurrenceMode === RecurrenceType.IntervalDay
                    ? {
                          type: recurrenceMode,
                          interval: {
                              length: dayInterval,
                              step: 'day',
                          },
                      }
                    : recurrenceMode === RecurrenceType.IntervalWeek
                    ? {
                          type: recurrenceMode,
                          interval: {
                              length: weekInterval,
                              step: 'week',
                          },
                      }
                    : recurrenceMode === RecurrenceType.IntervalMonth
                    ? {
                          type: recurrenceMode,
                          interval: {
                              length: monthInterval,
                              step: 'month',
                          },
                      }
                    : recurrenceMode === RecurrenceType.IntervalYear
                    ? {
                          type: recurrenceMode,
                          interval: {
                              length: yearInterval,
                              step: 'year',
                          },
                      }
                    : recurrenceMode === RecurrenceType.Daily
                    ? {
                          type: recurrenceMode,
                          interval: {
                              length: 1,
                              step: 'day',
                          },
                      }
                    : {},
        };

        return newTask;
    }, [
        dayInterval,
        dayOfMonth,
        dayOfWeek,
        form.description,
        monthInterval,
        recurrenceMode,
        stageStartDate,
        task,
        weekInterval,
        yearInterval,
    ]);

    return (
        <div className='d-flex flex-column h-100 gap-2'>
            <div className='flex-grow-1'>
                <div className='form'>
                    {task.poolId ? (
                        <div className='form-group text-info fs-80'>
                            <span className='fw-bold'>Customizing Pool Task:</span>{' '}
                            {allTasksInPool.find((x) => x.id === task.poolId)?.title}
                        </div>
                    ) : null}
                    <div className='form-group'>
                        <label>What is your task?</label>
                        <input
                            type='text'
                            value={form.description}
                            onChange={(e) => changeForm('description', e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='form-group'>
                        <label>When does it need done?</label>
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.Daily}
                            label='Every day'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.IntervalDay}
                            label='Once every few days'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.WeekDay}
                            label='On specific weekdays'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.IntervalWeek}
                            label='Once every few weeks'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.IntervalMonth}
                            label='Once every few months'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.MonthDay}
                            label='On specific days of the month'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.IntervalYear}
                            label='Once every few years'
                        />
                    </div>
                    <div className='form-group'>
                        <label>When do you want to start?</label>
                        <DateInput value={form.startDate} setValue={(v) => changeForm('startDate', v)} />
                    </div>
                    {recurrenceMode === RecurrenceType.WeekDay ? (
                        <>
                            <div className='form-group'>
                                <label>What weekdays do you want to do your task?</label>
                                {new Array(7)
                                    .fill(0)
                                    .map((_x, i) => i)
                                    .map((day) => (
                                        <div key={day} className='form-check form-switch'>
                                            <input
                                                checked={dayOfWeek.includes(day)}
                                                onChange={(e) =>
                                                    setDayOfWeek(
                                                        (p) =>
                                                            (p.filter((x) => x !== day) as (number | null)[])
                                                                .concat(e.target.checked ? day : null)
                                                                .filter((x) => x !== null) as number[]
                                                    )
                                                }
                                                className='form-check-input'
                                                type='checkbox'
                                                role='switch'
                                                id={`checkbox-${day}`}
                                            />
                                            <label className='form-check-label' htmlFor={`checkbox-${day}`}>
                                                {translateDayOfWeek(day)}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.Daily ? (
                        <></>
                    ) : recurrenceMode === RecurrenceType.IntervalDay ? (
                        <>
                            <div className='form-group'>
                                <label>How many days between?</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>Every</span>
                                    <input
                                        type='number'
                                        value={dayInterval}
                                        onChange={(e) => setDayInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                        className='form-control'
                                    />
                                    <span className='input-group-text'>Day{dayInterval === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.IntervalWeek ? (
                        <>
                            <div className='form-group'>
                                <label>How many weeks between?</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>Every</span>
                                    <input
                                        type='number'
                                        value={weekInterval}
                                        onChange={(e) => setWeekInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                        className='form-control'
                                    />
                                    <span className='input-group-text'>Week{weekInterval === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.IntervalMonth ? (
                        <>
                            <div className='form-group'>
                                <label>How many months between?</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>Every</span>
                                    <input
                                        type='number'
                                        value={monthInterval}
                                        onChange={(e) => setMonthInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                        className='form-control'
                                    />
                                    <span className='input-group-text'>Month{monthInterval === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.IntervalYear ? (
                        <>
                            <div className='form-group'>
                                <label>How many years between?</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>Every</span>
                                    <input
                                        type='number'
                                        value={yearInterval}
                                        onChange={(e) => setYearInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                        className='form-control'
                                    />
                                    <span className='input-group-text'>Year{yearInterval === 1 ? '' : 's'}</span>
                                </div>
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.MonthDay ? (
                        <>
                            <div className='form-group'>
                                <label>What days of the month?</label>
                                <div className='dropdown d-flex flex-column'>
                                    <button
                                        className='btn d-flex justify-content-between align-items-center dropdown-toggle'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                        style={
                                            {
                                                '--bs-btn-bg': '#ebf2f9',
                                                '--bs-btn-hover-bg': '#ebf2f9',
                                                '--bs-btn-active-bg': '#ebf2f9',
                                                '--bs-btn-focus-bg': '#ebf2f9',
                                                '--bs-btn-border-color': '#ebf2f9',
                                                '--bs-btn-hover-border-color': '#ebf2f9',
                                                '--bs-btn-focus-border-color': '#ebf2f9',
                                                '--bs-btn-active-border-color': '#ebf2f9',
                                            } as CSSProperties
                                        }
                                    >
                                        {dayOfMonth.sort().map(mapDayOfMonth).join(', ') || <>Select a day of the month</>}
                                    </button>

                                    <ul className='dropdown-menu' style={{ maxHeight: '10rem', overflowY: 'auto' }}>
                                        {new Array(31)
                                            .fill(0)
                                            .map((_x, i) => i + 1)
                                            .map((day) => (
                                                <li key={day}>
                                                    <div
                                                        className='dropdown-item'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDayOfMonth((p) =>
                                                                p.includes(day) ? p.filter((x) => x !== day) : p.concat(day)
                                                            );
                                                        }}
                                                    >
                                                        <div className='d-flex align-items-center gap-2'>
                                                            <FontAwesomeIcon
                                                                className='fs-120'
                                                                icon={dayOfMonth.includes(day) ? faSquareCheck : faSquare}
                                                            />
                                                            {mapDayOfMonth(day)}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            <div className='form-group'>
                <button
                    className='btn btn-light text-reset w-100 rounded-0 dropdown-toggle d-flex align-items-center justify-content-between'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#schedule-preview'
                    aria-expanded='false'
                    aria-controls='schedule-preview'
                    style={{'--toggle-size': '0.5rem'} as CSSProperties}
                >
                    <label className='fs-140'>Schedule Preview</label>
                </button>
                
                <div id='schedule-preview' className='collapse list-group list-group-flush'>
                    {(new Array(10).fill(null as Date | null) as (Date | null)[])
                        .reduce(
                            (c) => {
                                const lastDate = c[c.length - 1];
                                if (!lastDate) {
                                    return c;
                                }

                                const nextDueDate = Tasks.nextDueDate(lastDate, stagedTask.filters, Dates.increment(lastDate, 1, 'day'));
                                console.log(nextDueDate);
                                return c.concat(nextDueDate);
                            },
                            [stagedTask.startDate ? new Date(stagedTask.startDate) : Tasks.nextDueDate(Dates.today(), stagedTask.filters)]
                        )
                        .map((x) =>
                            x ? (
                                <>
                                    <div key={x.valueOf()} className='list-group-item d-flex gap-2 align-items-center'>
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        <span>
                                            {formatDate(x, {
                                                date: true,
                                                day: true,
                                            })}
                                        </span>
                                        <div></div>
                                    </div>
                                </>
                            ) : null
                        )}
                </div>
            </div>
            <button className='btn btn-success' onClick={() => save(stagedTask)}>
                Save
            </button>
        </div>
    );
}

function mapDayOfMonth(day: number) {
    return day === 31
        ? 'Last day of the month'
        : day % 10 === 1 && day !== 11
        ? day + 'st'
        : day % 10 === 2 && day !== 12
        ? day + 'nd'
        : day % 10 === 3 && day !== 13
        ? day + 'rd'
        : day + 'th';
}
