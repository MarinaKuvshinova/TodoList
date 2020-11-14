import {collatedTasks} from '../constants';

export const collatedTasksExist = selectedProject => collatedTasks.find(task => task.key === selectedProject);

export const getTitle = (projects, projectId) => projects.find(project => project.id === projectId);

export const getCollatedTitle = (projects, key) => projects.find(project => project.key === key);

export const sortTasks = (key, order = 'asc') => {

    return (a, b) => {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }
        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB || varA === "" || !varA) {
            comparison = 1;
        } else if (varA < varB || varB === "" || !varB) {
            comparison = -1;
        }

        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
};