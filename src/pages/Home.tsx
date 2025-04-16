import { useStorage } from '../contexts/storage/useStorage';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingMessage } from '../components/LoadingMessage';
import { Today } from './home/Today';
import { Link } from 'react-router';

export function Home() {
    const { data } = useStorage();

    if (data === null) {
        return <ErrorMessage error='Unable to load your data' />;
    }

    if (!data) {
        return <LoadingMessage />;
    }

    return (
        <div className='container d-flex flex-column gap-4'>
            <Today />
            <Link to={'/tasks'} className={`btn btn-outline-primary align-self-lg-center rounded-0 fw-bold px-5 py-3`}>
                Manage Your Tasks
            </Link>
        </div>
    );
}
