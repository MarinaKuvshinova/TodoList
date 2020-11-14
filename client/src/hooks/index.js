import {useState, useEffect} from 'react';
import moment from 'moment';
import axios from 'axios';
import {collatedTasksExist, sortTasks} from "../helpers";


export const useTasks = (selectedProject, sortType) => {
    const [tasks, setTasks] = useState([]);
    const [archiveTasks, setArchiveTasks] = useState([]);
//вернуть этот метод
    const handleSort = tasks => {
        if (sortType) {
            tasks.sort(sortTasks(sortType.sortBy, sortType.sort));
        }
    };

    const handleTaskAdd = (res) => {
        let unsubscribe = res.data.map(task => ({
            id: task.id,
            ...task.data,
            usersTask: task.usersTask,
        }));

        unsubscribe = unsubscribe.sort(sortTasks('dateCreate'));
        unsubscribe = unsubscribe.sort(sortTasks('important', 'desc'));
        if(selectedProject && !collatedTasksExist(selectedProject)) {
            unsubscribe = unsubscribe.filter(task => task.projectId === selectedProject);
        } else if (selectedProject === 'TODAY') {
            unsubscribe = unsubscribe.filter(task => moment().format("DD/MM/YYYY") === task.date && task.archived !== true);
        } else if (selectedProject === 'INBOX') {
            unsubscribe = unsubscribe.filter(task => !task.date && task.archived !== true)
        } else if (selectedProject === 'NEXT_7'){
            unsubscribe = unsubscribe.filter(task => moment(task.date, 'DD/MM/YYYY').diff(moment(), 'days') <= 7 && moment(task.date, 'DD/MM/YYYY').diff(moment(), 'days') >= 0 && task.archived !== true)
        } else if (selectedProject === 'ARCHIVE'){
            unsubscribe = unsubscribe.filter(task => task.archived === true)
        } else {
            unsubscribe = unsubscribe.filter(task => task.archived !== true)
        }
        handleSort(unsubscribe);
        setTasks(unsubscribe);
        setArchiveTasks(unsubscribe.filter(task => task.archived !== false));
    };

    useEffect(() => {
        axios.post('/tasks')
            .then( res => {
                handleTaskAdd(res);
            })
            .catch(error => console.error(error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProject]);

    return {tasks, archiveTasks, setTasks}
};

export const useProjects = () => {
    const [projects, setProjects] = useState([]);

    // useEffect(() => {
    //     // console.log("projects", projects);
    //     socket.on('project', (project) => {
    //        addProject(projects);
    //         console.log(projects);
    //        //setProjects([...projects, project]);
    //     });
    // },[]);
    // //
    // const addProject = (projects, project) => {
    //     console.log(projects);
    //     //setProjects([...projects, project]);
    //
    // };

    // useEffect((projects) => {
    //     socket.on('project', (project) => {
    //         console.log("project",project);
    //         console.log("projects",projects);
    //
    //         setProjects([...projects, project]);
    //         // addProject(projects, project);
    //     });
    // },[]);

    useEffect(() => {
        axios.post('/projects')
            .then(res => {
                const allProjects = res.data.map(project => ({
                    id: project.id,
                    ...project.data
                }));
                if(JSON.stringify(allProjects) !== JSON.stringify(projects)) {
                    setProjects(allProjects);
                }
            })
            .catch(err => console.error(err));
    }, [projects]);
    return {projects, setProjects};
};

export const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    });
};

export const useUser = () => {
    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        axios.get('/user').then((res) => {
            const newInfo = {...res.data};
            if (JSON.stringify(newInfo) !== JSON.stringify(userInfo)) {
                setUserInfo(newInfo);
            }
        }).catch(err => console.error(err));
        //было [userInfo]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {userInfo, setUserInfo};
};

