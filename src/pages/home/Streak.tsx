import { useStorage } from '../../contexts/storage/useStorage';

export function Streak() {
    const { data } = useStorage();
    return (
        data?.streak.days && (
            <div className='streak'>
                {/* <div className='position-absolute'>
                    <FontAwesomeIcon icon={faFire} />
                </div> */}
                <span className='position-relative '>You are on a {data.streak.days} day streak!</span>
            </div>
        )
    );
}
