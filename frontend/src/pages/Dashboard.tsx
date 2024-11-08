import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, selectTasksState } from '../features/taskSlice';
import { AppDispatch } from '../features/store';
import Layout from './Layout';

export const TaskHistory = {
    "To do": "To Do",
    "In Progress": "In Progress",
    "Blocked": "Blocked",
    "In QA": "In QA",
    "Done": "Done",
    "Deployed": "Deployed",
} as const;

type TaskStatus = keyof typeof TaskHistory; // Extracts the keys like 'ToDo', 'InProgress', etc.

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector(selectTasksState);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    // Track task counts per status
    const [taskStatusCounts, setTaskStatusCounts] = useState<{ [key in TaskStatus]: number }>({
        "To do": 0,
        "In Progress": 0,
        "Blocked": 0,
        "In QA": 0,
        "Done": 0,
        "Deployed": 0,
    });

    // Update task counts based on the task data
    useEffect(() => {
        const counts: { [key in TaskStatus]: number } = {
            "To do": 0,
            "In Progress": 0,
            "Blocked": 0,
            "In QA": 0,
            "Done": 0,
            "Deployed": 0,
        };

        tasks.forEach((task) => {
            // Type-safe indexing: ensure task.status is one of TaskStatus keys
            if (TaskHistory[task.status as keyof typeof TaskHistory]) {
                counts[task.status as keyof typeof TaskHistory]++;
            }
        });

        setTaskStatusCounts(counts);
    }, [tasks]);

    // Bar chart data for tasks by status
    const barData = {
        labels: Object.keys(taskStatusCounts),
        datasets: [
            {
                label: 'Tasks by Status',
                data: Object.values(taskStatusCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Layout>
            <div style={{ padding: '20px' }}>

                {/* Bar Chart for Task Status Counts */}
                <div style={{ marginBottom: '40px' }}>
                    <Bar
                        data={barData}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Task Status Distribution',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            return `${tooltipItem.raw} tasks in ${tooltipItem.label}`;
                                        },
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Status',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Task Count',
                                    },
                                    min: 0,
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
