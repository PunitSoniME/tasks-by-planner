import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Popover, TextField, Typography } from '@material-ui/core';
import React, { createContext, useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Task from '../task/task';
import AddTask from '../task/add-task/add-task';
import { useDrop } from 'react-dnd';
import { ItemTypes, Priority, Progress } from '../../utils/items';
import EditTask from '../task/edit-task/edit-task';
import { ITask } from '../../model/ITask';
import './tasks.scss';

interface IBucket {
    bucketId: number;
    bucketName: string;
    tasks?: Array<ITask>;
    isAddingNewTask?: boolean;
    openPopoverOption?: boolean;
    isBucketNameInEditMode?: boolean;
}

export const CardContext = createContext({
    moveCard: null
});

export default function Tasks() {
    const [buckets, setBuckets] = useState<IBucket[]>([{
        bucketId: 1,
        bucketName: "To do",
        tasks: [],
        isAddingNewTask: false,
        isBucketNameInEditMode: false,
        openPopoverOption: false
    }]);

    const [addingNewBucket, setAddingNewBucket] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [updateBucketName, setUpdateBucketName] = useState(null);
    const [activeBucketToAddTask, setActiveBucketToAddTask] = useState(0)
    const [activeBucketToEditOrDelete, setActiveBucketToEditOrDelete] = useState(-1);

    const [taskToEdit, setTaskToEdit] = useState({ task: null, bucketIndex: -1 })
    const [bucketToRemove, setBucketToRemove] = useState({ bucketIndex: -1, text: null, show: false });

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const notStarted = Progress.find(d => d.name == "Not Started");
    const inProgress = Progress.find(d => d.name == "In Progress");
    const completed = Progress.find(d => d.name == "Completed");

    const TasksBucket = ({ bucketIndex, tasks, isCompletedBlock }) => {
        const [{ isOver }, drop] = useDrop({
            accept: ItemTypes.CARD,
            drop: (item) => {
                const sourceBucketIndex = item["bucketIndex"];
                const targetBucketIndex = bucketIndex;

                if (sourceBucketIndex == targetBucketIndex) {
                    // if (item["isCompleted"] != isCompletedBlock) {
                    const sourceTasks = buckets[sourceBucketIndex].tasks;

                    const indexOfTask = sourceTasks.findIndex(d => d.taskId == item["taskId"]);
                    sourceTasks[indexOfTask].progress = isCompletedBlock ? completed : (sourceTasks[indexOfTask].progress.name == completed.name ? notStarted : sourceTasks[indexOfTask].progress);

                    buckets[sourceBucketIndex].tasks = sourceTasks;
                    setBuckets([...buckets]);

                    // }
                }
                else {
                    const sourceTasks = buckets[sourceBucketIndex].tasks;
                    const targetTasks = buckets[targetBucketIndex].tasks;

                    const indexOfTask = sourceTasks.findIndex(d => d.taskId == item["taskId"]);
                    const taskToMove = sourceTasks.splice(indexOfTask, 1)[0];

                    buckets[sourceBucketIndex].tasks = sourceTasks;

                    taskToMove.progress = isCompletedBlock ? completed : (taskToMove.progress.name == completed.name ? notStarted : taskToMove.progress);
                    targetTasks.push(taskToMove);

                    buckets[targetBucketIndex].tasks = targetTasks;

                    setBuckets([...buckets]);

                }

            },
            collect: monitor => ({
                isOver: !!monitor.isOver()
            })
        })

        return <div ref={drop} className="pending-tasks" style={{ border: isOver ? '3px dashed lightgray' : '' }}>
            {
                isCompletedBlock ?
                    tasks.filter(d => d.progress == completed).map((task: any, taskIndex: number) => {
                        return <Task key={taskIndex} task={task} bucketIndex={bucketIndex} updateTaskStatus={updateTaskStatus}
                            onEditTask={onEditTask} onUpdateCheckList={onUpdateCheckList} onDeleteTask={onDeleteTask} />
                    }) :
                    tasks.filter(d => d.progress != completed).map((task: any, taskIndex: number) => {
                        return <Task key={taskIndex} task={task} bucketIndex={bucketIndex} updateTaskStatus={updateTaskStatus}
                            onEditTask={onEditTask} onUpdateCheckList={onUpdateCheckList} onDeleteTask={onDeleteTask} />
                    })
            }
        </div>
    }

    function onUpdateCheckList({ bucketIndex, taskId, checkList }) {
        const bucket = buckets[bucketIndex];
        const taskIndex = bucket.tasks.findIndex(d => d.taskId == taskId);

        bucket.tasks[taskIndex].checkList = checkList;
        setBuckets([...buckets]);
    }

    function onEditTask({ task, bucketIndex }) {
        setTaskToEdit({ task: task, bucketIndex: bucketIndex });
    }

    function updateTaskStatus({ bucketIndex, taskId, updatedTaskStatus }) {
        const bucket = buckets[bucketIndex];

        const taskIndex = bucket.tasks.findIndex(d => d.taskId == taskId);
        bucket.tasks[taskIndex].progress = updatedTaskStatus ? completed : notStarted;
        setBuckets([...buckets]);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const openBucketOption = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const bucket = buckets[index];
        bucket.openPopoverOption = true;

        buckets[index] = bucket;

        setAnchorEl(event.currentTarget);
        setBuckets([...buckets]);
        setActiveBucketToEditOrDelete(index);
    }

    function generateId() {
        const date = new Date();
        return Number(`${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`)
    }

    function addNewBucket(bucketName: string) {
        if (bucketName.trim() != "") {
            const newBucket: IBucket = {
                bucketId: generateId(),
                bucketName: bucketName,
                isBucketNameInEditMode: false,
                tasks: [],
                isAddingNewTask: false,
                openPopoverOption: false,

            };

            setBuckets([...buckets, newBucket]);
            // this.setState({
            //     buckets: [...this.state.buckets, newBucket],
            //     addingNewBucket: false
            // })
        }
        setAddingNewBucket(false);
        // this.setState({
        //     addingNewBucket: false
        // })
    }

    function editBucketName() {
        const bucket = buckets[activeBucketToEditOrDelete];
        bucket.isBucketNameInEditMode = true;
        bucket.openPopoverOption = false;

        buckets[activeBucketToEditOrDelete] = bucket;

        setBuckets([...buckets]);
        setAnchorEl(null);
        setUpdateBucketName(bucket.bucketName);
    }

    function openBucketDeleteModal() {
        setBucketToRemove({ bucketIndex: activeBucketToEditOrDelete, text: buckets[activeBucketToEditOrDelete].bucketName, show: true })
    }

    function closeUpdateBucketName(index: number) {
        buckets[index].isBucketNameInEditMode = false;
        buckets[index].bucketName = updateBucketName;
        buckets[index].openPopoverOption = false;

        setBuckets([...buckets]);
    }

    function addNewTask(index: number) {
        const bucket = buckets[index];
        bucket.isAddingNewTask = !bucket.isAddingNewTask;

        buckets[index] = bucket;

        setBuckets([...buckets]);
        setAnchorEl(null);
        setActiveBucketToAddTask(index);
    }

    function createTaskInBucket(index: number, newTask: any) {
        newTask.taskId = generateId();
        buckets[index].tasks = [newTask, ...buckets[index].tasks];
        buckets[index].isAddingNewTask = true;

        setBuckets([...buckets]);
        setActiveBucketToAddTask(index);
    }

    function onEditTaskClose({ isSaved, updatedTask }) {
        if (isSaved) {
            if (updatedTask.newBucketIndex == undefined || updatedTask.newBucketIndex == updatedTask.oldBucketIndex) {
                const tasks = buckets[updatedTask.oldBucketIndex].tasks;
                const getTaskIndex = tasks.findIndex((d: ITask) => { return d.taskId == updatedTask.taskId });

                tasks[getTaskIndex] = updatedTask;

                buckets[updatedTask.oldBucketIndex].tasks = tasks;
                setBuckets([...buckets]);
            }
            else {
                const oldBucketTasks = buckets[updatedTask.oldBucketIndex].tasks;
                const newBucketTasks = buckets[updatedTask.newBucketIndex].tasks;

                newBucketTasks.push(updatedTask);
                buckets[updatedTask.newBucketIndex].tasks = newBucketTasks;

                const getTaskIndex = oldBucketTasks.findIndex((d: ITask) => { return d.taskId == updatedTask.taskId });

                oldBucketTasks.splice(getTaskIndex, 1);
                buckets[updatedTask.oldBucketIndex].tasks = oldBucketTasks;

                setBuckets([...buckets]);
            }
            setTaskToEdit({ task: null, bucketIndex: -1 });
        }
        else {
            setTaskToEdit({ task: null, bucketIndex: -1 });
        }
    }

    function onMakeNewTask({ text, isCompleted, taskId, bucketIndex }) {
        const bucket = buckets[bucketIndex];
        const tasks = bucket.tasks;

        tasks.push({
            taskId: generateId(),
            taskName: text,
            startDate: '',
            dueDate: '',
            assignedTo: [],
            progress: Progress.find(d => d.name == "Not Started"),
            label: [],
            priority: Priority.find(d => d.name == "Medium"),
            notes: "",
            showNotesOnCard: false,
            checkList: [],
            showCheckListOnCard: false,
            comments: ""
        });

        buckets[bucketIndex].tasks = tasks;
        setBuckets([...buckets]);

        // const indexOfTask = tasks.findIndex(d => d.taskId == taskId);
        // const checkList = tasks[indexOfTask].checkList;

    }

    function removeBucket(bucketIndex: number) {
        buckets.splice(bucketIndex, 1);
        setBuckets(buckets);
        setBucketToRemove({ bucketIndex: -1, text: null, show: false });
    }

    function onDeleteTask(bucketIndex: number, taskId: number) {
        const bucket = buckets[bucketIndex];
        const tasks = bucket.tasks;

        const indexOfTask = tasks.findIndex(d => d.taskId == taskId);
        tasks.splice(indexOfTask, 1);

        buckets[bucketIndex].tasks = tasks;
        setBuckets([...buckets]);
    }

    return (
        <div className="tasks-main">
            <div className="main-container">
                {
                    buckets.map((bucket, bucketIndex) => {
                        return <div key={bucket.bucketId} className="bucket">

                            {
                                bucket.isBucketNameInEditMode ?
                                    <TextField autoFocus id="edit-bucket" label="Bucket Name" onBlur={() => { closeUpdateBucketName(bucketIndex) }}
                                        size="small" variant="outlined" defaultValue={updateBucketName} onChange={(e) => { setUpdateBucketName(e.currentTarget.value) }} />
                                    :
                                    <div className="bucket-top">
                                        <span>
                                            <b>{bucket.bucketName}</b>
                                        </span>

                                        <div>
                                            <IconButton aria-describedby={id} onClick={(e: any) => { openBucketOption(e, bucketIndex) }} color="primary"
                                                component="span">
                                                <MoreHorizIcon />
                                            </IconButton>

                                            <Popover open={open}
                                                id={id}
                                                anchorEl={anchorEl}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}>
                                                <List style={{ width: 200 }}
                                                    onMouseLeave={handleClose}>
                                                    <ListItem button onClick={() => { editBucketName() }}>
                                                        <ListItemText primary="Rename" />
                                                    </ListItem>
                                                    <ListItem button onClick={() => { openBucketDeleteModal() }}>
                                                        <ListItemText primary="Delete" />
                                                    </ListItem>
                                                </List>

                                            </Popover>
                                        </div>
                                    </div>
                            }

                            <div className="add-new-task-block">
                                <div className="mb-3">
                                    <Button className="w-100 text-transform-none" variant="contained" color="primary"
                                        onClick={() => { addNewTask(bucketIndex) }} startIcon={<AddIcon />}>Add Task</Button>
                                </div>

                                {/* Add New Task Block */}
                                {
                                    bucket.isAddingNewTask && bucketIndex == activeBucketToAddTask &&
                                    <AddTask bucketIndex={bucketIndex} createTaskInBucket={createTaskInBucket} />
                                }

                                {/* Tasks which are still active */}
                                <TasksBucket bucketIndex={bucketIndex} tasks={bucket.tasks} isCompletedBlock={false} />

                                {/* Tasks which are completed */}
                                {
                                    bucket.tasks.find(d => d.progress == completed) && <Accordion>
                                        <AccordionSummary className="according-header-bg-color"
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header">
                                            <Typography>Copmpleted Tasks {bucket.tasks.filter(d => d.progress == completed).length}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className="d-block">
                                            <TasksBucket bucketIndex={bucketIndex} tasks={bucket.tasks} isCompletedBlock={true} />
                                        </AccordionDetails>
                                    </Accordion>
                                }

                            </div>
                        </div>
                    })
                }

                <div style={{ minWidth: 300 }}>
                    {
                        addingNewBucket ?
                            <TextField autoFocus id="new-bucket" label="Bucket Name" onBlur={(e) => { addNewBucket(e.currentTarget.value) }}
                                size="small" variant="outlined" /> :
                            <Button onClick={() => { setAddingNewBucket(true) }} className="btn">Add New Bucket</Button>
                    }

                </div>
            </div>

            {
                taskToEdit.task && <EditTask taskToEdit={taskToEdit} open={taskToEdit.task ? true : false}
                    buckets={buckets.map(d => { return { bucketId: d.bucketId, bucketName: d.bucketName } })} onClose={onEditTaskClose}
                    onMakeNewTask={onMakeNewTask} />
            }

            <div>
                <Dialog
                    open={bucketToRemove.show}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Are you sure ?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You want to remove bucket <b>{bucketToRemove.text}</b>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setBucketToRemove({ bucketIndex: -1, text: null, show: false }) }} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => { removeBucket(bucketToRemove.bucketIndex) }} color="primary" autoFocus>
                            Ok
                     </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div >
    )
}
