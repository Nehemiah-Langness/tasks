export interface SaveFile {
    date: number;
    tasks: Task[];
    pool: Pool[];
    poolConfiguration: PoolConfiguration;
    streak: {
        days: number;
        start: number;
    };
    vacation?: Vacation;
    subscription?: {
        endpoint: string;
        keys: {
            auth: string;
            p256dh: string;
        };
    };
}

export interface Vacation {
    start: number;
    end: number;
}

export interface PoolConfiguration {
    startDate: number;
    tasksPerDay: number;
    disabledTasks: number[];
    taskDays: number[];
}

export interface Pool {
    id: number;
    lastCompleted: number;
}

export interface Task {
    id: string;
    poolId?: number;
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
    WeekDay = 0,
    MonthDay = 1,
    Daily = 2,
    IntervalDay = 3,
    Custom = 4,
    IntervalWeek = 5,
    IntervalMonth = 6,
    IntervalYear = 7,
}
