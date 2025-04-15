import { useState, useCallback, useEffect, useMemo } from 'react';
import { formatDate } from '../../services/formatDate';
import { RecurrenceType, Task } from '../../types/SaveFile';
import { getRecurrenceMode } from '../../services/getRecurrenceMode';
import { Radio } from '../../components/Radio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { Dates, Tasks } from '../../services/dates';
import { DateInput } from '../../components/DateInput';

export function TaskEditForm({ save, task }: { task: Task; save: (t: Task) => void }) {
    const [form, setForm] = useState(task);
    const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceType>(RecurrenceType.Daily);

    const [dayOfWeek, setDayOfWeek] = useState(Dates.today().getUTCDay());
    const [dayOfMonth, setDayOfMonth] = useState(Dates.today().getUTCDate());
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
                setDayOfWeek(task.filters.day?.[0] ?? 0);
                setWeekInterval(task.filters.interval?.length ?? 1);
            } else if (mode === RecurrenceType.MonthDay) {
                setDayOfMonth(task.filters?.date?.[0] ?? 1);
                setMonthInterval(task.filters.interval?.length ?? 1);
            } else if (mode === RecurrenceType.IntervalDay) {
                setDayInterval(task.filters.interval?.length ?? 1);
            }
        }
    }, [task]);

    const stageStartDate = useMemo(
        () =>
            recurrenceMode === RecurrenceType.MonthDay
                ? Tasks.nextDueDate(form.startDate, {
                      date: [dayOfMonth],
                  })?.valueOf() ?? 0
                : recurrenceMode === RecurrenceType.WeekDay
                ? Tasks.nextDueDate(form.startDate, {
                      day: [dayOfWeek],
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
                          date: [dayOfMonth],
                          interval: {
                              length: monthInterval,
                              step: 'month',
                          },
                      }
                    : recurrenceMode === RecurrenceType.WeekDay
                    ? {
                          type: recurrenceMode,
                          day: [dayOfWeek],
                          interval: {
                              length: weekInterval,
                              step: 'week',
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

        console.log(new Date(task.startDate), new Date(task.dueDate), task.lastCompleted ? new Date(task.lastCompleted) : null);

        return newTask;
    }, [dayInterval, dayOfMonth, dayOfWeek, form.description, monthInterval, recurrenceMode, stageStartDate, task, weekInterval]);

    return (
        <div className='d-flex flex-column h-100 gap-2'>
            <div className='flex-grow-1'>
                <div className='form'>
                    <div className='form-group'>
                        <label>Task</label>
                        <input
                            type='text'
                            value={form.description}
                            onChange={(e) => changeForm('description', e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Recurrence</label>
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.Daily}
                            label='Daily'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.IntervalDay}
                            label='Every X Days'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.WeekDay}
                            label='Specific Weekday'
                        />
                        <Radio
                            formValue={recurrenceMode}
                            onChange={(e) => setRecurrenceMode(e)}
                            value={RecurrenceType.MonthDay}
                            label='Specific Day of the Month'
                        />
                    </div>
                    {recurrenceMode === RecurrenceType.WeekDay ? (
                        <>
                            <div className='form-group'>
                                <label>Beginning On</label>
                                <DateInput value={form.startDate} setValue={(v) => changeForm('startDate', v)} />
                            </div>
                            <div className='form-group'>
                                <label>Weekday</label>
                                <select
                                    className='form-control'
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(isNaN(+e.target.value) ? 0 : +e.target.value)}
                                >
                                    <option value={0}>Sunday</option>
                                    <option value={1}>Monday</option>
                                    <option value={2}>Tuesday</option>
                                    <option value={3}>Wednesday</option>
                                    <option value={4}>Thursday</option>
                                    <option value={5}>Friday</option>
                                    <option value={6}>Saturday</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Week Interval</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>Every</span>
                                    <input
                                        type='number'
                                        value={weekInterval}
                                        onChange={(e) => setWeekInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                        className='form-control'
                                    />
                                    <span className='input-group-text'>Weeks</span>
                                </div>
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.Daily ? (
                        <>
                            <div className='form-group'>
                                <label>Beginning On</label>
                                <DateInput value={form.startDate} setValue={(v) => changeForm('startDate', v)} />
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.IntervalDay ? (
                        <>
                            <div className='form-group'>
                                <label>Beginning On</label>
                                <DateInput value={form.startDate} setValue={(v) => changeForm('startDate', v)} />
                            </div>
                            <div className='form-group'>
                                <label>Day Interval</label>
                                <div className='input-group'>
                                    <span className='input-group-text'>Every</span>
                                    <input
                                        type='number'
                                        value={dayInterval}
                                        onChange={(e) => setDayInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                        className='form-control'
                                    />
                                    <span className='input-group-text'>Days</span>
                                </div>
                            </div>
                        </>
                    ) : recurrenceMode === RecurrenceType.MonthDay ? (
                        <>
                            <div className='form-group'>
                                <label>Beginning On</label>
                                <DateInput value={form.startDate} setValue={(v) => changeForm('startDate', v)} />
                            </div>
                            <div className='form-group'>
                                <label>Day of Month</label>
                                <input
                                    type='number'
                                    value={dayOfMonth}
                                    onChange={(e) => setDayOfMonth(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                    className='form-control'
                                />
                            </div>
                            <label>Month Interval</label>
                            <div className='input-group'>
                                <span className='input-group-text'>Every</span>
                                <input
                                    type='number'
                                    value={monthInterval}
                                    onChange={(e) => setMonthInterval(isNaN(+e.target.value) ? 1 : +e.target.value)}
                                    className='form-control'
                                />
                                <span className='input-group-text'>Months</span>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            <div className='form-group'>
                <label className='fs-140'>Upcoming Schedule</label>
                <div className='d-flex flex-column gap-1 py-1'>
                    {(new Array(4).fill(null as Date | null) as (Date | null)[])
                        .reduce(
                            (c) => {
                                const lastDate = c[c.length - 1];
                                if (!lastDate) {
                                    return c;
                                }
                                return c.concat(Tasks.nextDueDate(lastDate, stagedTask.filters, Dates.increment(lastDate, 1, 'day')));
                            },
                            [stagedTask.startDate ? new Date(stagedTask.startDate) : Tasks.nextDueDate(Dates.today(), stagedTask.filters)]
                        )
                        .map((x, i) =>
                            x ? (
                                <>
                                    <div key={x.valueOf()} className='d-flex align-items-center gap-2 px-2'>
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        <span>
                                            {formatDate(x, {
                                                date: true,
                                                day: true,
                                            })}
                                        </span>
                                        <div></div>
                                    </div>
                                    {i < 4 && <div key={'div' + x.valueOf()} className='border-bottom'></div>}
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
