
export function Message({ message, onComplete, type }: { message: string; type: string; onComplete: () => void; }) {
    return (
        <div
            onAnimationEnd={(e) => {
                if (e.animationName === 'message') {
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
