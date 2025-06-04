import { useMemo } from 'react';
import { useStorage } from '../../contexts/storage/useStorage';
import { Dates } from '../../services/dates';


export function useVacation() {
    const { data } = useStorage();

    return useMemo(() => {
        if (!data?.vacation) return {
            onVacation: false,
            upcomingVacation: null,
            vacationEnd: null
        };

        return {
            onVacation: Dates.today().valueOf() >= data.vacation.start && Dates.today().valueOf() <= data.vacation.end,
            upcomingVacation: Dates.today().valueOf() < data.vacation.start ? Dates.date(data.vacation.start) : null,
            vacationEnd: Dates.date(data.vacation.end),
        };
    }, [data?.vacation]);
}
