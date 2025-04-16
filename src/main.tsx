import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import { Auth } from './features/Auth.tsx';
import { StorageProvider } from './contexts/storage/StorageProvider.tsx';
import { Praise } from './components/Praise.tsx';

localStorage.setItem('test', 'is set');

createRoot(document.getElementById('root')!).render(
    <Auth>
        <StorageProvider>
            <Praise />
            <App />
        </StorageProvider>
    </Auth>
);
