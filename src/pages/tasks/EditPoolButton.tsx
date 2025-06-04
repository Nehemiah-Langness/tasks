import { faPencilSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useCallback, useEffect } from 'react';
import { useOffCanvas } from '../../contexts/offcanvas/useOffCanvas';
import { useStorage } from '../../contexts/storage/useStorage';
import { PoolConfiguration } from '../../types/SaveFile';
import { PoolEditForm } from './PoolEditForm';

export function EditPoolButton() {
    const { data, save, allTasksInPool } = useStorage();
    const { setContent, setTitle, close, open, isOpen } = useOffCanvas();
    const [poolConfig, setPoolConfig] = useState<PoolConfiguration>();

    const savePool = useCallback(
        async (config: PoolConfiguration) => {
            if (data) {
                data.poolConfiguration = config;
                const success = await save(data);
                if (success) {
                    setPoolConfig(undefined);
                }
            }
        },
        [data, save]
    );

    useEffect(() => {
        if (!isOpen) {
            setPoolConfig(undefined);
        }
    }, [isOpen]);

    useEffect(() => {
        if (poolConfig) {
            const revertTitle = setTitle('Edit 5-Minute Task Pool');
            setContent(<PoolEditForm poolConfiguration={poolConfig} save={savePool} pool={allTasksInPool} tasks={data?.tasks ?? []} />);
            return () => {
                revertTitle();
            };
        }
    }, [allTasksInPool, data?.tasks, poolConfig, savePool, setContent, setTitle]);

    useEffect(() => {
        if (poolConfig) {
            open();
            return () => {
                close();
            };
        }
    }, [close, open, poolConfig]);

    if (!data) {
        return <div className="skeleton rounded" style={{width: '9em'}}>&nbsp;</div>
    }

    return (
        <button
            className='btn btn-link link-success text-decoration-none d-flex align-items-center gap-2 text-nowrap'
            onClick={() => setPoolConfig(data?.poolConfiguration)}
        >
            <FontAwesomeIcon style={{ fontSize: '1.1em' }} icon={faPencilSquare} /> 5-Minute Tasks
        </button>
    );
}
