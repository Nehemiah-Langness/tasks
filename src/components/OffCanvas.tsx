import { useOffCanvas } from "../contexts/offcanvas/useOffCanvas";

export function OffCanvas() {
  const { ref, Content, Title, close } = useOffCanvas();

  return (
    <div
      ref={ref}
      className="offcanvas offcanvas-start"
      data-bs-backdrop="static"
      tabIndex={-1}
      id="offcanvas"
      aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasLabel">
          {Title}
        </h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={close}
        ></button>
      </div>
      <div className="offcanvas-body">{Content}</div>
    </div>
  );
}
