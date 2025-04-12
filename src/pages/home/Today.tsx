import { useCallback, useEffect, useMemo, useState } from "react";
import { useStorage } from "../../contexts/storage/useStorage";
import { formatDate } from "../../services/formatDate";
import { getNextPassingDate } from "../../services/getNextPassingDate";
import { toDay } from "../../services/toDay";
import { Task } from "../../types/SaveFile";
import { getCriticism, getPraise } from "../../features/praise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";

export function Today() {
  const { data } = useStorage();
  const now = toDay(new Date());

  const tasks = useMemo(
    () =>
      data?.tasks
        .map((t) => {
          const nextDueDate = getNextPassingDate(
            new Date(t.startDate),
            t.filters,
            true
          );
          return { task: t, nextDueDate };
        })
        .sort(
          (a, b) =>
            (a.nextDueDate?.valueOf() ?? 0) - (b.nextDueDate?.valueOf() ?? 0)
        ),
    [data?.tasks]
  );

  const pastDue = useMemo(
    () =>
      tasks?.filter(
        (x) => !x.nextDueDate || x.nextDueDate.valueOf() < now.valueOf()
      ) ?? [],
    [now, tasks]
  );

  const dueToday = useMemo(
    () =>
      tasks?.filter(
        (x) => x.nextDueDate && x.nextDueDate.valueOf() === now.valueOf()
      ) ?? [],
    [now, tasks]
  );

  const hasPastDueItems = pastDue.length > 0;
  const hasGoodDay = dueToday.length === 0 && !hasPastDueItems;

  const [message, setMessage] = useState<{
    type: "praise" | "criticism";
    message: string;
  }>();
  useEffect(() => {
    if (hasPastDueItems) {
      setMessage({
        message: getCriticism(),
        type: "criticism",
      });
    }
  }, [hasPastDueItems]);

  useEffect(() => {
    if (hasGoodDay) {
      setMessage({
        message: getPraise(),
        type: "praise",
      });
    }
  }, [hasGoodDay]);

  const clearMessage = useCallback(() => {
    setMessage(undefined);
  }, []);

  return (
    <div>
      {message && (
        <Message
          message={message.message}
          onComplete={clearMessage}
          type={message.type}
        />
      )}
      <div className="text-center">
        <span className="fs-140">
          {formatDate(now, {
            day: true,
            date: true,
          })}
        </span>
      </div>
      <div className="d-flex flex-column align-items-start gap-3">
        {dueToday.length ? (
          <div className="list-group">
            Due Today
            {tasks
              ?.filter(
                (x) =>
                  x.nextDueDate && x.nextDueDate.valueOf() === now.valueOf()
              )
              .map((t) => (
                <div className="list-group-item">
                  <TaskRow task={t.task} />
                </div>
              ))}
          </div>
        ) : (
          <div>Your tasks are completed for the day!</div>
        )}
        {!!pastDue.length && (
          <>
            Past Due
            {pastDue.map((t) => (
              <div>
                <TaskRow
                  task={t.task}
                  dueDate={t.nextDueDate?.valueOf()}
                  pastDue
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function Message({
  message,
  onComplete,
  type,
}: {
  message: string;
  type: string;
  onComplete: () => void;
}) {
  return (
    <div
      onAnimationEnd={(e) => {
        if (e.animationName === "message") {
          onComplete();
        } else {
          alert(e.animationName);
        }
      }}
      className={`message ${type}`}
      onClick={onComplete}
    >
      <div>{message}</div>
    </div>
  );
}

function useCompleteTask(id: string) {
  const { data, save } = useStorage();

  return useCallback(() => {
    if (!data) {
      return;
    }
    const t = data.tasks.find((t) => t.id === id);
    if (!t) {
      return;
    }
    const now = toDay(Date.now());
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    t.lastCompleted = now.valueOf();
    while (toDay(t.startDate).valueOf() <= now.valueOf()) {
      t.startDate = toDay(
        getNextPassingDate(new Date(t.startDate), t.filters) ?? tomorrow
      ).valueOf();
    }

    return save(data);
  }, [data, id, save]);
}

export function TaskRow({
  task,
  dueDate,
  pastDue,
}: {
  task: Task;
  dueDate?: number;
  pastDue?: boolean;
}) {
  const completeTask = useCompleteTask(task.id);

  return (
    <div className="d-flex gap-3 align-items-center">
      <div>
        <CompleteButton onClick={completeTask} />
      </div>
      <div className="h5 mb-0 fw-normal">{task.description}</div>

      <div className="d-flex gap-2 align-items-center px-3 flex-wrap">
        {task.lastCompleted && (
          <div
            style={{ paddingTop: 2, paddingBottom: 2 }}
            className="bg-success px-3 fs-80 rounded-pill text-white"
          >
            Last Completed on{" "}
            {formatDate(task.lastCompleted, {
              date: true,
              day: true,
            })}
          </div>
        )}
        {dueDate && pastDue && (
          <div
            style={{ paddingTop: 2, paddingBottom: 2 }}
            className="bg-danger px-3 fs-80 rounded-pill text-white"
          >
            Due on{" "}
            {formatDate(dueDate, {
              date: true,
              day: true,
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CompleteButton({ onClick }: { onClick: () => void }) {
  const [completed, setCompleted] = useState(false);

  const ButtonIcon = useCallback(
    () => <FontAwesomeIcon className="fs-200" icon={faCheckSquare} />,
    []
  );

  if (completed) {
    return (
      <div
        onAnimationEnd={(e) => {
          if (e.animationName === "task-completed-from") {
            setTimeout(onClick, 500);
          }
        }}
        className="task-completed text-success"
      >
        <div className="original">
          <button className="btn btn-link text-decoration-none link-success d-flex align-items-center">
            <ButtonIcon />
          </button>
        </div>
        <div className="from">
          <ButtonIcon />
        </div>
        <div className="to">
          <FontAwesomeIcon className="fs-200" icon={faCalendarCheck} />
        </div>
      </div>
    );
  }

  return (
    <button
      className="btn btn-link text-decoration-none link-success d-flex align-items-center"
      onClick={() => setCompleted(true)}
    >
      <ButtonIcon />
    </button>
  );
}
