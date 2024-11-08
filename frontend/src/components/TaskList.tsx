import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { IFilterTask } from '../types/index';
import TaskItem from './TaskItem';
import { TaskHistory } from '../consts/index';
import filterTasks from '../utils/filter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../features/store';
import { fetchTasks, selectTasksState } from '../features/taskSlice';
import { fetchUsers, selectUserState } from '../features/userSlice';

const FilterContainer = styled(Paper)({
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    maxWidth: '500px',
    margin: '0 auto',
});

const Select = styled('select')({
    border: 'none',
    background: 'transparent',
    fontSize: 16,
    color: '#656565',
    outline: 'none',
    padding: '4px 8px',
});

const ColumnContainer = styled(Grid)({
    padding: '16px',
    borderRight: '1px solid #ddd',
    minHeight: '70vh',
    '&:last-child': {
        borderRight: 'none',
    },
});

const TasksList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector(selectTasksState);
    const { users } = useSelector(selectUserState);

    const taskObjs = useMemo(() => tasks.map(task => ({ ...task, email: users.find(user => parseInt(user?.id) == task?.owner_id)?.email })), [tasks, users])

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchUsers());
    }, [dispatch]);

    const [textFilter, setTextFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filter: IFilterTask = { text: textFilter, status: statusFilter };

    const handleTextFilter = (e: FormEvent) => {
        setTextFilter((e.target as HTMLInputElement).value);
    };

    const handleSelectFilter = (e: FormEvent) => {
        setStatusFilter((e.target as HTMLSelectElement).value);
    };

    const handleViewOfFilterDropDown = (): string[] => {
        return Object.values(TaskHistory).filter(value => typeof value === 'string');
    };

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ textAlign: 'center', my: 2, maxWidth: 500, mx: 'auto' }}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            <Button
                size="small"
                variant="contained"
                component={Link}
                to="/taskboard/create"
                color="primary"
                sx={{ mb: 2 }}
            >
                Create a New Task
            </Button>

            <FilterContainer as="form">
                <InputBase
                    onChange={handleTextFilter}
                    placeholder="Type to Filter Tasks"
                    style={{ flex: 1 }}
                />
                <Divider orientation="vertical" sx={{ height: 28, mx: 1 }} />
                <Select onChange={handleSelectFilter}>
                    <option>All</option>
                    {handleViewOfFilterDropDown().map((status, index) => (
                        <option key={index}>{status}</option>
                    ))}
                </Select>
            </FilterContainer>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                {Object.values(TaskHistory)
                    .filter((status) => statusFilter === 'All' || status === statusFilter)
                    .map((status) => (
                        <ColumnContainer item xs={12} sm={6} md={4} lg={2} key={status}>
                            <Typography variant="h6" align="center" gutterBottom>
                                {status}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2} direction="column">
                                {filterTasks(taskObjs, { ...filter, status }).map((task, index) => (
                                    <Grid item key={index}>
                                        <TaskItem {...task} />
                                    </Grid>
                                ))}
                            </Grid>
                        </ColumnContainer>
                    ))}
            </Grid>

            {tasks.length === 0 && (
                <Typography variant="h6" component="p" align="center" sx={{ mt: 2 }}>
                    You Have Nothing to Do <br />
                    Go and Get Some Sleep <br />
                </Typography>
            )}
        </>
    );
};

export default TasksList;
