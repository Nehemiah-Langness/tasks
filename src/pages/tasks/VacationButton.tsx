import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStorage } from '../../contexts/storage/useStorage';
import { useOffCanvas } from '../../contexts/offcanvas/useOffCanvas';
import { useCallback, useEffect, useState } from 'react';
import { Vacation } from '../../types/SaveFile';
import { VacationForm } from './VacationForm';
import { Dates } from '../../services/dates';

export function VacationButton() {
    const { data, save, allTasksInPool } = useStorage();
    const { setContent, setTitle, close, open, isOpen } = useOffCanvas();
    const [vacation, setVacation] = useState<Vacation>();

    const saveVacation = useCallback(
        async (config: Vacation | undefined) => {
            if (data) {
                data.vacation = config;
                const success = await save(data);
                if (success) {
                    setVacation(undefined);
                }
            }
        },
        [data, save]
    );

    useEffect(() => {
        if (!isOpen) {
            setVacation(undefined);
        }
    }, [isOpen]);

    useEffect(() => {
        if (vacation) {
            const revertTitle = setTitle('Edit 5-Minute Task Pool');
            setContent(<VacationForm vacation={vacation} save={saveVacation} />);
            return () => {
                revertTitle();
            };
        }
    }, [allTasksInPool, data?.tasks, vacation, saveVacation, setContent, setTitle]);

    useEffect(() => {
        if (vacation) {
            open();
            return () => {
                close();
            };
        }
    }, [close, open, vacation]);

    return (
        <button
            className='btn btn-link link-primary ms-auto text-decoration-none d-flex align-items-center gap-2 text-nowrap'
            onClick={() => {
                setVacation(
                    data?.vacation ?? {
                        start: Dates.today().valueOf(),
                        end: Dates.increment(Dates.today(), 7, 'day').valueOf(),
                    }
                );
            }}
        >
            <FontAwesomeIcon style={{ fontSize: '1.1em' }} icon={faUmbrellaBeach} /> Vacation Mode
        </button>
    );
}
