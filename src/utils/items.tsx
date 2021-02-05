import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export const ItemTypes = {
    CARD: 'card'
}

export const Users = [
    { name: 'Punit Soni' },
    { name: 'Hardik Joshi' },
    { name: 'Ajay Modi' },
    { name: 'Suresh Patel' },
    { name: 'John Cena' },
    { name: 'Jeff Hardy' },
]

export const ColorLabels = [
    {
        name: "Pink",
        color: "#FDB0C0"
    },
    {
        name: "Red",
        color: "#FF073A"
    },
    {
        name: "Yellow",
        color: "#FFAB0F"
    },
    {
        name: "Green",
        color: "#048243"
    },
    {
        name: "Blue",
        color: "#247AFD"
    },
    {
        name: "Purple",
        color: "#BE03FD"
    }
]

export const Priority = [
    { name: "Urgent", icon: <NotificationsActiveIcon />, color: "#FF073A" },
    { name: "Important", icon: <PriorityHighIcon />, color: "#FF073A" },
    { name: "Medium", icon: <FiberManualRecordIcon />, color: "#048243" },
    { name: "Low", icon: <ArrowDownwardIcon />, color: "#247AFD" },
]

export const Progress = [
    { name: "Not Started", icon: <RadioButtonUncheckedIcon />, color: "lightgray" },
    { name: "In Progress", icon: <RadioButtonCheckedIcon />, color: "#048243" },
    { name: "Completed", icon: <CheckCircleIcon />, color: "#048243" },
]