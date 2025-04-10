import { memo } from "react";

export const Footer = memo(({ container }: { container?: boolean }) => (
  <div className={`fs-10 text-end p-2 ${container ? "container" : ""}`}>
    <span className="opacity-75" style={{ fontSize: 11 }}>
      &copy; {new Date().getFullYear()} Nehemiah Langness
    </span>
  </div>
));
