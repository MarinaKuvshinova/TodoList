import React, {useRef, useState} from "react";
import {FaRegListAlt, FaRegCalendarAlt, FaRegTimesCircle, FaPlusCircle, FaRegStar, FaStar, FaRegCommentAlt, FaUsers} from "react-icons/fa";
import axios from "axios";
import {useSelectedProjectValue} from "../../context";
import {ProjectOverlay} from "../projects/ProjectOverlay";
import {TaskDate} from "./TaskDate";
import {TaskMessage} from "./TaskMessage";
import {useOutsideClick} from "../../hooks";
import {UsersOverlay} from "./UsersOverlay";
import socket from "../../socket";

export const AddTask = ({showAddTaskMain = true, shouldShowMain = false, showQuickAddTask, setShowQuickAddTask, handelCreateTask}) => {
    const [task, setTask] = useState("");
    const [taskDate, setTaskDate] = useState(false);
    const [project, setProject] = useState(false);
    const [users, setUsers] = useState([]);
    const [showMain, setShowMain] = useState(shouldShowMain);
    const [message, setMessage] = useState('');
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);
    const [showUsersOverlay, setShowUsersOverlay] = useState(false);
    const [showTaskDate, setShowTaskDate] = useState(false);
    const [showTaskMessage, setShowTaskMessage] = useState(false);
    const [important, setImportant] = useState(false);
    const ref = useRef();
    const refInfo = useRef();
    const {selectedProject} = useSelectedProjectValue();


    // useEffect(() => {
    //     console.log("task");
    //     socket.on('add', (task) => {
    //         // if (JSON.stringify(task) !== JSON.stringify(taskProject)) {
    //         //     handelCreateTask(task);
    //         //     setTaskProject(task);
    //         // }
    //     //     ///new
    //     //     console.log("task", task);
    //         handelCreateTask(task);
    //     });
    //
    // },[taskProject]);


    const addTask = () => {
        const projectId = project || selectedProject;
        //const userId = users.length > 0 ? users : '';
        let collatedDate = '';
        setMessage('');
        setTask('');
        setTaskDate('');


        return (task &&
            projectId &&
            axios.put('/task/add', {archived: false, projectId, task, date: collatedDate || taskDate, important, message, userId: users})
                .then( async res => {
                    const {usersTask, id} = res.data;
                    setTask('');
                    setProject('');
                    setShowMain('');
                    setUsers([]);
                    setShowProjectOverlay(false);
                    setImportant(false);
                    await socket.emit("task add", {id, archived: false, projectId, task, date: collatedDate || taskDate, usersTask, important, message});
                    await handelCreateTask({id, archived: false, projectId, task, date: collatedDate || taskDate, usersTask, important, message});
            })
                .catch(err => console.error(err)))
    };

    useOutsideClick(ref, () => {
        if (showQuickAddTask) setShowQuickAddTask(false);
    });
    useOutsideClick(refInfo, () => {
        if (showProjectOverlay) setShowProjectOverlay(false);
        if (showTaskDate) setShowTaskDate(false);
        if (showTaskMessage) setShowTaskMessage(false);
        if (showUsersOverlay) setShowUsersOverlay(false);
    });

    return (
        <div ref={ref} className={showQuickAddTask ? 'add-task add-task__overlay' : 'add-task'}>
            {
                showAddTaskMain && !showMain && (
                    <div className="add-task__shallow"
                         onClick={() => setShowMain(!showMain)}
                    >
                        <span className="add-task__plus"><FaPlusCircle/></span>
                        <span className="add-task__text">Add Task</span>
                    </div>
                )
            }
            {
                (showMain || showQuickAddTask) && (
                    <>
                        {showQuickAddTask && (
                            <>
                                <strong className="add-task__heading">Quick Add Task</strong>
                                <span className="add-task__cancel-x"
                                      onClick={() => {
                                          setShowMain(false);
                                          setShowProjectOverlay(false);
                                          setShowQuickAddTask(false);
                                      }}
                                >
                                        <FaRegTimesCircle/>
                                    </span>
                            </>
                        )}

                        <input type="text"
                               className="add-task__content"
                               placeholder="Task name"
                               value={task}
                               onChange={e => setTask(e.target.value)}
                        />
                        <div className="add-task__button-row">
                            <button disabled={!task && true} type="button"
                                    onClick={() => (showQuickAddTask ? (addTask() && setShowQuickAddTask(false)) : addTask())}
                            >
                                Add Task
                            </button>
                            {!showQuickAddTask && (
                                <span className="add-task__cancel"
                                      onClick={() => {
                                          setShowMain(false);
                                          setShowProjectOverlay(false);

                                      }}
                                >
                                    Cancel
                                </span>
                            )}
                            {!showQuickAddTask && (
                                <ul>
                                    <li className={important ? 'active' : undefined} onClick={()=>setImportant(!important)}>
                                        <span className="add-task__important">
                                            {!important ? <FaRegStar/> : <FaStar/>}
                                        </span>
                                    </li>
                                    <li ref={refInfo} className={showProjectOverlay || project ? "active" : undefined}>
                                        <span className="add-task__project"
                                              onClick={() => setShowProjectOverlay(!showProjectOverlay)}
                                        >
                                            <FaRegListAlt/>
                                        </span>
                                        <ProjectOverlay setProject={setProject} setShowProjectOverlay={setShowProjectOverlay} showProjectOverlay={showProjectOverlay}/>
                                    </li>
                                    <li ref={refInfo} className={showUsersOverlay || users.length > 0 ? "active" : undefined}>
                                        <span className="add-task__user"
                                              onClick={() => setShowUsersOverlay(!showUsersOverlay)}
                                        >
                                            <FaUsers/>
                                        </span>
                                        <UsersOverlay setUsers={setUsers} users={users} setUserTask={true} setShowUsersOverlay={setShowUsersOverlay} showUsersOverlay={showUsersOverlay}/>
                                    </li>
                                    <li ref={refInfo} className={showTaskDate || taskDate ? "active" : undefined}>
                                        <span className="add-task__date"
                                              onClick={() => setShowTaskDate(!showTaskDate)}
                                        >
                                            <FaRegCalendarAlt/>
                                        </span>
                                        <TaskDate setTaskDate={setTaskDate} showTaskDate={showTaskDate} setShowTaskDate={setShowTaskDate}/>
                                    </li>
                                    <li ref={refInfo} className={showTaskMessage || message ? "active" : undefined}>
                                        <span className="add-task__message"
                                              onClick={() => setShowTaskMessage(!showTaskMessage)}
                                        >
                                            <FaRegCommentAlt/>
                                        </span>
                                        <TaskMessage setTaskMessage={setMessage} taskMessage={message} showTaskMessage={showTaskMessage} setShowTaskMessage={setShowTaskMessage}/>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    );
};

