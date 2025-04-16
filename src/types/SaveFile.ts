export interface SaveFile {
    date: number;
    tasks: Task[];
    pool: Pool[];
    poolConfiguration: PoolConfiguration;
    streak: {
        days: number;
        start: number;
    };
    subscription?: {
        endpoint: string;
        keys: {
            auth: string;
            p256dh: string;
        };
    };
}

export interface PoolConfiguration {
    startDate: number;
    tasksPerDay: number;
    disabledTasks: number[];
}

export interface Pool {
    id: number;
    lastCompleted: number;
}

export interface Task {
    id: string;
    description: string;
    lastCompleted?: number;
    startDate: number;
    dueDate: number;
    filters: {
        type?: RecurrenceType;
        day?: number[];
        date?: number[];
        month?: number[];
        interval?: {
            step: 'day' | 'week' | 'month' | 'year';
            length: number;
        };
    };
}

export enum RecurrenceType {
    WeekDay,
    MonthDay,
    Daily,
    IntervalDay,
    Custom,
}
