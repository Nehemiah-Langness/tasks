import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { describeFilter } from "../../services/describeFilter";
import { formatDate } from "../../services/formatDate";
import { getNextPassingDate } from "../../services/getNextPassingDate";
import { Task } from "../../types/SaveFile";
import { toDay } from "../../services/toDay";

export function TaskRow({ task }: { task: Task }) {
  const nextDueDate = useMemo(() => {
    const now = toDay(new Date()).valueOf();
    let dueDate = getNextPassingDate(toDay(task.startDate), task.filters, true);
    while (dueDate && dueDate.valueOf() < now) {
      dueDate = getNextPassingDate(dueDate, task.filters);
    }
    return dueDate ? formatDate(dueDate, { date: true, day: true }) : "Never";
  }, [task.filters, task.startDate]);
  return (
    <div>
      <div className="h5 fw-normal">{task.description}</div>
      <div className="d-flex gap-2 align-items-center px-3 flex-wrap">
        <div
          style={{ paddingTop: 2, paddingBottom: 2 }}
          className="bg-secondary px-3 fs-80 rounded-pill text-dark"
        >
          <FontAwesomeIcon icon={faRepeat} /> {describeFilter(task.filters)}
        </div>
        <div
          style={{ paddingTop: 2, paddingBottom: 2 }}
          className="bg-danger px-3 fs-80 rounded-pill text-white"
        >
          Next due on {nextDueDate}
        </div>
      </div>
    </div>
  );
}
