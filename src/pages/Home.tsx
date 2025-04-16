import { useEffect } from 'react';
import { useStorage } from '../contexts/storage/useStorage';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingMessage } from '../components/LoadingMessage';
import { Today } from './home/Today';
import { Link } from 'react-router';

export function Home() {
    const { data, load } = useStorage();

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => {
            controller.abort();
        };
    }, [load]);

    if (data === null) {
        return <ErrorMessage error='Unable to load your data' />;
    }

    if (!data) {
        return <LoadingMessage />;
    }

    return (
        <div className='container d-flex flex-column gap-2'>
            <Today />
            <Link to={'/tasks'} className={`btn btn-primary align-self-center`}>
                Manage Your Tasks
            </Link>
        </div>
    );
}
