import { faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';

export const ErrorMessage = memo(({ error }: { error?: Error | string }) => (
    <div className='d-flex h-100 justify-content-center align-items-center gap-3 flex-column position-relative overflow-hidden'>
        <div className='position-absolute' style={{ zIndex: 0 }}>
            <FontAwesomeIcon style={{ fontSize: '80vh', opacity: 0.1 }} className='text-danger' icon={faBug} />
        </div>
        <div className='px-3 py-1 bg-white border border-danger-subtle text-danger-emphasis' style={{ zIndex: 1 }}>
            <div className='d-flex justify-content-center align-items-center gap-3'>
                <span className='display-5'>An error occurred</span>
            </div>
            <div className='text-center text-dark my-2'>{typeof error === 'string' ? error : error?.message ?? 'Error Message'}</div>
        </div>
    </div>
));
