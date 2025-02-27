'use client';

import * as React from 'react';
import { Splitter, SplitterOnChangeEvent, SplitterPaneProps } from '@progress/kendo-react-layout';
import {
    extendDataItem,
    filterBy,
    mapTree,
    orderBy,
    TreeList,
    TreeListColumnProps,
    TreeListDataStateChangeEvent,
    TreeListExpandChangeEvent,
    TreeListTextFilter,
} from '@progress/kendo-react-treelist';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import dynamic from 'next/dynamic';
import { Task } from '@/types';
import { treeToFlat } from '@progress/kendo-react-treelist';

const GanttCanvas = dynamic(() => import('../../components/GanttCanvas'), {
    ssr: false,
});
const GanttCanvasTest = dynamic(() => import('../../components/GanttCanvasTest'), {
    ssr: false,
});

export interface DataState {
    sort?: SortDescriptor[];
    filter?: FilterDescriptor[];
}
interface AppState {
    data: Task[];
    dataState: DataState;
    expanded: number[];
}

const subItemsField: string = 'children';
const expandField: string = 'expanded';
const columns: TreeListColumnProps[] = [
    { field: 'name', title: 'Name', width: '250px', filter: TreeListTextFilter, expandable: true },
    { field: 'startDate', title: 'Start Date', width: '200px', format: '{0:d}' },
    { field: 'endDate', title: 'End Date', width: '200px', format: '{0:d}' },
];
const defaultSort: SortDescriptor = { field: 'name', dir: 'asc' };

const tasks2 = [...Array(1000).keys()].map((i) => {
    return {
        id: i,
        name: `Test task ${i}`,
        start: new Date('2014-06-02T00:00:00.000Z'),
        end: new Date('2014-06-19T00:00:00.000Z'),
    };
});

export default function Page() {
    // const posts = await getPosts()

    const [panes, setPanes] = React.useState<Array<SplitterPaneProps>>([
        { size: '20%', min: '20px', collapsible: true },
        {},
    ]);
    const onChange = (event: SplitterOnChangeEvent) => {
        setPanes(event.newState);
    };

    const tasks: Task[] = [
        {
            id: 1,
            name: 'task1',
            startDate: new Date(2025, 0, 1),
            endDate: new Date(2025, 0, 5),
            children: [
                { id: 11, name: 'task1_subtask', startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 13) },
            ],
        },
        { id: 2, name: 'task2', startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
    ];

    const [state, setState] = React.useState<AppState>({
        data: [...tasks],
        dataState: {
            sort: [defaultSort],
            filter: [],
        },
        expanded: [1, 2, 32],
    });

    const onExpandChange = (e: TreeListExpandChangeEvent) => {
        setState({
            ...state,
            expanded: e.value
                ? state.expanded.filter((id) => id !== e.dataItem.id)
                : [...state.expanded, e.dataItem.id],
        });
    };
    const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
        setState({
            ...state,
            dataState: event.dataState,
        });
    };

    const addExpandField = (dataTree: Task[]) => {
        const expanded: number[] = state.expanded;
        return mapTree(dataTree, subItemsField, (item) =>
            extendDataItem(item, subItemsField, {
                [expandField]: expanded.includes(item.id),
            })
        );
    };

    const processData = () => {
        const { data, dataState } = state;
        const filteredData: Task[] = filterBy(data, dataState.filter || [], subItemsField);
        const sortedData: Task[] = orderBy(filteredData, dataState.sort || [defaultSort], subItemsField);
        return addExpandField(sortedData);
    };

    const processedData = processData();
    const flatTasks = treeToFlat(processedData, expandField, subItemsField);

    return (
        <>
            <Splitter style={{ height: '100%' }} panes={panes} onChange={onChange}>
                <TreeList
                    style={{ overflow: 'auto' }}
                    expandField={expandField}
                    subItemsField={subItemsField}
                    onExpandChange={onExpandChange}
                    sortable={{ mode: 'multiple' }}
                    {...state.dataState}
                    data={processedData}
                    onDataStateChange={handleDataStateChange}
                    columns={columns}
                />
                <GanttCanvas tasks={flatTasks} />
            </Splitter>
        </>
    );
}
