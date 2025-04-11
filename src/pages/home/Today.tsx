import { formatDate } from "../../services/formatDate";

export function Today() {
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
