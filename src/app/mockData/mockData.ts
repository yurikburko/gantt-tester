import { GanttDependency } from '@progress/kendo-react-gantt';

export const simpleTasks = [
    {
        id: 1,
        title: 'Task1',
        start: new Date('2025-01-01T00:00:00.000Z'),
        end: new Date('2025-01-03T00:00:00.000Z'),
        completionRatio: 0.5,
        isExpanded: true,
        subtasks: [
            {
                id: 11,
                title: 'Task1_sub1',
                start: new Date('2025-01-01T00:00:00.000Z'),
                end: new Date('2025-01-02T00:00:00.000Z'),
                completionRatio: 0.23,
            },
            {
                id: 12,
                title: 'Task1_sub2',
                start: new Date('2025-01-03T09:00:00.000Z'),
                end: new Date('2025-01-03T18:00:00.000Z'),
                completionRatio: 0.25,
            },
        ],
    },
    {
        id: 2,
        title: 'Task2',
        start: new Date('2025-01-06T00:00:00.000Z'),
        end: new Date('2025-01-10T00:00:00.000Z'),
        completionRatio: 0.5,
        isExpanded: true,
        subtasks: [
            {
                id: 21,
                title: 'Task2_sub1',
                start: new Date('2025-01-06T00:00:00.000Z'),
                end: new Date('2025-01-08T00:00:00.000Z'),
                completionRatio: 0.1,
            },
            {
                id: 22,
                title: 'Task2_sub2',
                start: new Date('2025-01-09T00:00:00.000Z'),
                end: new Date('2025-01-10T00:00:00.000Z'),
                completionRatio: 0.25,
            },
        ],
    },
    {
        id: 3,
        title: 'Task3',
        start: new Date('2025-01-13T00:00:00.000Z'),
        end: new Date('2025-01-17T00:00:00.000Z'),
        completionRatio: 0.5,
        isExpanded: true,
        subtasks: [
            {
                id: 31,
                title: 'Task3_sub1',
                start: new Date('2025-01-13T00:00:00.000Z'),
                end: new Date('2025-01-15T00:00:00.000Z'),
                completionRatio: 0.1,
            },
            {
                id: 32,
                title: 'Task3_sub2',
                start: new Date('2025-01-16T00:00:00.000Z'),
                end: new Date('2025-01-17T00:00:00.000Z'),
                completionRatio: 0.25,
            },
        ],
    },
    {
        id: 4,
        title: 'Task4',
        start: new Date('2025-01-20T00:00:00.000Z'),
        end: new Date('2025-01-24T00:00:00.000Z'),
        completionRatio: 0.5,
        isExpanded: true,
        subtasks: [
            {
                id: 41,
                title: 'Task4_sub1',
                start: new Date('2025-01-20T00:00:00.000Z'),
                end: new Date('2025-01-22T00:00:00.000Z'),
                completionRatio: 0.1,
            },
            {
                id: 42,
                title: 'Task4_sub2',
                start: new Date('2025-01-23T00:00:00.000Z'),
                end: new Date('2025-01-24T00:00:00.000Z'),
                completionRatio: 0.25,
            },
        ],
    },
];

export const simpleTasksFromSample = [
    {
        id: 7,
        title: 'Software validation, research and implementation',
        start: new Date('2014-06-02T00:00:00.000Z'),
        end: new Date('2014-06-19T00:00:00.000Z'),
        completionRatio: 0.45708333333333334,
        isExpanded: true,
        subtasks: [
            {
                id: 18,
                title: 'Project Kickoff',
                start: new Date('2014-06-02T00:00:00.000Z'),
                end: new Date('2014-06-02T00:00:00.000Z'),
                completionRatio: 0.23,
            },
            {
                id: 11,
                title: 'Research',
                start: new Date('2014-06-02T00:00:00.000Z'),
                end: new Date('2014-06-07T00:00:00.000Z'),
                completionRatio: 0.5766666666666667,
                isExpanded: true,
                subtasks: [
                    {
                        id: 19,
                        title: 'Validation with Customers',
                        start: new Date('2014-06-02T00:00:00.000Z'),
                        end: new Date('2014-06-04T00:00:00.000Z'),
                        completionRatio: 0.25,
                    },
                    {
                        id: 39,
                        title: 'Functional and Technical Specification',
                        start: new Date('2014-06-04T00:00:00.000Z'),
                        end: new Date('2014-06-07T00:00:00.000Z'),
                        completionRatio: 0.66,
                    },
                ],
            },
            {
                id: 13,
                title: 'Implementation',
                start: new Date('2014-06-08T00:00:00.000Z'),
                end: new Date('2014-06-19T00:00:00.000Z'),
                completionRatio: 0.77,
                isExpanded: true,
                subtasks: [
                    {
                        id: 24,
                        title: 'Prototype',
                        start: new Date('2014-06-08T00:00:00.000Z'),
                        end: new Date('2014-06-14T00:00:00.000Z'),
                        completionRatio: 0.77,
                    },
                    {
                        id: 29,
                        title: 'UI and Interaction',
                        start: new Date('2014-06-14T00:00:00.000Z'),
                        end: new Date('2014-06-19T00:00:00.000Z'),
                        completionRatio: 0.6,
                    },
                ],
            },
            {
                id: 17,
                title: 'Release',
                start: new Date('2014-06-19T00:00:00.000Z'),
                end: new Date('2014-06-19T00:00:00.000Z'),
                completionRatio: 0,
            },
        ],
    },
];

export const generateTasks = (tasksCount: number) => {
    return [...Array(tasksCount).keys()].map((i) => {
        return {
            id: i,
            title: `Test task ${i}`,
            start: new Date('2014-06-02T00:00:00.000Z'),
            end: new Date('2014-06-19T00:00:00.000Z'),
            completionRatio: 0.45708333333333334,
            isExpanded: true,
        };
    });
};

export const simpleDependencies: GanttDependency[] = [
    {
        id: 528,
        fromId: 18,
        toId: 19,
        type: 1,
    },
    {
        id: 529,
        fromId: 19,
        toId: 39,
        type: 1,
    },
    {
        id: 535,
        fromId: 24,
        toId: 29,
        type: 1,
    },
    {
        id: 551,
        fromId: 13,
        toId: 29,
        type: 0,
    },
    {
        id: 777,
        fromId: 7,
        toId: 11,
        type: 2,
    },
    {
        id: 556,
        fromId: 39,
        toId: 24,
        type: 1,
    },
    {
        id: 546,
        fromId: 29,
        toId: 17,
        type: 1,
    },
];
