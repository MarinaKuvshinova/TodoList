import moment from "moment";
import {Checkbox} from "./Checkbox";
import React, {useEffect, useState} from "react";
import {FaCommentAlt, FaStar} from "react-icons/fa";
import socket from "../../socket";
import jwtDecode from "jwt-decode";


export const Task = ({task, handelChangArchive}) => {
    const [showMessage, setShowMessage] = useState(false);
    const [userId, setUserId] = useState('');

    const handleDate = () => {
        return !moment(task.date, "DD/MM/YYYY").isAfter(moment().subtract(1, 'days'))
    };

    useEffect(() => {
        socket.emit("join", task.projectId);
        const token = localStorage.getItem("FBIdToken");
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <li className={(task.date && handleDate() ) ? "expired" : undefined} key={`${task.id}`}>
            <Checkbox id={task.id} handelChangArchive={handelChangArchive}  />
            <span className="tasks__list__task-text">
                <span>{task.task} {task.message && (<FaCommentAlt className={showMessage && 'active'} onClick={() => setShowMessage(!showMessage)} />)}</span>
                {
                    task.date && <span className="date">finish to: {task.date}</span>
                }
                {
                    showMessage && <span className="tasks__list__task-message"><strong>Commit:</strong> {task.message}</span>
                }
            </span>
            <span className="tasks__list__task-info">
                {
                    task.usersTask &&
                        <span className="tasks__list__task__avatars">
                            {
                                task.usersTask.filter(user => user.id!==userId && user.id !== task.usersTask.userId).map( user => <span className="tasks__list__task__avatars-row" key={user.id}><span className="picture"><img src={user.imageUrl} alt="user avatar"/></span><span className="text">{user.firstName} {user.lastName}</span></span>)
                            }
                        </span>
                }
                {
                    task.important && <span className="tasks__list__task-important"><FaStar/></span>
                }
            </span>
        </li>
    )
};