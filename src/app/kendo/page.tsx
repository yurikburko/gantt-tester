'use client';

import React from 'react';
import {
    Gantt,
    GanttWeekView,
    GanttMonthView,
    GanttDayView,
    GanttTextFilter,
    GanttTaskModelFields,
    GanttDependencyModelFields,
    GanttExpandChangeEvent,
    orderBy,
    mapTree,
    extendDataItem,
} from '@progress/kendo-react-gantt';
import { simpleDependencies, simpleTasks } from '../mockData/mockData';
import { useLicenseRemover } from './hooks/useLicenseRemover';
import { getter } from '@progress/kendo-react-common';
import { SortDescriptor } from '@progress/kendo-data-query';

const ganttStyle = {
    height: '100%',
    width: '100%',
};

const taskModelFields: GanttTaskModelFields = {
    id: 'id',
    start: 'start',
    end: 'end',
    title: 'title',
    percentComplete: 'percentComplete',
    isRollup: 'isRollup',
    isExpanded: 'isExpanded',
    isInEdit: 'isInEdit',
    children: 'subtasks',
};
const dependencyModelFields: GanttDependencyModelFields = {
    id: 'id',
    fromId: 'fromId',
    toId: 'toId',
    type: 'type',
};

const columns = [
    {
        field: taskModelFields.id,
        title: 'id',
        width: 70,
    },
    {
        field: taskModelFields.title,
        title: 'Title',
        width: 200,
        expandable: true,
        filter: GanttTextFilter,
    },
    {
        field: taskModelFields.start,
        title: 'Start',
        width: 120,
        format: '{0:MM/dd/yyyy}',
    },
    {
        field: taskModelFields.end,
        title: 'End',
        width: 120,
        format: '{0:MM/dd/yyyy}',
    },
];

const getTaskId = getter(taskModelFields.id!);

const defaultSort: SortDescriptor[] = [{ field: taskModelFields.id!, dir: 'asc' }];

export default function Page() {
    useLicenseRemover();

    const [taskData] = React.useState(simpleTasks);
    const [dependencyData] = React.useState(simpleDependencies);
    const [expandedState, setExpandedState] = React.useState([7, 11, 12, 13]);

    const onExpandChange = React.useCallback(
        (event: GanttExpandChangeEvent) => {
            const id = getTaskId(event.dataItem);
            const newExpandedState = event.value
                ? expandedState.filter((currentId) => currentId !== id)
                : [...expandedState, id];

            setExpandedState(newExpandedState);
        },
        [expandedState, setExpandedState]
    );

    const processedData = React.useMemo(() => {
        const sortedData = orderBy(taskData, defaultSort, taskModelFields.children!);

        return mapTree(sortedData, taskModelFields.children!, (task) =>
            extendDataItem(task, taskModelFields.children!, {
                [taskModelFields.isExpanded!]: expandedState.includes(getTaskId(task)),
            })
        );
    }, [taskData, expandedState]);

    return (
        <div id="root" className="flex flex-col">
            <h1>Kendo Gantt implementation</h1>

            <Gantt
                style={ganttStyle}
                taskData={processedData}
                taskModelFields={taskModelFields}
                dependencyData={dependencyData}
                dependencyModelFields={dependencyModelFields}
                columns={columns}
                onExpandChange={onExpandChange}
            >
                <GanttDayView />
                <GanttWeekView />
                <GanttMonthView />
            </Gantt>
        </div>
    );
}

/*
- Есть поддержка сортировки по колонкам грида 
*/
