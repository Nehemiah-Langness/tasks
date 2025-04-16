import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTasks } from '../contexts/tasks/useTasks';
import { getCriticism, getPraise } from '../features/praise';
import { Dates } from '../services/dates';
import { Message } from '../pages/home/Today';

export function Praise() {
    const now = Dates.today().valueOf();

    const tasks = useTasks(true);
    const tasksLoaded = !!tasks;
    const pastDue = useMemo(() => tasks?.filter((x) => !x.dueDate || x.dueDate < now) ?? [], [now, tasks]);
    const dueToday = useMemo(() => tasks?.filter((x) => x.dueDate && x.dueDate === now) ?? [], [now, tasks]);
    const hasPastDueItems = pastDue.length > 0;
    const hasGoodDay = dueToday.length === 0 && !hasPastDueItems;

    const [message, setMessage] = useState<{
        type: 'praise' | 'criticism';
        message: string;
    }>();
    useEffect(() => {
        if (hasPastDueItems && tasksLoaded) {
            setMessage({
                message: getCriticism(),
                type: 'criticism',
            });
        }
    }, [hasPastDueItems, tasksLoaded]);

    useEffect(() => {
        if (hasGoodDay && tasksLoaded) {
            setMessage({
                message: getPraise(),
                type: 'praise',
            });
        }
    }, [hasGoodDay, tasksLoaded]);

    const clearMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    return message && <Message message={message.message} onComplete={clearMessage} type={message.type} />;
}
