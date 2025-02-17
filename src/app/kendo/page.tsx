'use client';

import React from 'react';
import {
    Gantt,
    GanttWeekView,
    GanttMonthView,
    GanttDayView,
    GanttExpandChangeEvent,
    orderBy,
    mapTree,
    extendDataItem,
    filterBy,
    GanttTaskClickEvent,
    GanttTaskDoubleClickEvent,
    GanttRowDoubleClickEvent,
    GanttAddClickEvent,
    addTask,
    TaskModelFields,
    GanttTaskRemoveClickEvent,
    GanttRemoveDialogStateChangeEvent,
    removeTask,
    GanttDependencyCreateEvent,
    addDependency,
    GanttFormStateChangeEvent,
    updateTask,
    GanttDependency,
    GanttColumnProps,
    GanttForm,
    GanttRemoveDialog,
    GanttColumnResizeEvent,
    GanttColumnReorderEvent,
    GanttYearView,
    GanttColumnMenuFilterChangeEvent,
    GanttSortChangeEvent,
} from '@progress/kendo-react-gantt';
import { generateTasks, simpleDependencies, simpleTasks } from '../mockData/mockData';
import { useLicenseRemover } from './hooks/useLicenseRemover';
import { clone, getter, guid } from '@progress/kendo-react-common';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { WindowProps, WindowPropsContext } from '@progress/kendo-react-dialogs';
import { ColumnMenuDateColumn, ColumnMenuTextColumn } from '@progress/kendo-react-data-tools';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

const ganttStyle = {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
};

const taskModelFields: TaskModelFields = {
    id: 'id',
    start: 'start',
    end: 'end',
    title: 'title',
    percentComplete: 'percentComplete',
    parentId: 'parentId',
    isRollup: 'isRollup',
    isExpanded: 'isExpanded',
    isInEdit: 'isInEdit',
    children: 'subtasks',
    isSelected: 'isSelected',
};
// type of GanttDependencyModelFields, should be type of DependencyModelFields? (is not exported)
const dependencyModelFields = {
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
        // filter: GanttTextFilter,
        columnMenu: ColumnMenuTextColumn,
    },
    {
        field: taskModelFields.start,
        title: 'Start',
        width: 120,
        format: '{0:MM/dd/yyyy}',
        // filter: GanttDateFilter,
        columnMenu: ColumnMenuDateColumn,
    },
    {
        field: taskModelFields.end,
        title: 'End',
        width: 120,
        format: '{0:MM/dd/yyyy}',
        // filter: GanttDateFilter,
        columnMenu: ColumnMenuDateColumn,
    },
];

const getTaskId = getter(taskModelFields.id);

const defaultSort: SortDescriptor[] = [{ field: taskModelFields.id, dir: 'asc' }];

