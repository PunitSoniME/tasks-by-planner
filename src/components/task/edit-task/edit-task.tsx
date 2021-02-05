import React, { useState } from 'react'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, LinearProgress, List, ListItem, ListItemIcon, ListItemText, MenuItem, Modal, Select, TextField } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import { Autocomplete } from '@material-ui/lab';
import { AccountCircle } from '@material-ui/icons';
import { Users, ColorLabels, Priority, Progress } from '../../../utils/items';
import { ITask } from '../../../model/ITask';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import './edit-task.scss'

export default function EditTask({ taskToEdit, open, onClose, buckets, onMakeNewTask }) {

    const [updatedTask, setUpdatedTask] = useState<ITask>({ ...taskToEdit.task, oldBucketIndex: taskToEdit.bucketIndex });
    const [selectedBucket, setSelectedBucket] = useState(buckets[taskToEdit.bucketIndex].bucketId)
    const [checkListItem, setCheckListItem] = useState("");
    const [disableCloseButton, setDisableCloseButton] = useState(false);

    const handleClose = () => {
        onClose({ isSaved: false, updatedTask: null });
    }

    function updateStateValue(propertyName, value) {
        setUpdatedTask((oldValues) => ({
            ...oldValues,
            [propertyName]: value
        }));
    }

    function updateTask() {
        onClose({ isSaved: true, updatedTask: updatedTask });
    }

    function makeNewTask({ text, isCompleted, checkListIndex }) {
        onMakeNewTask({ text, isCompleted, taskId: updatedTask.taskId, bucketIndex: updatedTask.oldBucketIndex });
        deleteCheckListItem(checkListIndex);

        setDisableCloseButton(true);
    }

    function deleteCheckListItem(checkListItemIndex: number) {
        const checkList = updatedTask.checkList;
        checkList.splice(checkListItemIndex, 1);
        setUpdatedTask((oldValues) => ({
            ...oldValues,
            checkList: checkList
        }));
    }

    function generateId() {
        const date = new Date();
        return Number(`${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`)
    }

    return (
        <Modal
            open={open}
            disableBackdropClick={true}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className="custom-modal">
                <div className="modal-body">

                    <div className="d-flex align-items-center">
                        <Checkbox color="primary" icon={<RadioButtonUncheckedOutlinedIcon />} checkedIcon={<CheckCircleIcon />} name="taskCheck"
                            checked={updatedTask.progress.name == "Completed"} onChange={(ev) => {
                                updateStateValue('progress', ev.target.checked == true ?
                                    Progress.find(d => d.name == "Completed") : Progress.find(d => d.name == "Not Completed"))
                            }} />
                        <TextField className="w-100" id="outlined-basic" size="small" defaultValue={updatedTask.taskName} label="Task name" variant="outlined"
                            onChange={(e) => { updateStateValue('taskName', e.currentTarget.value) }} />
                    </div>

                    {/* Assign */}
                    <Autocomplete
                        multiple
                        size="small"
                        limitTags={0}
                        onChange={(event: any, selection: any) => {
                            updateStateValue('assignedTo', selection);
                        }}
                        value={[...updatedTask.assignedTo]}
                        id="combo-box-demo"
                        filterSelectedOptions
                        options={Users}
                        disableCloseOnSelect={true}
                        getOptionLabel={(option: any) => option.name}
                        className="w-100 mt-2"
                        renderInput={(params) => <TextField {...params} label="Assign" variant="outlined" />}
                    />

                    {
                        updatedTask.assignedTo.length > 0 && <List className="py-0 mt-2">
                            {
                                updatedTask.assignedTo.map((d: any, assignedToIndex: number) => {
                                    return <ListItem key={assignedToIndex} className="px-0 pt-0">
                                        <ListItemIcon className="list-item-width">
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText primary={d.name} />
                                    </ListItem>
                                })
                            }
                        </List>
                    }

                    {/* Label */}
                    <Autocomplete
                        multiple
                        size="small"
                        onChange={(event: any, selection: any) => {
                            updateStateValue('label', selection);
                        }}
                        value={[...updatedTask.label]}
                        id="combo-box-demo"
                        options={ColorLabels}
                        disableCloseOnSelect={true}
                        filterSelectedOptions
                        className="w-100 mt-2"
                        getOptionLabel={(option: any) => option.name}
                        renderInput={(params) => <TextField {...params} label="Label" variant="outlined" />}
                    />

                    <Grid container spacing={3} className="mt-2">
                        <Grid item xs={6}>
                            <FormControl className="w-100" variant="outlined">
                                <InputLabel id="bucket-label">Bucket</InputLabel>
                                <Select
                                    labelId="bucket-label"
                                    id="bucket"
                                    value={selectedBucket}
                                    onChange={(e) => {
                                        const bucketIndex = buckets.findIndex(d => d.bucketId == e.target.value);
                                        updateStateValue('newBucketIndex', bucketIndex);
                                        setSelectedBucket(e.target.value);
                                    }}
                                >
                                    {
                                        buckets.map((d: any, bucketIndex: number) => {
                                            return <MenuItem key={bucketIndex} value={d.bucketId}>{d.bucketName}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className="w-100" variant="outlined">
                                <InputLabel id="progress-label">Progress</InputLabel>
                                <Select
                                    className="select-control"
                                    labelId="progress-label"
                                    id="progress"
                                    value={updatedTask.progress.name}
                                    onChange={(e) => {
                                        updateStateValue('progress', Progress.find(d => d.name == e.target.value));
                                    }}
                                >
                                    {
                                        Progress.map((d: any, progressIndex: number) => {
                                            return <MenuItem key={progressIndex} value={d.name} className="d-flex align-items-center gap-10">
                                                <span style={{ color: d.color }}>
                                                    {d.icon}
                                                </span>{d.name}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl className="w-100" variant="outlined">
                                <InputLabel id="priority-label">Priority</InputLabel>
                                <Select
                                    className="select-control"
                                    labelId="priority-label"
                                    id="priority"
                                    value={updatedTask.priority.name}
                                    onChange={(e) => {
                                        updateStateValue('priority', Priority.find(d => d.name == e.target.value));
                                    }}
                                >
                                    {
                                        Priority.map((d: any, priorityIndex: number) => {
                                            return <MenuItem key={priorityIndex} value={d.name} className="d-flex align-items-center gap-10">
                                                <span style={{ color: d.color }}>
                                                    {d.icon}
                                                </span>{d.name}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="date"
                                label="Set start date"
                                type="date"
                                className="w-100"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={updatedTask.startDate}
                                onChange={(e) => updateStateValue('startDate', e.currentTarget.value)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="date"
                                label="Set due date"
                                type="date"
                                className="w-100"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={updatedTask.dueDate}
                                onChange={(e) => updateStateValue('dueDate', e.currentTarget.value)}
                            />
                        </Grid>

                    </Grid>

                    <TextField
                        id="notes"
                        label="Notes"
                        multiline
                        rows={4}
                        className="w-100 mt-2"
                        defaultValue={updatedTask.notes}
                        onChange={(e) => updateStateValue('notes', e.currentTarget.value)}
                        variant="outlined"
                    />

                    {
                        updatedTask.notes.trim() != "" && <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updatedTask.showNotesOnCard}
                                        onChange={(ev) => {
                                            updateStateValue('showNotesOnCard', ev.target.checked);

                                            if (ev.target.checked && updatedTask.showCheckListOnCard) {
                                                updateStateValue('showCheckListOnCard', false)
                                            }
                                        }}
                                        name="show-notes-on-card"
                                        color="primary"
                                    />
                                }
                                label="Show on card"
                            />
                        </FormGroup>
                    }

                    <Grid container spacing={2} className="mt-2">
                        <Grid item xs={3} className="d-flex align-items-center">
                            <h5>Checklist &emsp; {updatedTask.checkList.filter(d => d.isCompleted).length}/{updatedTask.checkList.length} </h5>
                        </Grid>

                        <Grid item xs={5} className="checklist-progress">
                            {
                                updatedTask.checkList.length > 0 && <LinearProgress variant="determinate" value={(updatedTask.checkList.filter(d => d.isCompleted).length / updatedTask.checkList.length) * 100} />
                            }
                        </Grid>

                        <Grid item xs={4} className="d-flex place-content-end">
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updatedTask.showCheckListOnCard}
                                            onChange={(ev) => {
                                                updateStateValue('showCheckListOnCard', ev.target.checked)

                                                if (ev.target.checked && updatedTask.showNotesOnCard) {
                                                    updateStateValue('showNotesOnCard', false)
                                                }
                                            }}
                                            name="show-notes-on-card"
                                            color="primary"
                                        />
                                    }
                                    label="Show on card"
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>

                    <div className="mt-2">

                        {
                            updatedTask.checkList.map((d: any, checkListIndex: number) => {
                                return <Grid container spacing={1} key={generateId() + checkListIndex}>
                                    <Grid item xs={1}>
                                        <Checkbox color="primary" icon={<RadioButtonUncheckedOutlinedIcon />} checkedIcon={<CheckCircleIcon />} name={`checklist-${checkListIndex}`}
                                            checked={d.isCompleted} onChange={(ev) => {
                                                const checkList = updatedTask.checkList;
                                                checkList[checkListIndex].isCompleted = ev.target.checked;
                                                updateStateValue('checkList', checkList);
                                            }} />
                                    </Grid>
                                    <Grid item xs={9} className="d-flex align-items-center">
                                        <TextField className="w-100" id="outlined-basic" size="small" defaultValue={d.text}
                                            onBlur={(ev) => {
                                                const checkList = updatedTask.checkList;
                                                checkList[checkListIndex].text = ev.target.value;
                                                updateStateValue('checkList', checkList);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={(e: any) => { makeNewTask({ text: d.text, isCompleted: d.isCompleted, checkListIndex: checkListIndex }) }} color="primary" component="span">
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                        <IconButton onClick={(e: any) => { deleteCheckListItem(checkListIndex) }} color="primary" component="span">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            })
                        }

                        <div className="d-flex align-items-center">
                            <Checkbox color="primary" icon={<RadioButtonUncheckedOutlinedIcon />} checkedIcon={<CheckCircleIcon />}
                                checked={false} disabled={true} />
                            <TextField className="w-100" id="outlined-basic" value={checkListItem} size="small" label="Add an item" variant="outlined"
                                onChange={(e) => { setCheckListItem(e.currentTarget.value) }}
                                onBlur={(e) => {
                                    if (e.currentTarget.value.trim() != "") {
                                        const checkList = updatedTask.checkList;
                                        checkList.push({ text: e.currentTarget.value, isCompleted: false });
                                        updateStateValue('checkList', checkList);
                                        setCheckListItem("");
                                    }
                                }} />
                        </div>
                    </div>

                    <TextField
                        id="comments"
                        label="Comments"
                        multiline
                        rows={4}
                        className="w-100 mt-2"
                        defaultValue={updatedTask.comments}
                        onChange={(e) => updateStateValue('comments', e.currentTarget.value)}
                        variant="outlined"
                    />

                    <div className="modal-footer mt-2">
                        <div className="footer-buttons">
                            <Button onClick={updateTask} variant="contained" color="primary">Save</Button>
                            <Button onClick={handleClose} variant="contained" color="secondary" className="ml-2"
                                disabled={disableCloseButton}>Close</Button>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>

    )
}
