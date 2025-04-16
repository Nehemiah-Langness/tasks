import { memo } from 'react';
import Logo from '../assets/logo.svg?react';

export const Footer = memo(({ container }: { container?: boolean }) => (
    <div className={`fs-10 text-end p-2 ${container ? 'container' : ''}`}>
        <Logo style={{height: '1.5em'}} className='me-1' />
        <span className='opacity-75' style={{ fontSize: 11 }}>
            &copy; {new Date().getFullYear()} Nehemiah Langness
        </span>
    </div>
));
