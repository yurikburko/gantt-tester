export interface Task {
    id: number;
    name: string;
    start?: Date;
    end?: Date;
    children?: Task[];

    completionRatio?: number;
    isExpanded?: boolean;
}

export interface GanttTask {
    id: number;
    name: string;
    start?: Date;
    end?: Date;
}
