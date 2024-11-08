import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { ITaskItem } from "../types/index";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../features/store';
import { deleteExistingTask } from '../features/taskSlice';
import { Button } from '@mui/material';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    margin: "auto",
    borderRadius: 12,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "15px",
    marginBottom: 8,
  },
  pos: {
    fontSize: 10,
    color: "textSecondary",
    marginBottom: 12,
  },
  description: {
    margin: "5px 0",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0px 16px 8px 16px",
  },
  editIcon: {
    fontSize: 20,
    color: "#1976d2",
  },
  deleteIcon: {
    fontSize: 20,
    color: "#d32f2f",
  }
});

// Map statuses to colors
const statusColors: Record<string, string> = {
  "Blocked": "#ff9800",
  "Done": "#4caf50",
  "In QA": "#4caf50",
  "In Progress": "#2196f3",
  "To do": "#eee"
};

interface ExtendedTaskItem extends ITaskItem {
  email?: string
}

const TaskItem: React.FC<ExtendedTaskItem> = ({ id, title, description, status, email }) => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const statusColor = statusColors[status] || "#656565";  // Default color if status is unknown

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = (id: string) => {
    handleClickOpen()
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            ID: {id}
          </Typography>
          <Typography variant="body2" component="p" className={classes.description}>
            {description}
          </Typography>
          <Typography
            className={classes.title}
            style={{ backgroundColor: statusColor }}
            gutterBottom
          >
            {status}
          </Typography>
          {/* Display assignee's email */}
          {email && (
            <Typography variant="body2" color="textSecondary" className={classes.description}>
              {email}
            </Typography>
          )}
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton size="small" aria-label="edit" component={Link} to={`/taskboard/edit/${id}`}>
            <EditOutlined className={classes.editIcon} />
          </IconButton>
          <IconButton size="small" aria-label="delete" onClick={() => handleDelete(id)}>
            <DeleteOutlined className={classes.deleteIcon} />
          </IconButton>
        </CardActions>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure to delete the task?</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            <ReportProblemOutlinedIcon color="secondary" style={{ fontSize: 30 }} />
            This action can delete your task and you cannot restore it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDialog} color="primary" autoFocus>
            No, I'm Not
          </Button>
          <Button variant="contained" onClick={() => {
            dispatch(deleteExistingTask(id as string));
            navigate('/taskboard');
          }} color="secondary">
            Yes, I'm Sure
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem;
