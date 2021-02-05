import { Checkbox, Chip, IconButton, List, ListItem, ListItemIcon, ListItemText, Popover, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import { AccountCircle } from '@material-ui/icons';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../utils/items';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './task.scss';

function Task({ bucketIndex, task, updateTaskStatus, onEditTask, onUpdateCheckList, onDeleteTask }) {

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.CARD,
            taskId: task.taskId,
            bucketIndex: bucketIndex
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    })

    function updateStatus(ev) {
        updateTaskStatus({ bucketIndex: bucketIndex, taskId: task.taskId, updatedTaskStatus: ev.target.checked });
    }

    function updateCheckList(checkList) {
        onUpdateCheckList({ bucketIndex: bucketIndex, taskId: task.taskId, checkList: checkList })
    }

    function editTask() {
        onEditTask({ task, bucketIndex });
    }

    function getDateFormat(dueDate) {
        const date = new Date(dueDate);
        return `${date.getMonth() + 1}/${date.getDate()}`
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    function handleClose() {
        setAnchorEl(null);
    }

    function deleteTask(taskId) {
        onDeleteTask(bucketIndex, taskId)
    }

    return <div className="task" ref={drag} style={{ opacity: isDragging ? '0.5' : '1' }}>

        <div className="task-more-options">
            <IconButton onClick={(e: any) => { setAnchorEl(e.currentTarget); }} color="primary" component="span">
                <MoreHorizIcon />
            </IconButton>

            <Popover id={id}
                open={open}
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
                    <ListItem button onClick={() => { deleteTask(task.taskId) }}>
                        <ListItemText primary="Delete" />
                    </ListItem>
                </List>

            </Popover>
        </div>

        <div className="label" onClick={editTask}>
            {
                task.label.map((d, labelIndex: number) => {
                    return <Chip key={labelIndex} label={d.name} style={{ backgroundColor: d.color }} variant="outlined" />
                })
            }
        </div>

        <div className="d-flex align-items-center">
            <Checkbox color="primary" icon={<RadioButtonUncheckedOutlinedIcon />} checkedIcon={<CheckCircleIcon />} name="taskCheck"
                onChange={updateStatus} checked={task.progress.name == "Completed"} />
            <p onClick={editTask} className="w-100" style={{ textDecoration: task.progress.name == "Completed" ? 'line-through' : 'none' }}>{task.taskName}</p>
        </div>

        {
            task.showCheckListOnCard == true && task.checkList.length > 0 && task.checkList.map((d: any, checkListIndex: number) => {
                return !d.isCompleted ? <div key={checkListIndex} className="d-flex align-items-center">
                    <Checkbox color="primary" icon={<RadioButtonUncheckedOutlinedIcon />} checkedIcon={<CheckCircleIcon />} name={`checklist-${checkListIndex}`}
                        checked={d.completed} onChange={(ev) => {
                            const checkList = task.checkList;
                            checkList[checkListIndex].isCompleted = ev.target.checked;
                            updateCheckList(checkList);
                        }} />
                    <p className="w-100" onClick={editTask}>{d.text}</p>
                </div> : ""
            })
        }

        {
            task.showNotesOnCard == true && task.notes.trim() != "" && <div onClick={editTask}>
                <span className="notes">
                    {task.notes}
                </span>
            </div>
        }

        <div onClick={editTask}>
            {
                task.assignedTo.map((assignedTo: any, taskAssignedToIndex: number) => {
                    return <ListItem key={taskAssignedToIndex} className="pt-0 px-0">
                        <ListItemIcon className="list-item-width">
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary={assignedTo.name} />
                    </ListItem>
                })
            }
        </div>

        <div className="d-flex gap-5">
            {
                task.priority.name != "Medium" && <Tooltip title={task.priority.name}>
                    <span className="d-flex align-items-center" style={{ color: task.priority.color }} onClick={editTask}>
                        {task.priority.icon}
                    </span>
                </Tooltip>
            }

            {
                task.progress.name == "In Progress" && <Tooltip title={task.progress.name}>
                    <span className="d-flex align-items-center" style={{ color: task.progress.color }} onClick={editTask}>
                        {task.progress.icon}
                    </span>
                </Tooltip>
            }

            {
                task.dueDate && task.dueDate != "" && <Tooltip title="Due date">
                    <span className="text-with-icon">
                        <CalendarTodayIcon />{getDateFormat(task.dueDate)}
                    </span>
                </Tooltip>
            }

            {
                task.showCheckListOnCard == true && task.checkList.length > 0 && <Tooltip title={`${task.checkList.filter(d => d.isCompleted).length} of ${task.checkList.length} checklist items complete`}>
                    <span className="text-with-icon">
                        <CheckCircleOutlineIcon />{task.checkList.filter(d => d.isCompleted).length}/{task.checkList.length}
                    </span>
                </Tooltip>
            }
        </div>

    </div >
}

export default Task;