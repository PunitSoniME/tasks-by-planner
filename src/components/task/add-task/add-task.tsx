import { TextField, List, ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { Component, useState } from 'react'
import { ITask } from '../../../model/ITask';
import { Priority, Progress, Users } from '../../../utils/items';
import './add-task.scss';

interface IProps {
    bucketIndex: number;
    createTaskInBucket: Function;
}

interface IState extends ITask {
    // taskName: string;
    // dueDate: Date | any;
    // assignedTo: Array<any>,
    // isCompleted: boolean
}

export default class AddTask extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            taskId: null,
            taskName: '',
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
        };
    }

    createTask(bucketIndex: number) {
        this.props.createTaskInBucket(bucketIndex, this.state);
        this.setState({
            taskId: null,
            taskName: '',
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
    }

    render() {

        return (
            <div className="add-new-task">
                <TextField autoFocus id="add-task" label="Enter a task name"
                    size="small" variant="outlined" value={this.state.taskName} onChange={(e) => { this.setState({ taskName: e.currentTarget.value }) }} />

                <TextField
                    id="date"
                    label="Set due date"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={this.state.dueDate}
                    onChange={(e) => this.setState({ dueDate: e.currentTarget.value })}
                />

                <Autocomplete
                    multiple
                    size="small"
                    limitTags={0}
                    onChange={(event: any, selection: any) => {
                        this.setState({
                            assignedTo: selection
                        })
                    }}
                    value={this.state.assignedTo}
                    id="combo-box-demo"
                    options={Users}
                    filterSelectedOptions
                    disableCloseOnSelect={true}
                    getOptionLabel={(option: any) => option.name}
                    className="w-100"
                    renderInput={(params) => <TextField {...params} label="Assign" variant="outlined" />}
                />

                {
                    this.state.assignedTo.length > 0 && <List className="py-0">
                        {
                            this.state.assignedTo.map((d: any, assignedToIndex: number) => {
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

                <Button className="w-100 text-transform-none" variant="contained" color="primary" disabled={this.state.taskName.trim() == ""}
                    onClick={() => { this.createTask(this.props.bucketIndex) }}>Add Task</Button>

            </div>
        )
    }
}
