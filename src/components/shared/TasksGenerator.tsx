import { generateTasks, simpleTasks } from '@/app/mockData/mockData';
import { Task } from '@/types';
import { Button } from '@progress/kendo-react-buttons';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import React, { FC, useState } from 'react';

type TaskGeneratorProps = {
    onTasksGenerate: (tasks: Task[]) => void;
};

export const TaskGenerator: FC<TaskGeneratorProps> = ({ onTasksGenerate }) => {
    const [testTasksCount, setTestTasksCount] = useState(100);

    const onGenerateTasksClick = () => {
        const testTasks = testTasksCount < 0 ? simpleTasks : generateTasks(testTasksCount);
        onTasksGenerate(testTasks);
    };

    return (
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
    );
};
