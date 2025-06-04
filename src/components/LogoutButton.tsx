import { useAuth0 } from '@auth0/auth0-react';
import { UserImage } from './UserImage';

export function LogoutButton() {
    const { logout } = useAuth0();

    return (
        <div className='dropdown-center align-self-stretch d-flex position-relative' data-bs-theme='light'>
            <button
                className='btn btn-outline-primary p-0 fs-80 rounded-pill'
                type='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                style={{ width: '3rem', height: '3rem' }}
            >
                <UserImage />
            </button>
            <ul className='dropdown-menu dropdown-menu-end'>
                <li>
                    <button className='dropdown-item' onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                        Log out
                    </button>
                </li>
            </ul>
        </div>
    );
}