export default function Page() {
    useLicenseRemover();

    const [taskData, setTaskData] = React.useState(simpleTasks);
    const [dependencyData, setDependencyData] = React.useState(simpleDependencies);
    const [expandedState, setExpandedState] = React.useState(() => taskData.map((t) => t.id));
    const [columnsState, setColumnsState] = React.useState<Array<GanttColumnProps>>(columns);
    const onColumnResize = React.useCallback(
        (event: GanttColumnResizeEvent) => event.end && setColumnsState(event.columns),
        [setColumnsState]
    );
    const onColumnReorder = React.useCallback(
        (event: GanttColumnReorderEvent) => setColumnsState(event.columns),
        [setColumnsState]
    );

    const [selectedIdState, setSelectedIdState] = React.useState(null);
    const [editItem, setEditItem] = React.useState(null);
    const [removeItem, setRemoveItem] = React.useState(null);

    const [dataState, setDataState] = React.useState<{
        /**
         * The descriptors that are used for sorting.
         */
        sort?: Array<SortDescriptor>;
        /**
         * The descriptors that are used for filtering.
         */
        filter?: Array<CompositeFilterDescriptor>;
    }>({
        sort: [],
        filter: [],
    });

    const onColumnMenuFilterChange = React.useCallback(
        (event: GanttColumnMenuFilterChangeEvent) => setDataState({ ...dataState, filter: event.filter }),
        [dataState]
    );
    const onSortChange = React.useCallback(
        (event: GanttSortChangeEvent) => setDataState({ ...dataState, sort: event.sort }),
        [dataState]
    );

    // const onDataStateChange = React.useCallback(
    //     (event: GanttDataStateChangeEvent) =>
    //         setDataState({ sort: event.dataState.sort, filter: event.dataState.filter }),
    //     [setDataState]
    // );

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

    const onSelect = React.useCallback(
        (event: GanttTaskClickEvent) => {
            setSelectedIdState(getTaskId(event.dataItem));
        },
        [setSelectedIdState]
    );

    const onEdit = React.useCallback(
        (event: GanttTaskDoubleClickEvent | GanttRowDoubleClickEvent) => setEditItem(clone(event.dataItem)),
        [setEditItem]
    );

    const onAdd = React.useCallback(
        (event: GanttAddClickEvent) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { syntheticEvent, nativeEvent, target, ...others } = event;
            const newData = addTask({
                ...others,
                taskModelFields: taskModelFields,
                dataTree: taskData,
                defaultDataItem: {
                    [taskModelFields.title]: 'New task',
                    [taskModelFields.id]: guid(),
                    [taskModelFields.percentComplete]: 0,
                },
            });

            setTaskData(newData);
        },
        [taskData]
    );

    const onRemove = React.useCallback(
        (event: GanttTaskRemoveClickEvent) => setRemoveItem(event.dataItem),
        [setRemoveItem]
    );

    const removeDeletedItemDependencies = React.useCallback(
        (item: { [x: string]: string | number }) => {
            const newDependencyData = dependencyData.filter((d) => {
                return d.fromId !== item[taskModelFields.id] && d.toId !== item[taskModelFields.id];
            });
            setDependencyData(newDependencyData);
        },
        [dependencyData]
    );

    const onRemoveConfirm = React.useCallback(
        (event: GanttRemoveDialogStateChangeEvent) => {
            const newData = removeTask({
                removedDataItem: event.dataItem,
                taskModelFields: taskModelFields,
                dataTree: taskData,
            });

            setRemoveItem(null);
            setEditItem(null);
            setTaskData(newData);
            removeDeletedItemDependencies(event.dataItem);
        },
        [taskData, setTaskData, setRemoveItem, removeDeletedItemDependencies]
    );
    const onRemoveCancel = React.useCallback(() => setRemoveItem(null), [setRemoveItem]);

    const onDependecyCreate = React.useCallback(
        (event: GanttDependencyCreateEvent) => {
            const newData = addDependency({
                dependencyData,
                fromId: event.fromId,
                toId: event.toId,
                type: event.type,
                dependencyModelFields,
                defaultDataItem: { [dependencyModelFields.id]: guid() },
            });
            setDependencyData(newData);
        },
        [setDependencyData, dependencyData]
    );

    const onFormSubmit = React.useCallback(
        (event: GanttFormStateChangeEvent) => {
            const newData = updateTask({
                updatedDataItem: event.dataItem,
                taskModelFields: taskModelFields,
                dataTree: taskData,
            });

            if (
                event.dataItem.parentId !== event.initialDataItem.parentId &&
                !expandedState.includes(event.dataItem.parentId)
            ) {
                setExpandedState([...expandedState, event.dataItem.parentId]);
            }
            setEditItem(null);
            setTaskData(newData);

            if (event.dependencies && event.dependencies.createdDependencies.length) {
                const newItems = event.dependencies.createdDependencies;

                const newItemsWithId = newItems.map((item: GanttDependency) => {
                    if (item.id === null) {
                        item.id = Math.floor(Math.random() * 1000) + 100;
                    }
                    return item;
                });

                setDependencyData((prevState: GanttDependency[]) => [...prevState, ...newItemsWithId]);
            }

            if (event.dependencies && event.dependencies.updatedDependencies.length) {
                const updatedItems = event.dependencies.updatedDependencies;

                const updatedArray = [...dependencyData];

                updatedItems.forEach((dependency: GanttDependency) => {
                    const positionIndex = dependencyData.findIndex((dep: GanttDependency) => dep.id === dependency.id);

                    if (positionIndex > -1) {
                        updatedArray.splice(positionIndex, 1, dependency);
                    }
                });

                setDependencyData(updatedArray);
            }

            if (event.dependencies && event.dependencies.deletedDependencies.length) {
                const deletedItems = event.dependencies.deletedDependencies;

                const filteredDeletedItems = dependencyData.filter(
                    (item: GanttDependency) =>
                        !deletedItems.find((deletedItem: GanttDependency) => item.id === deletedItem.id)
                );

                setDependencyData(filteredDeletedItems);
            }
        },
        [taskData, expandedState, dependencyData]
    );
    const onFormCancel = React.useCallback(() => setEditItem(null), [setEditItem]);
    const onFormDelete = React.useCallback((event: GanttRemoveDialogStateChangeEvent) => {
        setRemoveItem(event.dataItem);
    }, []);

    const processedData = React.useMemo(() => {
        const filteredData = filterBy(taskData, dataState.filter || [], taskModelFields.children);

        const sortedFilteredData = orderBy(filteredData, defaultSort, taskModelFields.children);

        return mapTree(sortedFilteredData, taskModelFields.children, (task) =>
            extendDataItem(task, taskModelFields.children, {
                [taskModelFields.isExpanded]: expandedState.includes(getTaskId(task)),
                [taskModelFields.isSelected]: selectedIdState === getTaskId(task),
            })
        );
    }, [taskData, expandedState, dataState, selectedIdState]);

    const [testTasksCount, setTestTasksCount] = React.useState(100);
    const onGenerateTasksClick = () => {
        const testTasks = generateTasks(testTasksCount);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTaskData(testTasks as any[]);
        setDependencyData([]);
    };

    return (
        <div id="root" className="flex flex-col">
            <h1>Kendo Gantt implementation</h1>

            <div className="flex" style={{ alignItems: 'center', gap: '8px' }}>
                <span>Tasks count</span>
                <NumericTextBox
                    placeholder="Please enter tasks count"
                    defaultValue={100}
                    width={100}
                    value={testTasksCount}
                    onChange={(e) => setTestTasksCount(e.target.value ?? 0)}
                />
                <Button onClick={onGenerateTasksClick}>Generate tasks</Button>
            </div>

            <Gantt
                style={ganttStyle}
                taskData={processedData}
                taskModelFields={taskModelFields}
                dependencyData={dependencyData}
                dependencyModelFields={dependencyModelFields}
                columns={columnsState}
                // Works with bugs
                resizable={true}
                reorderable={true}
                // filter={dataState.filter}
                columnMenuFilter={dataState.filter}
                onColumnMenuFilterChange={onColumnMenuFilterChange}
                sort={dataState.sort}
                onSortChange={onSortChange}
                navigatable={true}
                onColumnResize={onColumnResize}
                onColumnReorder={onColumnReorder}
                onExpandChange={onExpandChange}
                // onDataStateChange={onDataStateChange}
                toolbar={{ addTaskButton: true }}
                onAddClick={onAdd}
                onTaskClick={onSelect}
                onRowClick={onSelect}
                onTaskDoubleClick={onEdit}
                onRowDoubleClick={onEdit}
                onTaskRemoveClick={onRemove}
                onDependencyCreate={onDependecyCreate}
                defaultView="week"
            >
                <GanttDayView />
                <GanttWeekView />
                <GanttMonthView />
                <GanttYearView />
            </Gantt>

            {editItem && (
                <WindowPropsContext.Provider
                    value={(props: WindowProps) => {
                        return { ...props };
                    }}
                >
                    <GanttForm
                        dataItem={editItem}
                        taskData={processedData}
                        dependencyData={dependencyData}
                        onSubmit={onFormSubmit}
                        onCancel={onFormCancel}
                        onDelete={onFormDelete}
                        onClose={onFormCancel}
                    />
                </WindowPropsContext.Provider>
            )}
            {removeItem && (
                <GanttRemoveDialog
                    dataItem={removeItem}
                    onConfirm={onRemoveConfirm}
                    onCancel={onRemoveCancel}
                    onClose={onRemoveCancel}
                />
            )}
        </div>
    );
}

/*
Плюсы:
- Есть поддержка сортировки по колонкам грида
- Есть поддержка фильтров на уровне колонок в гриде
- Ресайз и реордер колонок (ресайз работает с багами)
Минусы:
- 
*/
