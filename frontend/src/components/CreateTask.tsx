import React from "react";
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { makeStyles, createStyles } from '@mui/styles';

import TaskForm from "./TaskForm"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../features/store";
import { useNavigate } from "react-router-dom";
import { addNewTask } from "../features/taskSlice";
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
    }),
);

const CreateTask: React.FC = () => {

    const classes = useStyles();
    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>();

    return (
        <Layout>
            <Grid container justifyContent="center" alignItems="center">
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>

                    <h1 data-testid="headerH1">Create Task</h1>

                    <Divider className={classes.horizontalDivider} />

                    <TaskForm
                        onSubmit={(task) => {
                            dispatch(addNewTask(task));
                            navigate('/taskboard');
                        }}
                    />
                </Grid>
            </Grid>
        </Layout>
    )
}

export default CreateTask
