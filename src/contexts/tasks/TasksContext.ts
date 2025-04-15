import React from 'react';
import { Task } from '../../types/SaveFile';

export const TasksContext = React.createContext<{
    tasks: Task[] | null | undefined;
}>({ tasks: null });
