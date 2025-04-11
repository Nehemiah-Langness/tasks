import { useEffect } from "react";
import { useStorage } from "../contexts/storage/useStorage";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingMessage } from "../components/LoadingMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useOffCanvas } from "../contexts/offcanvas/useOffCanvas";
import { formatDate } from "../services/formatDate";
import { NewTaskButton } from "./home/NewTaskButton";
import { Today } from "./home/Today";
import { TaskEditProvider } from "../contexts/edit-tasks/TaskEditProvider";
import { TaskRow } from "./home/TaskRow";

export function Home() {
  const { data, load } = useStorage();
  const { open } = useOffCanvas();

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => {
      controller.abort();
    };
  }, [load]);

  if (data === null) {
    return <ErrorMessage error="Unable to load your data" />;
  }

  if (!data) {
    return <LoadingMessage />;
  }

  return (
    <TaskEditProvider>
      <div className="container d-flex flex-column gap-2">
        <Today />

        <div
          className="d-flex justify-content-between align-items-center gap-2"
          onClick={open}
        >
          <span className="fs-140 fw-light">Your Tasks List</span>
          <span className="fs-80 ">
            <FontAwesomeIcon className="text-success" icon={faSave} />{" "}
            {formatDate(data.date)}
          </span>
        </div>
        <NewTaskButton />

        <div className="d-flex flex-column gap-2 px-3">
          {data.tasks.map((x) => (
            <TaskRow key={x.id} task={x} />
          ))}
        </div>
      </div>
    </TaskEditProvider>
  );
}
