import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDate } from "../../services/formatDate";
import { toDay } from "../../services/toDay";
import { Task } from "../../types/SaveFile";
import { getCriticism, getPraise } from "../../features/praise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import { NotificationsButton } from "./NotificationsButton";
import { useCompleteTask } from "./useCompleteTask";
import { useTasks } from "./useTasks";

export function Today() {
  const now = toDay(new Date());

  const tasks = useTasks();

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

  const tasksCompleted = useMemo(
    () =>
      tasks?.filter(
        (x) => x.task.lastCompleted && x.task.lastCompleted >= now.valueOf()
      ),
    [now, tasks]
  );

  return (
    <div>
      {message && (
        <Message
          message={message.message}
          onComplete={clearMessage}
          type={message.type}
        />
      )}
      <div className="d-flex gap-2 justify-content-center align-items-center">
        <NotificationsButton />
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
            <span className="fs-140 fw-light">Today's Tasks</span>
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
            {!!tasksCompleted?.length && (
              <div className="list-group-item text-center h5 mb-0 fw-normal bg-success-subtle position-relative overflow-hidden">
                <AnimatedBackground />
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <b>{tasksCompleted.length}</b> task
                  {tasksCompleted.length === 1 ? "" : "s"} already completed
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-2 py-4 d-flex justify-content-center align-items-center border border-success align-self-stretch my-3 rounded-2 bg-success-subtle position-relative overflow-hidden">
            <AnimatedBackground />
            <div
              className="fs-150 position-relative text-center"
              style={{ zIndex: 1 }}
            >
              All tasks are completed for the day!
              {!!tasksCompleted?.length && (
                <div className="fs-140">
                  You have finished {tasksCompleted?.length} tasks today!
                </div>
              )}
            </div>
          </div>
        )}
        {!!pastDue.length && (
          <>
            <span className="fs-140 fw-light">Tasks You've Missed</span>
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

function AnimatedBackground() {
  return (
    <div
      className="animated-background"
      style={{
        background:
          "url(/star-solid.svg) 0 0 /3rem, url(/star-solid.svg) 1.5rem 1.3rem /3rem",
      }}
    ></div>
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
