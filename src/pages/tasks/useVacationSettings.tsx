import { useState, useCallback, useEffect } from 'react';
import { useOffCanvas } from '../../contexts/offcanvas/useOffCanvas';
import { useStorage } from '../../contexts/storage/useStorage';
import { Dates } from '../../services/dates';
import { Vacation } from '../../types/SaveFile';
import { VacationForm } from './VacationForm';

export function useVacationSettings() {
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
            const revertTitle = setTitle('Vacation');
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

    const editVacation = useCallback(() => {
        setVacation(
            data?.vacation ?? {
                start: Dates.today().valueOf(),
                end: Dates.increment(Dates.today(), 7, 'day').valueOf(),
            }
        );
    }, [data?.vacation]);

    return {
        editVacation,
        loaded: !!data,
    };
}
