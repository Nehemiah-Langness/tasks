import { useAuth0 } from '@auth0/auth0-react';

export function UserImage({ size }: { size?: string | number }) {
    const { user } = useAuth0();
    return user ? <img src={user.picture} className='rounded-2' style={{ width: size ?? '3rem', height: size ?? '3rem' }} /> : null;
}
