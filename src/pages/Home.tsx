import { useEffect } from "react";
import { useStorage } from "../contexts/storage/useStorage";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingMessage } from "../components/LoadingMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export function Home() {
  const { data, load } = useStorage();

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
    <div className="container">
      <Today />

      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
        <span className="fs-140 fw-light">Your Tasks List</span>
        <span className="fs-80 ">
          <FontAwesomeIcon className="text-success" icon={faSave} />{" "}
          {formatDate(data.date)}
        </span>
      </div>
    </div>
  );
}

function Today() {
  return (
    <div>
      <div className="text-center">
        <span className="fs-140">
          {formatDate(Date.now(), {
            day: true,
            date: true,
          })}
        </span>
      </div>
    </div>
  );
}

function formatDate(
  date: number | Date,
  components: {
    day?: boolean;
    date?: boolean;
    time?: boolean;
  } = { date: true, day: true, time: true }
) {
  const dateObject = typeof date === "number" ? new Date(date) : date;

  const day = dateObject.getDate();
  const month = dateObject.getMonth();
  const year = dateObject.getFullYear();
  const minute = dateObject.getMinutes();
  const second = dateObject.getSeconds();
  const hour = dateObject.getHours();
  const dayOfWeek = dateObject.getDay();

  const dayFormatted = components.day ? translateDayOfWeek(dayOfWeek) : "";
  const dateFormatted = components.date ? `${day}/${month}/${year}` : "";
  const timeFormatted = components.time
    ? `${((hour + 12 - 1) % 12) + 1}:${minute
        .toString()
        .padStart(2, "0")}:${second.toString().padStart(2, "0")} ${
        hour < 12 ? "am" : "pm"
      }`
    : "";

  return [
    dayFormatted,
    [dateFormatted, timeFormatted].filter((x) => x).join(" "),
  ]
    .filter((x) => x)
    .join(", ");
}

function translateDayOfWeek(day: number) {
  return (
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][day] ?? ""
  );
}
