import React, { FC } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { GanttTask as IGanttTask } from '../types';

type GanttTaskProps = {
    task: IGanttTask;
    x: number;
    y: number;
    zoomScale: number;
    rowHeight: number;
};

export const GanttTask: FC<GanttTaskProps> = ({ task, x, y, rowHeight, zoomScale }) => {
    // TODO. Fix calculation
    const width = (task.endDate!.getDate() - task.startDate!.getDate()) * zoomScale;

    return (
        <Group x={x} y={y}>
            <Rect
                width={width}
                height={rowHeight - 4}
                fill="#4CAF50"
                // cornerRadius={4}
                draggable
                dragBoundFunc={(pos) => ({
                    x: pos.x,
                    y: y,
                })}
                onDragMove={(e) => {
                    // TODO. Verify and fix code
                    const newX = e.target.x() + scrollX;
                    const day = Math.round(newX / zoomScale);
                    task.startDate!.setDate(day + 1);
                    task.endDate!.setDate(day + 5);
                }}
            />
            <Text x={x + 8} y={y + 8} text={task.name} fontSize={14} fill="white" />
        </Group>
    );
};
