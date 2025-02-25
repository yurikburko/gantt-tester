import { useDivSize } from '@/common/hooks/useBoxSize';
import {
    addDays,
    daysDiff,
    formatAsDayNameFirstLetter,
    formatDatesRange,
    getDayOfWeek,
    today as getToday,
} from '@/utils/dateUtility';
import Konva from 'konva';
import React, { FC, useState } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

const today = getToday();
const zoomLevel = 20;

const getDate = (offset: number) => {
    // works for both positive and negative diffs thanks to the Math.floor
    return addDays(today, Math.floor(offset / zoomLevel));
};
const getOffset = (date: Date): number => {
    return Math.floor(daysDiff(today, date) * zoomLevel);
};

let isDragging = false;
let lastDraggingX = 0;

const GanttCanvas: FC = () => {
    const [canvasContainerRef, containerHeight, containerWidth] = useDivSize();

    const [todayX, setTodayX] = useState<number>(0);

    // Timeline offsets
    const startX = -todayX;
    const endX = startX + containerWidth;

    const periodStart = getDate(startX),
        periodEnd = getDate(endX),
        periodStartWeek = addDays(periodStart, -getDayOfWeek(periodStart));
    let nextWeek;

    const weeks = [];
    const days = [];
    for (let currentWeek = periodStartWeek; currentWeek <= periodEnd; currentWeek = nextWeek) {
        nextWeek = addDays(currentWeek, 7);
        const lastDateOfWeek = addDays(currentWeek, 6);

        // week
        weeks.push(
            <Group key={currentWeek.getTime()} x={getOffset(currentWeek)} y={-1}>
                <Rect
                    width={getOffset(nextWeek) - getOffset(currentWeek) + 1}
                    height={19}
                    fill={'#F7F7FC'}
                    stroke={'#EDEDF2'}
                    // strokeWidth={1} // border width
                ></Rect>
                <Text
                    fontFamily="Arial"
                    fontSize={11}
                    text={formatDatesRange(currentWeek, lastDateOfWeek)}
                    x={2}
                    y={5}
                />
            </Group>
        );

        // days
        let nextDay;
        for (let currentDay = currentWeek, i = 0; i < 7; currentDay = nextDay, i++) {
            nextDay = addDays(currentDay, 1);

            const dayWidth = getOffset(nextDay) - getOffset(currentDay) + 1;
            days.push(
                <Group key={currentDay.getTime()} x={getOffset(currentDay)} y={17}>
                    <Rect width={dayWidth} height={19} stroke={'#EDEDF2'} strokeWidth={1}></Rect>
                    <Text
                        text={formatAsDayNameFirstLetter(currentDay)}
                        fontSize={11}
                        x={dayWidth / 2}
                        y={6}
                    />
                </Group>
            );
        }
    }

    const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        isDragging = true;
        lastDraggingX = e.evt.clientX;
    };
    const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isDragging) {
            const deltaScrollX = e.evt.clientX - lastDraggingX;
            setTodayX(todayX + deltaScrollX);
            lastDraggingX = e.evt.clientX;
        }
    };
    const onMouseUp = () => {
        isDragging = false;
    };

    return (
        <div ref={canvasContainerRef} style={{ height: '100%', overflow: 'hidden' }}>
            <Stage onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove} 
                    width={containerWidth}
                     height={containerHeight}
            >
                <Layer>
                    <Group x={todayX} y={0}>
                        {weeks}
                        {days}
                    </Group>
                </Layer>
            </Stage>
        </div>
    );
};

export default GanttCanvas;
