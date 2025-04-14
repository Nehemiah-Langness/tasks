export interface SaveFile {
  date: number;
  tasks: Task[];
  pool: Pool[];
  subscription?: {
    endpoint: string;
    keys: {
      auth: string;
      p256dh: string;
    };
  };
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
  filters: {
    type?: RecurrenceType;
    day?: number[];
    date?: number[];
    month?: number[];
    interval?: {
      step: "day" | "week" | "month" | "year";
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
