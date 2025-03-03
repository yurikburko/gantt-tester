'use client';

import React, { useCallback } from 'react';
import { Splitter, SplitterOnChangeEvent, SplitterPaneProps } from '@progress/kendo-react-layout';
import {
    extendDataItem,
    filterBy,
    getSelectedState,
    getSelectedStateFromKeyDown,
    mapTree,
    orderBy,
    TreeList,
    TreeListColumnProps,
    TreeListDataStateChangeEvent,
    TreeListExpandChangeEvent,
    TreeListKeyDownEvent,
    TreeListSelectionChangeEvent,
    TreeListTextFilter,
} from '@progress/kendo-react-treelist';
import { FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import dynamic from 'next/dynamic';
import { Task } from '@/types';
import { treeToFlat } from '@progress/kendo-react-treelist';
import { TaskGenerator } from '@/components/shared/TasksGenerator';
import { ROW_HEIGHT } from '@/components/consts';
import { useDivSize } from '@/common/hooks/useBoxSize';

const GanttCanvas = dynamic(() => import('../../components/GanttCanvas'), {
    ssr: false,
});
// const GanttCanvasTest = dynamic(() => import('../../components/GanttCanvasTest'), {
//     ssr: false,
// });

export interface DataState {
    sort?: SortDescriptor[];
    filter?: FilterDescriptor[];
}

interface AppState {
    data: Task[];
    dataState: DataState;
    expanded: number[];
    selected: { [id: string]: number[] | boolean };
}

const dataItemKey: string = 'id';
const subItemsField: string = 'children';
const expandField: string = 'expanded';
const selectedField: string = 'selected';
const columns: TreeListColumnProps[] = [
    { field: 'id', title: 'Id', width: 40 },
    { field: 'name', title: 'Name', width: '250px', filter: TreeListTextFilter, expandable: true },
    { field: 'start', title: 'Start Date', width: '200px', format: '{0:d}' },
    { field: 'end', title: 'End Date', width: '200px', format: '{0:d}' },
];
const defaultSort: SortDescriptor = { field: 'id', dir: 'asc' };

// const tasks2 = [...Array(1000).keys()].map((i) => {
//     return {
//         id: i,
//         name: `Test task ${i}`,
//         start: new Date('2014-06-02T00:00:00.000Z'),
//         end: new Date('2014-06-19T00:00:00.000Z'),
//     };
// });

export default function Page() {
    // const posts = await getPosts()

    // TODO. Finish
    // const [offsetY, setOffsetY] = useState<number>(0);
    // useEffect(() => {
    //     const onTreeListScroll = (e: Event) => {
    //         setOffsetY((e.currentTarget as HTMLDivElement).scrollTop);
    //     };

    //     const kendoTreeList = document.getElementsByClassName('k-treelist-scrollable')[0] as HTMLDivElement;
    //     if (kendoTreeList) {
    //         kendoTreeList.addEventListener('scroll', onTreeListScroll);
    //     }

    //     return () => {
    //         kendoTreeList.removeEventListener('scroll', onTreeListScroll);
    //     };
    // }, []);

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
            start: new Date(2025, 0, 1),
            end: new Date(2025, 0, 5),
            children: [{ id: 11, name: 'task1_subtask', start: new Date(2025, 0, 10), end: new Date(2025, 0, 13) }],
        },
        { id: 2, name: 'task2', start: new Date(2025, 0, 10), end: new Date(2025, 0, 15) },
    ];

    const [state, setState] = React.useState<AppState>({
        data: [...tasks],
        dataState: {
            sort: [defaultSort],
            filter: [],
        },
        expanded: [1, 2, 32],
        selected: {},
    });

    const onExpandChange = (e: TreeListExpandChangeEvent) => {
        setState({
            ...state,
            expanded: e.value
                ? state.expanded.filter((id) => id !== e.dataItem.id)
                : [...state.expanded, e.dataItem.id],
        });
    };

    const onSelectionChange = React.useCallback(
        (event: TreeListSelectionChangeEvent) => {
            const newSelectedState = getSelectedState({
                event,
                selectedState: state.selected,
                dataItemKey: dataItemKey,
            });
            setState({
                ...state,
                selected: newSelectedState,
            });
        },
        [state]
    );

    const onKeyDown = (event: TreeListKeyDownEvent) => {
        const newSelectedState = getSelectedStateFromKeyDown({
            event,
            selectedState: state.selected,
            dataItemKey: dataItemKey,
        });
        setState({
            ...state,
            selected: newSelectedState,
        });
    };

    const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
        setState({
            ...state,
            dataState: event.dataState,
        });
    };

    const extendData = (dataTree: Task[]) => {
        const expanded: number[] = state.expanded;
        const selected: { [id: string]: number[] | boolean } = state.selected;
        return mapTree(dataTree, subItemsField, (item) =>
            extendDataItem(item, subItemsField, {
                [expandField]: expanded.includes(item.id),
                [selectedField]: selected[item.id],
            })
        );
    };

    const processData = () => {
        const { data, dataState } = state;
        const filteredData: Task[] = filterBy(data, dataState.filter || [], subItemsField);
        const sortedData: Task[] = orderBy(filteredData, dataState.sort || [defaultSort], subItemsField);
        return extendData(sortedData);
    };

    const onGenerateTasksClick = useCallback(
        (testTasks: Task[]): void => {
            setState({
                ...state,
                data: testTasks,
            });
        },
        [state]
    );

    const [treeContainerRef, treeBoxHeight] = useDivSize();

    const processedData = processData();
    const flatTasks = treeToFlat(processedData, expandField, subItemsField);

    return (
        <>
            <div id="root" className="flex flex-col">
                <h1>Kendo Gantt implementation</h1>
                <TaskGenerator onTasksGenerate={onGenerateTasksClick}></TaskGenerator>
                <Splitter style={{ height: '100%', overflow: 'hidden' }} panes={panes} onChange={onChange}>
                    <div ref={treeContainerRef} style={{ height: '100%' }}>
                        <TreeList
                            style={{ overflow: 'auto', height: treeBoxHeight }}
                            expandField={expandField}
                            subItemsField={subItemsField}
                            selectedField={selectedField}
                            onExpandChange={onExpandChange}
                            sortable={{ mode: 'multiple' }}
                            {...state.dataState}
                            data={processedData}
                            onDataStateChange={handleDataStateChange}
                            columns={columns}
                            navigatable={true}
                            scrollable="virtual"
                            rowHeight={ROW_HEIGHT}
                            // TODO. Fix expand item by pressing Enter.
                            selectable={{
                                enabled: true,
                                drag: false,
                                cell: false,
                                mode: 'single',
                            }}
                            onSelectionChange={onSelectionChange}
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <GanttCanvas tasks={flatTasks} />
                    {/* <GanttCanvasTest /> */}
                </Splitter>
            </div>
        </>
    );
}
