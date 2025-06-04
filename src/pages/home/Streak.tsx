import { useState } from 'react';
import { useStorage } from '../../contexts/storage/useStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';

export function Streak() {
    const { data } = useStorage();

    const [showStreak, setShowStreak] = useState(false);

    return (
        !!data?.streak.days && (
            <>
                <button
                    className='btn btn-primary rounded-circle d-flex align-items-center justify-content-center position-relative'
                    style={{ width: '3rem', height: '3rem' }}
                    onClick={() => setShowStreak(true)}
                >
                    <FontAwesomeIcon className='fs-200 streak-icon' icon={faFireFlameCurved} />
                    <div className='position-absolute inset-0 d-flex justify-content-end align-items-start text-white fw-bold text-shadow'>{data.streak.days.toLocaleString()}</div>
                </button>

                {showStreak && (
                    <div
                        className='streak'
                        onAnimationEnd={(e) => {
                            if (e.animationName === 'streak-message') {
                                setShowStreak(false);
                            }
                        }}
                        onClick={() => setShowStreak(false)}
                    >
                        <div>You are on a {data.streak.days} day streak!</div>
                    </div>
                )}
            </>
        )
    );
}
