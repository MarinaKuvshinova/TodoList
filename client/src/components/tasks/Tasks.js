import React, {useEffect, useRef, useState} from "react";
import {useOutsideClick, useTasks} from "../../hooks";
import {collatedTasks} from "../../constants";
import {getTitle, getCollatedTitle, collatedTasksExist, sortTasks} from "../../helpers";
import {useSelectedProjectValue, useProjectsValue} from "../../context";
import {AddTask} from "./AddTask";
import {HeaderTop} from "../layout/HeaderTop";
import {ArchiveTask} from './ArchiveTask';
import Select from 'react-select';
import {sortingOptions} from '../../constants';
import {FaFrown, FaUserPlus, FaComments} from "react-icons/fa";
import {Task} from "./Task";
import {UsersOverlay} from "./UsersOverlay";
import socket from "../../socket";
import jwtDecode from "jwt-decode";
import {Chat} from "../chat/Chat";


export const Tasks = () => {
    const {selectedProject} = useSelectedProjectValue();
    const {projects} = useProjectsValue();
    const [sortType, setSortType] = useState();
    const {tasks, setTasks} = useTasks(selectedProject, sortType);
    const [archived, setArchived] = useState(false);
    const refInfo = useRef();
    const refChat = useRef();
    const [showUsersOverlay, setShowUsersOverlay] = useState(false);
    const [showChat, setShowChat] = useState(false);

    let projectName = '';
    let sortFilter = sortingOptions;

    if (collatedTasksExist(selectedProject) && selectedProject) {
        projectName = getCollatedTitle(collatedTasks, selectedProject).name;
    }

    if (projects.length > 0 && selectedProject && !collatedTasksExist(selectedProject)) {
        if (!getTitle(projects, selectedProject)) {
            localStorage.setItem("selectedProject", 'INBOX')
        }
        else {
            projectName = getTitle(projects, selectedProject).name;
        }
    }

    if (collatedTasksExist(selectedProject)) {
        sortFilter = sortingOptions.filter(a => a.sortBy!=='date');
    }



    useEffect(() => {
        // socket.on('check', (id) => {
        //     handelChangArchive(id)
        // });
        // console.log(tasks);
        //  socket.on("add task", task => {
        //      //setTasks([...tasks, task]);
        //      console.log("tasks", task);
        //  });
        // console.log("tasks before", tasks);
        //  socket.on('add', (task) => {
        //      // if (JSON.stringify(task)!== JSON.stringify(taskProject)) {
        //      //     handelCreateTask(task);
        //      //     setTaskProject(task);
        //      // }
        //      ///new
        //      console.log("tasks before", tasks);
        //      console.log("task", task);
        //      console.log("tasks", tasks);
        //      handelCreateTask(task);
        //  });


        socket.on('add', (task) => {
            const token = localStorage.getItem("FBIdToken");
            const decodedToken = jwtDecode(token);
            if (task.usersTask.length > 1 && task.usersTask.filter(e => e.id === decodedToken.user_id))
                handelCreateTask(task);
        });
        socket.on('check', id => {
            handelChangArchive(id);
        });
        return () => socket.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        document.title = `CUBE: ${projectName}`;
    }, [archived, projectName, sortType]);




    const handelChangArchive = id => {
        setTasks((tasks) =>  {
            tasks.filter(res => res.id === id).map(res => res.archived = true);
            return [...tasks];
        });
        setArchived(!archived);
    };

    const handelCreateTask = newTask => {
        setTasks((tasks) => [...tasks, newTask]);
        setArchived(!archived);
    };

    const handelDeleteTask = taskId => {
        setTasks([...tasks.filter(res => res.id !== taskId)]);
        setArchived(!archived);
    };

    const handleSort = valueSort => {
        setSortType(valueSort);
        tasks.sort(sortTasks(valueSort.sortBy ,valueSort.sort));
    };

    useOutsideClick(refInfo, () => {
        if (showUsersOverlay) setShowUsersOverlay(false);
    });

    useOutsideClick(refChat, () => {
        if (showChat) setShowChat(false);
    });

    return (
        <div className="tasks">
            <HeaderTop projectName={projectName} showAddTask={!collatedTasksExist(selectedProject)} handelCreateTask={handelCreateTask} />
            {
                    tasks.length > 0  ?
                            <>
                                <div className="tasks__row-header">
                                    {
                                        !collatedTasksExist(selectedProject) &&
                                        (
                                            <>
                                                <span ref={refInfo} className={showUsersOverlay ? "active" : undefined}>
                                                    <span className="add-task__user"
                                                          onClick={() => setShowUsersOverlay(!showUsersOverlay)}
                                                    >
                                                        <FaUserPlus/>
                                                    </span>
                                                    <UsersOverlay setShowUsersOverlay={setShowUsersOverlay} showUsersOverlay={showUsersOverlay}/>
                                                </span>
                                                <span ref={refChat} className={showChat ? "active chat" : "chat"} >
                                                    <span className="chat__ico"
                                                          onClick={() => setShowChat(!showChat)}
                                                    >
                                                        <FaComments/>
                                                    </span>
                                                    <Chat setShowChat={setShowChat} showChat={showChat}/>
                                                </span>
                                            </>
                                        )
                                    }
                                    <div className="tasks__sort">
                                        <span className="tasks__sort-title">Sort by:</span>
                                        <Select onChange={handleSort}
                                                options={sortFilter}
                                        />
                                    </div>
                                </div>
                                <ul className="tasks__list">
                                    {
                                        selectedProject === 'ARCHIVE' ?
                                            tasks.map(task => task.archived && (
                                                <li key={`${task.id}`}>
                                                    <ArchiveTask task={task} handelDeleteTask = {handelDeleteTask}/>
                                                </li>
                                            )) :
                                            tasks.map(task => {
                                                return !task.archived ? (
                                                    <Task key={`${task.id}`} task={task} handelChangArchive = {handelChangArchive} />
                                                ) : (
                                                    <li className="tasks-done" key={`${task.id}`}>
                                                        <ArchiveTask task={task} handelDeleteTask = {handelDeleteTask}/>
                                                    </li>
                                                )})
                                    }
                                </ul>

                            </>
                        :
                        <>
                            <div className="tasks__row-header">
                                {
                                    !collatedTasksExist(selectedProject) &&
                                    (
                                        <>
                                                <span ref={refInfo} className={showUsersOverlay ? "active" : undefined}>
                                                    <span className="add-task__user"
                                                          onClick={() => setShowUsersOverlay(!showUsersOverlay)}
                                                    >
                                                        <FaUserPlus/>
                                                    </span>
                                                    <UsersOverlay setShowUsersOverlay={setShowUsersOverlay} showUsersOverlay={showUsersOverlay}/>
                                                </span>
                                            <span ref={refChat} className={showChat ? "active chat" : "chat"}>
                                                    <span className="chat__ico"
                                                          onClick={() => setShowChat(!showChat)}
                                                    >
                                                        <FaComments/>
                                                    </span>
                                                    <Chat setShowChat={setShowChat} showChat={showChat}/>
                                                </span>
                                        </>
                                    )
                                }
                                <div className="tasks__sort">&nbsp;</div>
                            </div>
                            <div className="tasks-no">
                                <span>You don't have tasks for  this collection</span>
                                <FaFrown />
                            </div>
                        </>
            }
            { !collatedTasksExist(selectedProject) && (<AddTask handelCreateTask={handelCreateTask}/>)}

        </div>
    );
};