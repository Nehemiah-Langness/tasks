import { faCircle, faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback } from 'react';

export function CompleteButton({ onClick, completed: alreadyComplete }: { onClick: () => void; completed?: boolean }) {
    const [completed, setCompleted] = useState(false);
    const [hovered, setHovered] = useState(false);

    const ButtonIcon = useCallback(
        () => <FontAwesomeIcon className='fs-200' icon={alreadyComplete ? faCheckCircle : hovered ? farCheckCircle : faCircle} />,
        [alreadyComplete, hovered]
    );

    if (completed && !alreadyComplete) {
        return (
            <div
                onAnimationEnd={(e) => {
                    if (e.animationName === 'task-completed-from') {
                        onClick();
                    }
                }}
                className='task-completed '
            >
                <div className='original'>
                    <button
                        className={`btn btn-link text-decoration-none ${
                            alreadyComplete ? 'link-success' : 'link-primary'
                        } d-flex align-items-center`}
                    >
                        <ButtonIcon />
                    </button>
                </div>
                <div className='from text-primary'>
                    <ButtonIcon />
                </div>
                <div className='to text-success'>
                    <FontAwesomeIcon className='fs-200' icon={faCheckCircle} />
                </div>
            </div>
        );
    }

    return (
        <button
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            disabled={alreadyComplete}
            className={`btn btn-link text-decoration-none ${alreadyComplete ? 'link-success' : 'link-primary'} d-flex align-items-center`}
            onClick={() => setCompleted(true)}
        >
            <ButtonIcon />
        </button>
    );
}
