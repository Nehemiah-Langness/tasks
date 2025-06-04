import { useStorage } from '../contexts/storage/useStorage';
import { ErrorMessage } from '../components/ErrorMessage';
import { Today } from './home/Today';
import { Link } from 'react-router';
import { Banner } from './home/Banner';
import { formatDate } from '../services/formatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { useVacation } from './home/useVacation';
import { useVacationSettings } from './tasks/useVacationSettings';

export function Home() {
    const { data } = useStorage();

    if (data === null) {
        return <ErrorMessage error='Unable to load your tasks' />;
    }

    return (
        <>
            <Banner />
            <div className='d-flex flex-column gap-4'>
                <Today />
                <div className='container d-flex flex-column gap-4'>
                    <Link to={'/tasks'} className={`btn btn-outline-primary align-self-lg-center rounded-0 fw-bold px-5 py-3`}>
                        Manage Your Tasks
                    </Link>
                </div>

                <VacationFab />
            </div>
        </>
    );
}

function VacationFab() {
    const { upcomingVacation } = useVacation();
    const {editVacation} = useVacationSettings()

    if (upcomingVacation) {
        return (
            <button
                style={{ zIndex: 1 }}
                className='text-primary text-decoration-none position-fixed bottom-0 start-0 border border-info-subtle border-2 rounded-pill shadow bg-info-subtle mx-2 mb-2 px-3 py-2'
                onClick={editVacation}
            >
                <FontAwesomeIcon icon={faUmbrellaBeach} />{' '}
                {formatDate(upcomingVacation, {
                    date: true,
                })}
            </button>
        );
    }
    return null;
}
