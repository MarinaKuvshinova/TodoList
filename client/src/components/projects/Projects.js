import React, {useEffect} from "react";
import {useProjectsValue, useSelectedProjectValue} from "../../context";
import {IndividualProject} from "./IndividualProject";
import {FaFrown} from "react-icons/fa";
import {collatedTasksExist} from "../../helpers";
import socket from '../../socket';

export const Projects =({setActive, active}) => {
    const {setSelectedProject} = useSelectedProjectValue();
    const {projects} = useProjectsValue();
    //const {handleUsers} =  useUsersProjectValue();


    // console.log(active)
    // useEffect(() => {
    //     socket.emit('connection', {projects});
    // }, []);

    return (
            projects.length === 0 ?
                <div className="header__project-no">
                    <span>You don't have projects</span>
                    <FaFrown />
                </div> :
                <ul>
                    { projects && projects.map(project => (
                        <li
                            key = { project.id }
                            className = { localStorage.getItem('selectedProject') === project.id ? 'active sidebar__project' : 'sidebar__project' }
                            onClick = { () => {
                                setActive(project.id);
                                //handleUsers(project.id);
                                setSelectedProject(project.id);
                                localStorage.setItem('selectedProject', project.id);
                            }}
                        >
                            <IndividualProject project={project} />
                        </li>
                    ))}
                </ul>

    )
};