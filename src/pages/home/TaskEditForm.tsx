import { useState, useCallback, useEffect, useMemo } from "react";
import { formatDate } from "../../services/formatDate";
import { getNextPassingDate } from "../../services/getNextPassingDate";
import { Task } from "../../types/SaveFile";
import { getRecurrenceMode } from "../../services/getRecurrenceMode";
import { Radio } from "../../components/Radio";

export function TaskEditForm({
  save,
  task,
}: {
  task: Task;
  save: (t: Task) => void;
}) {
  const [form, setForm] = useState(task);
  const [recurrenceMode, setRecurrenceMode] = useState<
    "dayOfWeek" | "dayOfMonth" | "everyDayInterval"
  >("dayOfWeek");

  const [dayOfWeek, setDayOfWeek] = useState(new Date().getDay());
  const [dayOfMonth, setDayOfMonth] = useState(new Date().getDate());
  const [monthInterval, setMonthInterval] = useState(1);
  const [weekInterval, setWeekInterval] = useState(1);
  const [dayInterval, setDayInterval] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString());

  const changeForm = useCallback(
    <T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
      setForm((x) => ({ ...x, [key]: value }));
    },
    []
  );

  useEffect(() => {
    setForm(task);
    const mode = getRecurrenceMode(task.filters);
    if (mode) {
      setRecurrenceMode(mode);
      if (mode === "dayOfWeek") {
        setDayOfWeek(task.filters.day?.[0] ?? 0);
        setWeekInterval(task.filters.interval?.length ?? 1);
      } else if (mode === "dayOfMonth") {
        setRecurrenceMode("dayOfMonth");
        setDayOfMonth(task.filters?.date?.[0] ?? 1);
        setMonthInterval(task.filters.interval?.length ?? 1);
      } else if (mode === "everyDayInterval") {
        setDayInterval(task.filters.interval?.length ?? 1);
        setStartDate(
          new Date(task.filters.interval?.startDate ?? Date.now()).toISOString()
        );
      }
    }
  }, [task]);

  const stagedTask = useMemo(() => {
    const newTask: Task = {
      id: task.id,
      description: form.description,
      filters:
        recurrenceMode === "dayOfMonth"
          ? {
              date: [dayOfMonth],
              interval: {
                length: monthInterval,
                startDate:
                  getNextPassingDate(
                    new Date(),
                    {
                      date: [dayOfMonth],
                    },
                    true
                  )?.valueOf() ?? 0,
                step: "month",
              },
            }
          : recurrenceMode === "dayOfWeek"
          ? {
              day: [dayOfWeek],
              interval: {
                length: weekInterval,
                startDate:
                  getNextPassingDate(
                    new Date(),
                    {
                      day: [dayOfWeek],
                    },
                    true
                  )?.valueOf() ?? 0,
                step: "week",
              },
            }
          : recurrenceMode === "everyDayInterval"
          ? {
              interval: {
                length: dayInterval,
                startDate: new Date(startDate).valueOf(),
                step: "day",
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
    startDate,
    task.id,
    weekInterval,
  ]);

  return (
    <div className="d-flex flex-column h-100 gap-2">
      <div className="flex-grow-1">
        <div className="form">
          <div className="form-group">
            <label>Task</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => changeForm("description", e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Recurrence</label>
            <Radio
              formValue={recurrenceMode}
              onChange={(e) => setRecurrenceMode(e as typeof recurrenceMode)}
              value="dayOfWeek"
              label="Specific Weekday"
            />
            <Radio
              formValue={recurrenceMode}
              onChange={(e) => setRecurrenceMode(e as typeof recurrenceMode)}
              value="dayOfMonth"
              label="Specific Day of the Month"
            />
            <Radio
              formValue={recurrenceMode}
              onChange={(e) => setRecurrenceMode(e as typeof recurrenceMode)}
              value="everyDayInterval"
              label="Daily Interval"
            />
          </div>
          {recurrenceMode === "dayOfWeek" ? (
            <>
              <div className="form-group">
                <label>Weekday</label>
                <select
                  className="form-control"
                  value={dayOfWeek}
                  onChange={(e) =>
                    setDayOfWeek(isNaN(+e.target.value) ? 0 : +e.target.value)
                  }
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
              <div className="form-group">
                <label>Week Interval</label>
                <div className="input-group">
                  <span className="input-group-text">Every</span>
                  <input
                    type="number"
                    value={weekInterval}
                    onChange={(e) =>
                      setWeekInterval(
                        isNaN(+e.target.value) ? 1 : +e.target.value
                      )
                    }
                    className="form-control"
                  />
                  <span className="input-group-text">Weeks</span>
                </div>
              </div>
            </>
          ) : recurrenceMode === "everyDayInterval" ? (
            <>
              <div className="form-group">
                <label>Day Interval</label>
                <div className="input-group">
                  <span className="input-group-text">Every</span>
                  <input
                    type="number"
                    value={dayInterval}
                    onChange={(e) =>
                      setDayInterval(
                        isNaN(+e.target.value) ? 1 : +e.target.value
                      )
                    }
                    className="form-control"
                  />
                  <span className="input-group-text">Days</span>
                </div>
              </div>
              <div className="form-group">
                <label>Beginning On</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </>
          ) : recurrenceMode === "dayOfMonth" ? (
            <>
              <div className="form-group">
                <div className="form-group">
                  <label>Day of Month</label>
                  <input
                    type="number"
                    value={dayOfMonth}
                    onChange={(e) =>
                      setDayOfMonth(
                        isNaN(+e.target.value) ? 1 : +e.target.value
                      )
                    }
                    className="form-control"
                  />
                </div>
                <label>Month Interval</label>
                <div className="input-group">
                  <span className="input-group-text">Every</span>
                  <input
                    type="number"
                    value={monthInterval}
                    onChange={(e) =>
                      setMonthInterval(
                        isNaN(+e.target.value) ? 1 : +e.target.value
                      )
                    }
                    className="form-control"
                  />
                  <span className="input-group-text">Months</span>
                </div>
              </div>
            </>
          ) : null}

          <div className="form-group">
            <label>Preview</label>
            {(new Array(5).fill(null as Date | null) as (Date | null)[])
              .reduce(
                (c) => {
                  const lastDate = c[c.length - 1];
                  if (!lastDate) {
                    return c;
                  }
                  return c.concat(
                    getNextPassingDate(lastDate, stagedTask.filters)
                  );
                },
                [
                  stagedTask.filters.interval?.startDate
                    ? new Date(stagedTask.filters.interval?.startDate)
                    : getNextPassingDate(new Date(), stagedTask.filters),
                ]
              )
              .map((x) =>
                x ? (
                  <div>
                    {formatDate(x, {
                      date: true,
                      day: true,
                    })}
                  </div>
                ) : null
              )}
          </div>
        </div>
      </div>
      <button className="btn btn-success" onClick={() => save(stagedTask)}>
        Save
      </button>
    </div>
  );
}
