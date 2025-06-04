import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';

export const LoggingInMessage = memo(() => (
    <div className='d-flex h-100 justify-content-center align-items-center'>
        <div className='d-flex flex-column justify-content-center align-items-center gap-3 skeleton-text'>
            <FontAwesomeIcon className='display-1' icon={faUserShield} />
            <span className='display-5'>Logging in</span>
        </div>
    </div>
));
