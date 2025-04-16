import { PropsWithChildren, useState, useCallback, useEffect } from 'react';
import { useOffCanvas } from '../offcanvas/useOffCanvas';
import { useStorage } from '../storage/useStorage';
import { RecurrenceType, Task } from '../../types/SaveFile';
import { TaskEditContext } from './TaskEditContext';
import { TaskEditForm } from '../../pages/tasks/TaskEditForm';
import { Dates } from '../../services/dates';

export function TaskEditProvider({ children }: PropsWithChildren) {
    const [task, setTask] = useState<Task>();
    const { open, close, setContent, setTitle, isOpen } = useOffCanvas();
    const { data, save: saveData } = useStorage();

    const isNew = !!data?.tasks.find((t) => t.id === task?.id);

    const create = useCallback(() => {
        setTask({
            description: '',
            id: crypto.randomUUID(),
            startDate: Dates.today().valueOf(),
            dueDate: Dates.today().valueOf(),
            filters: {
                type: RecurrenceType.Daily,
            },
        });
    }, []);

    const load = useCallback((task: Task) => {
        setTask(task);
    }, []);

    const cancel = useCallback(() => {
        close();
    }, [close]);

    const save = useCallback(
        async (newTask: Task) => {
            if (!data) {
                return;
            }

            const success = await saveData({
                ...data,
                date: Date.now(),
                tasks: data.tasks.filter((x) => x.id !== newTask.id).concat(newTask),
            });
            if (success) {
                setTask(undefined);
            }
        },
        [data, saveData]
    );

    useEffect(() => {
        if (!isOpen) {
            setTask(undefined);
        }
    }, [isOpen]);

    useEffect(() => {
        if (task) {
            open();
            const revertTitle = setTitle(isNew ? 'Create Task' : 'Edit Task');
            const revertContent = setContent(<TaskEditForm save={save} task={task} />);
            return () => {
                revertTitle();
                revertContent();
            };
        }
    }, [isNew, open, save, setContent, setTitle, task]);

    return <TaskEditContext.Provider value={{ create, cancel, load }}>{children}</TaskEditContext.Provider>;
}
