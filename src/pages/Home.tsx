import { useStorage } from '../contexts/storage/useStorage';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingMessage } from '../components/LoadingMessage';
import { Today } from './home/Today';
import { Link } from 'react-router';
import { Streak } from './home/Streak';
import { Dates } from '../services/dates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../services/formatDate';

export function Home() {
    const { data } = useStorage();

    if (data === null) {
        return <ErrorMessage error='Unable to load your data' />;
    }

    if (!data) {
        return <LoadingMessage />;
    }

    const vacation = data.vacation && Dates.today().valueOf() >= data.vacation.start && Dates.today().valueOf() <= data.vacation.end;

    return (
        <>
            {vacation ? (
                <div className='d-flex justify-content-center align-items-center bg-info-subtle text-info-emphasis fs-200 p-3 ff-cursive gap-3'>
                    <FontAwesomeIcon flip='horizontal' icon={faUmbrellaBeach} />
                    <div className=''>
                        On vacation until{' '}
                        {formatDate(data.vacation?.end ?? 0, {
                            date: true,
                            summarize: true,
                        })}
                    </div>
                    <FontAwesomeIcon icon={faUmbrellaBeach} />
                </div>
            ) : (
                <Streak />
            )}
            <div className='container d-flex flex-column gap-4'>
                <Today />
                <Link to={'/tasks'} className={`btn btn-outline-primary align-self-lg-center rounded-0 fw-bold px-5 py-3`}>
                    Manage Your Tasks
                </Link>
            </div>
        </>
    );
}
