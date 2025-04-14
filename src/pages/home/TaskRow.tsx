import { faRepeat, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { describeFilter } from "../../services/describeFilter";
import { formatDate } from "../../services/formatDate";
import { getNextPassingDate } from "../../services/getNextPassingDate";
import { Task } from "../../types/SaveFile";
import { toDay } from "../../services/toDay";
import { useEditTasks } from "../../contexts/edit-tasks/useEditTasks";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useDeleteTask } from "./useDeleteTask";

export function TaskRow({ task, dueDate }: { task: Task; dueDate?: number }) {
  const { load } = useEditTasks();
  const deleteTask = useDeleteTask(task.id);

  const nextDueDate = useMemo(() => {
    const now = toDay(new Date()).valueOf();
    let nextDueDate = dueDate
      ? new Date(dueDate)
      : getNextPassingDate(toDay(task.startDate), task.filters, true);
    while (nextDueDate && nextDueDate.valueOf() < now) {
      nextDueDate = getNextPassingDate(nextDueDate, task.filters);
    }
    return nextDueDate
      ? formatDate(nextDueDate, { date: true, day: true })
      : "Never";
  }, [dueDate, task.filters, task.startDate]);
  return (
    <div>
      <div className="h5 fw-normal d-flex align-items-center">
        <button
          disabled={task.id.startsWith("pool-")}
          className="btn btn-link"
          type="button"
          onClick={() => load(task)}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>

        {task.description}
        <button
          disabled={task.id.startsWith("pool-")}
          className="btn btn-link link-danger"
          type="button"
          onClick={deleteTask}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="d-flex gap-2 align-items-center px-3 flex-wrap">
        <div
          style={{ paddingTop: 2, paddingBottom: 2 }}
          className="bg-secondary px-3 fs-80 rounded-pill text-dark"
        >
          <FontAwesomeIcon icon={faRepeat} /> {describeFilter(task.filters)}
        </div>
        {task.lastCompleted && <div
          style={{ paddingTop: 2, paddingBottom: 2 }}
          className="bg-success px-3 fs-80 rounded-pill text-white"
        >
          {task.lastCompleted}
        </div>}
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
