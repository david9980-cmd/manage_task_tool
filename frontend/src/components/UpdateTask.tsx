import React from "react";
import { useNavigate, useParams } from "react-router-dom"
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { makeStyles, createStyles } from '@mui/styles';

import { globalStyles } from "../styles/globalStyles"
import TaskForm from "./TaskForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../features/store";
import { selectTasksState, updateExistingTask } from "../features/taskSlice";
import Layout from "../pages/Layout";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
        },

        horizontalDivider: {
            marginTop: 15,
            marginBottom: 30,
        },
        floatRight: {
            float: "right",
        }
    }),
);

const UpdateTask: React.FC = () => {

    const classes = useStyles();
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();

    const dispatch = useDispatch<AppDispatch>();

    const { tasks } = useSelector(selectTasksState)

    const selectedTask = tasks.find((task) => task.id == id)

    return (
        <Layout>
            <Grid container justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>

                    <h1> Edit Task </h1>

                    <Divider className={classes.horizontalDivider} />

                    <TaskForm
                        task={selectedTask}
                        onSubmit={(task) => {
                            dispatch(updateExistingTask(task));
                            navigate('/taskboard');
                        }}
                    />
                </Grid>
            </Grid>
        </Layout>
    )
}

export default UpdateTask;