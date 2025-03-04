import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GanttTask, Task } from '@/types';
import { Grid, GridColumn, GridCustomRowProps, GridPageChangeEvent } from '@progress/kendo-react-grid';
import { addDays, daysDiff, formatAsShort } from '@/utils/dateUtility';
import { useDivSize } from '@/common/hooks/useBoxSize';
import { ROW_HEIGHT } from '@/components/consts';

const DAY_WIDTH = 80;

type TimelineGridProps = {
    tasks: GanttTask[];
};

export const TimelineGrid: FC<TimelineGridProps> = ({ tasks }) => {
    const [gridContainerRef, gridBoxHeight] = useDivSize();

    useEffect(() => {
        setSkip(0);
    }, [tasks]);

    const { timelineStartDate, timelineEndDate } = useMemo(() => {
        const timelineStartDate = new Date(Math.min(...tasks.map((t) => t.start!.getTime())));
        const timelineEndDate = new Date(Math.max(...tasks.map((t) => t.end!.getTime())));
        return { timelineStartDate, timelineEndDate };
    }, [tasks]);

    const generatedDayColumns = useMemo(() => {
        const daysInRangeToDisplay = daysDiff(timelineStartDate, timelineEndDate) + 1;

        const columns = [];
        for (let i = 0; i < daysInRangeToDisplay; i++) {
            const currentDay = addDays(timelineStartDate, i);
            columns.push({
                field: `day_${i}`,
                // field: `id`,
                title: formatAsShort(currentDay),
                width: DAY_WIDTH,
            });
        }
        return columns;
    }, [timelineStartDate, timelineEndDate]);

    const [skip, setSkip] = useState<number>(0);
    const pageChange = (event: GridPageChangeEvent) => {
        setSkip(event.page.skip);
    };

    const CustomGridRow = useCallback(
        (props: GridCustomRowProps) => {
            const task = props.dataItem as Task;
            const { start: taskStart, end: taskEnd } = task;
            const offsetInDays = daysDiff(timelineStartDate, taskStart!);
            const taskDuration = daysDiff(taskStart!, taskEnd!) + 1;
            const left = offsetInDays * DAY_WIDTH;
            const width = taskDuration * DAY_WIDTH;
            return (
                <>
                    <tr {...props.trProps} style={{ ...props.trProps?.style, ...{ position: 'relative' } }}>
                        {props.children}
                        <div style={{ position: 'absolute', left, top: 7, width, backgroundColor: '#3db9d3' }}>
                            {task.name}
                        </div>
                    </tr>
                </>
            );
        },
        [timelineStartDate]
    );

    return (
        <div ref={gridContainerRef} style={{ height: '100%' }}>
            <Grid
                style={{ overflow: 'auto', height: gridBoxHeight }}
                data={tasks}
                scrollable="virtual"
                rowHeight={ROW_HEIGHT}
                skip={skip}
                pageSize={50}
                total={tasks.length}
                onPageChange={pageChange}
                rows={{ data: CustomGridRow }}
                // columnVirtualization={true}
            >
                {generatedDayColumns.map((columnInfo, index) => (
                    <GridColumn
                        key={index}
                        title={columnInfo.title}
                        width={columnInfo.width}
                        field={columnInfo.field}
                    />
                ))}
            </Grid>
        </div>
    );
};
