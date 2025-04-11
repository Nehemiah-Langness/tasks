import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const ErrorMessage = memo(({ error }: { error?: Error | string }) => (
  <div className="d-flex h-100 justify-content-center align-items-center gap-3 flex-column">
    <div className="d-flex justify-content-center align-items-center gap-3">
      <FontAwesomeIcon className="display-1 text-danger" icon={faBug} />
      <span className="display-5">An error occurred</span>
    </div>
    <div>
      {typeof error === "string" ? error : error?.message ?? "Error Message"}
    </div>
  </div>
));
