export interface SaveFile {
  date: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  description: string;
  filters: {
    day: number[];
    date: number[];
    month: number[];
    interval: {
      startDate: number;
      step: "day" | "week" | "month" | "year";
      length: number;
    };
  };
}
