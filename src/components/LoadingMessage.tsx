import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

export const LoadingMessage = memo(() => (
  <div className="d-flex h-100 justify-content-center align-items-center">
    <div className="d-flex justify-content-center align-items-center gap-3">
      <FontAwesomeIcon className="display-1" spin icon={faSpinner} />
      <span className="display-5">Loading</span>
    </div>
  </div>
));
