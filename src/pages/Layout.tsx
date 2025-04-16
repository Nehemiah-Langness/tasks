import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router';
import { Footer } from '../components/Footer';
import { OffCanvas } from '../components/OffCanvas';
import { OffCanvasProvider } from '../contexts/offcanvas/OffCanvasProvider';
import { useEffect } from 'react';
import { useStorage } from '../contexts/storage/useStorage';

export function Layout() {
    const { load } = useStorage();
    
    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        return () => {
            controller.abort();
        };
    }, [load]);

    return (
        <OffCanvasProvider>
            <div className='h-100 d-flex flex-column'>
                <OffCanvas />
                <Navbar />
                <div className='flex-grow-1 pt-5'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </OffCanvasProvider>
    );
}
