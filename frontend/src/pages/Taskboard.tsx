import React from 'react';
import TasksList from "../components/TaskList";
import { globalStyles } from "../styles/globalStyles"
import Layout from './Layout';


const TaskBoard: React.FC = () => {

    const classes = globalStyles();


    return (
        <Layout>
            <main className={classes.content}>
                <div className={classes.drawerHeader} />
                <TasksList />
            </main>
        </Layout>
    )
};

export default TaskBoard;