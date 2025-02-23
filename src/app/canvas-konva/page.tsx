'use client';

import * as React from 'react'

import { Splitter, SplitterOnChangeEvent } from '@progress/kendo-react-layout';
import { extendDataItem, filterBy, mapTree, orderBy, TreeList, TreeListColumnProps, TreeListDataStateChangeEvent, TreeListExpandChangeEvent, TreeListTextFilter } from '@progress/kendo-react-treelist';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';

interface Task {
    id: number,
    name: string,
    startDate?: Date,
    endDate?: Date,
    children?: Task[],
}

export interface DataState {
    sort?: SortDescriptor[],
    filter?: FilterDescriptor[]
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

export default function Page() {
    // const posts = await getPosts()

    const [panes, setPanes] = React.useState<Array<any>>([
        { size: '20%', min: '20px', collapsible: true },
        {},
    ]);
    const onChange = (event: SplitterOnChangeEvent) => {
        setPanes(event.newState);
    }


    const tasks: Task[] = [
        { 
            id: 1, name: "task1",
            startDate: new Date(2025, 0, 1),
            endDate: new Date(2025, 0, 5),
            children: [{ id: 11, name: "task1_subtask", startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 13) }]
        },
        { id: 2, name: "task2", startDate: new Date(2025, 0, 10), endDate: new Date(2025, 0, 15) },
    ]

    const [state, setState] = React.useState<AppState>({
        data: [...tasks],
        dataState: {
            sort: [{ field: 'name', dir: 'asc' }],
            filter: []
        },
        expanded: [1, 2, 32]
    });
    
    const onExpandChange = (e: TreeListExpandChangeEvent) => {
        setState({
            ...state,
            expanded: e.value ? state.expanded.filter((id) => id !== e.dataItem.id) : [...state.expanded, e.dataItem.id]
        });
    };
    const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
        setState({
            ...state,
            dataState: event.dataState
        });
    };
    
    const addExpandField = (dataTree: Task[]) => {
        const expanded: number[] = state.expanded;
        return mapTree(dataTree, subItemsField, (item) =>
            extendDataItem(item, subItemsField, {
                [expandField]: expanded.includes(item.id)
            })
        );
    };

    const processData = () => {
        const { data, dataState } = state;
        const filteredData: Task[] = filterBy(data, dataState.filter, subItemsField);
        const sortedData: Task[] = orderBy(filteredData, dataState.sort, subItemsField);
        return addExpandField(sortedData);
    };

    return (
        <>
            <Splitter
                style={{ height: '100%' }}
                panes={panes}
                onChange={onChange}
            >
                <TreeList
                    style={{ overflow: 'auto' }}
                    expandField={expandField}
                    subItemsField={subItemsField}
                    onExpandChange={onExpandChange}
                    sortable={{ mode: 'multiple' }}
                    {...state.dataState}
                    data={processData()}
                    onDataStateChange={handleDataStateChange}
                    columns={columns}
                />
                <div>
                    <p>Canvas content?</p>
                </div>
            </Splitter>
        </>
    );
}
