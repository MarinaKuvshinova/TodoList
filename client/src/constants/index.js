import moment from "moment";

export const collatedTasks = [
    {key: 'INBOX', name: 'Inbox'},
    {key: 'TODAY', name: 'Today'},
    {key: 'NEXT_7', name: 'Next 7 Days'},
    {key: 'ARCHIVE', name: 'Archive'}
];

export const sortingOptions = [
    {value: 'A-Z', label: 'A-Z', sort: 'asc', sortBy: 'task'},
    {value: 'Z-A', label: 'Z-A', sort: 'desc', sortBy: 'task'},
    {value: `2000-${moment().format("YYYY")}`, label: `2000-${moment().format("YYYY")}`, sort: 'desc', sortBy: 'date'},
    {value: `${moment().format("YYYY")}-2000`, label: `${moment().format("YYYY")}-2000`, sort: 'asc', sortBy: 'date'},
];