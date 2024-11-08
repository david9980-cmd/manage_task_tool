import React, { FormEvent, useState } from "react";
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { makeStyles, createStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/lab/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { ITaskItem } from "../types/index";
import { TaskFormMode, TaskHistory } from "../consts/index";
import useTaskHistory from "../hooks/useTaskHistory";
import { useSelector } from "react-redux";
import { selectUserState } from "../features/userSlice";

// Sample employee list (In practice, this could come from an API)
const employeeList = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Emily Johnson' },
  { id: '4', name: 'Michael Brown' },
];

const useStyles = makeStyles((theme: any) =>
  createStyles({
    input: {
      marginBottom: 20,
    },
    select: {
      border: 0,
      fontSize: 16,
      color: "#000",
      display: "block",
      width: "100%",
      borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
      marginBottom: 20,
      paddingBottom: 5,
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    submitButton: {
      width: '40%',
      marginTop: 10,
    },
    cancelButton: {
      width: '40%',
      marginTop: 10,
      backgroundColor: '#f44336', // red background for cancel button
    },
    formContainer: {
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    floatRight: {
      float: "right",
    },
  })
);

interface IComponentProps {
  task?: ITaskItem | undefined;
  onSubmit: (task: ITaskItem) => void;
}

const TaskForm: React.FC<IComponentProps> = (props) => {
  const classes = useStyles();
  const { users } = useSelector(selectUserState)

  const [error, setError] = useState('');
  const [mode] = useState(props.task ? 'edit' : 'create');

  const [id] = useState(props.task ? props.task.id : '');
  const [title, setTitle] = useState(props.task ? props.task.title : '');
  const [description, setDescription] = useState(props.task ? props.task.description : '');
  const [status, setStatus] = useState(props.task ? props.task.status : TaskHistory.Todo);
  const [assignedUser, setAssignedUser] = useState<number | undefined>(props.task?.owner_id);

  const taskHistoryBasedStatus = useTaskHistory(status);

  const onTitleChange = (e: FormEvent) => {
    const title = (e.target as HTMLInputElement).value;
    setTitle(title);
  };

  const onDescriptionChange = (e: FormEvent) => {
    const description = (e.target as HTMLTextAreaElement).value;
    setDescription(description);
  };

  const onStatusChange = (e: FormEvent) => {
    const status = (e.target as HTMLSelectElement).value;
    setStatus(status);
  };

  const onUserChange = (e: FormEvent) => {
    const userId = (e.target as HTMLSelectElement).value;
    setAssignedUser(parseInt(userId)); // Set the assigned user
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "" || description.trim() === "" || assignedUser?.toString()?.trim() === "") {
      setError("Please fill Title, Description and select an assignee.");
    } else {
      setError("");

      if (mode === TaskFormMode.Create) {
        props.onSubmit({
          id: nanoid(8),
          title,
          description,
          status,
          owner_id: assignedUser,
        });
      } else {
        props.onSubmit({
          id,
          title,
          description,
          status,
          owner_id: assignedUser,
        });
      }
    }
  };

  return (
    <div className={classes.formContainer}>
      {error && (
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError("");
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <form onSubmit={submitHandler}>
        <TextField
          fullWidth
          placeholder="Title"
          value={title}
          onChange={onTitleChange}
          className={classes.input}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Description"
          value={description}
          onChange={onDescriptionChange}
          className={classes.input}
        />

        {mode === TaskFormMode.Edit && (
          <select value={status} onChange={onStatusChange} className={classes.select}>
            {taskHistoryBasedStatus.map((status: string, index) => (
              <option key={index}>{status}</option>
            ))}
          </select>
        )}

        <select value={assignedUser} onChange={onUserChange} className={classes.select}>
          <option value="">Select Employee</option>
          {users.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.email}
            </option>
          ))}
        </select>

        <div className={classes.buttonGroup}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submitButton}
          >
            {mode === TaskFormMode.Create ? 'Create Task' : 'Edit Task'}
          </Button>

          <Button
            size="small"
            variant="contained"
            component={Link}
            to={"/taskboard"}
            className={`${classes.floatRight} ${classes.cancelButton}`}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
