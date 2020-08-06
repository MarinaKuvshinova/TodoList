import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaPlus, FaMinus} from "react-icons/fa";
import {useSelectedProjectValue} from "../../context";
import socket from '../../socket';

export const UsersOverlay = ({setUserTask = false, users, setUsers, showUsersOverlay, setShowUsersOverlay}) => {
    const [userAdd, setUserAdd] = useState('');
    const [userSearch, setUserSearch] = useState([]);
    const {selectedProject} = useSelectedProjectValue();
    let textMessage = '';

    // useEffect(() => {
    //     axios.post(`/users/project/${selectedProject}`)
    //         .then( res => {
    //             setUserSearch([...res.data]);
    //             if (res.data) textMessage = 'user didn\'t found';
    //         })
    //         .catch(err => console.error(err));
    // }, [selectedProject]);


    const searchUsers = async (e) => {
        if (setUserTask) {
            //пользователи проекта
            // console.log("Show users in project", userSearch);
            await axios.post(`/users/project/${selectedProject}`)
                .then( res => {
                    setUserSearch([...res.data]);
                    // console.log("UserSearch", userSearch);
                    if (res.data) textMessage = 'user didn\'t found';
                })
                .catch(err => console.error(err));
            // console.log("Show users in project", userSearch);
        } else {
            //поиск нового пользователя
            setUserAdd(e.target.value);
            await axios.post('/users', {userAdd})
                .then( res => {
                    setUserSearch([...res.data]);
                    if (res.data) textMessage = 'user didn\'t found';
                })
                .catch(err => console.error(err));
        }
    };
    useEffect(() => {
        if(setUserTask) {
            searchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[setUserTask]);
    
    const handleClickAddUserToProject = async (userId) => {
        if (setUserTask) {
            setShowUsersOverlay(false);
            if (users && users.includes(userId)) {
                setUsers(users.filter(user => user !== userId));
            } else {
                setUsers([...users, userId]);
            }
        } else {
            //добавление пользователя в проект
            setShowUsersOverlay(false);
            socket.emit('join', {userId, selectedProject});
            await axios.put('/users/add/project', {userId, selectedProject})
                .then( res => {
                    console.log("Add to project User", res.data);
                })
                .catch(err => console.error(err));
            setUserAdd('');
            setUserSearch([]);
        }
    };

    return(
         showUsersOverlay && (
            <div className="project-overlay">
                {
                    !setUserTask &&
                        <div className="project-overlay__search-user">
                            <input type="text" placeholder="Search User" onChange={(e) => searchUsers(e)} onClick={(e) => searchUsers(e)} value={userAdd} />
                        </div>
                }

                {
                    userSearch.length > 0 ? (
                        <ul className="project-overlay__list">
                            {
                                userSearch.map(user =>
                                    <li key = {user.id}
                                        onClick={() => handleClickAddUserToProject(user.id)}
                                        className={(users && users.includes(user.id)) ? "active" : undefined}
                                    >
                                        {user.imageUrl && <span className="project-overlay__list-avatar"><img src={user.imageUrl} alt="avatar user"/></span>}
                                        {`${user.firstName} ${user.lastName}`}
                                        <button>
                                            {(users && users.includes(user.id)) ? <FaMinus/> : <FaPlus/>}
                                        </button>

                                    </li>
                                )
                            }
                        </ul>
                    ) : (
                        <span>{textMessage}</span>
                    )
                }

            </div>
        )
    );
};