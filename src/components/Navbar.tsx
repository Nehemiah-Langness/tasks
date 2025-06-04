import { Link, useLocation } from 'react-router';
import Branding from '../assets/tasks-due.svg?react';
import { useEffect } from 'react';
import { LogoutButton } from './LogoutButton';
import { NotificationsButton } from '../pages/home/NotificationsButton';
import { Streak } from '../pages/home/Streak';

export function Navbar() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, [pathname]);

    return (
        <nav className='navbar bg-primary navbar-expand-lg' data-bs-theme='dark'>
            <div className='container-fluid'>
                <div className='d-flex gap-2 align-items-center'>
                    <Link className='navbar-brand py-0' to='/'>
                        <Branding height='3rem' />
                    </Link>
                    <Streak />
                </div>

                <div className='d-flex gap-2'>
                    <NotificationsButton />

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
