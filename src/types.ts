export interface Task {
    id: number;
    name: string;
    startDate?: Date;
    endDate?: Date;
    children?: Task[];
}

export interface GanttTask {
    id: number;
    name: string;
    startDate?: Date;
    endDate?: Date;
}
