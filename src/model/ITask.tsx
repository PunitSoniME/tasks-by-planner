export interface ITask {
    taskId: number;
    taskName: string;
    assignedTo?: any[],
    startDate?: Date | any;
    dueDate?: Date | any;
    label?: Array<ILabel>;
    progress?: IProgress;
    priority?: IPriority;

    notes?: string;
    showNotesOnCard: boolean;

    checkList: Array<CheckList>;
    showCheckListOnCard: boolean;

    oldBucketIndex?: number;
    newBucketIndex?: number;    //  this property will be used to move task to another bucket

    comments?: string;
}

export interface ILabel {
    name: string;
    color: string;
}

export interface CheckList {
    text: string;
    isCompleted: boolean;
}

export interface IPriority {
    name: string;
    icon: JSX.Element;
    color: string;
}

export interface IProgress extends IPriority {

}
