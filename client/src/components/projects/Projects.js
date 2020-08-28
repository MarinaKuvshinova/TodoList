import React, {useEffect} from "react";
import {useProjectsValue, useSelectedProjectValue} from "../../context";
import {IndividualProject} from "./IndividualProject";
import {FaFrown} from "react-icons/fa";
import socket from "../../socket";

export const Projects =({setActive}) => {
    const {setSelectedProject} = useSelectedProjectValue();
    const {projects, setProjects} = useProjectsValue();


    useEffect(() => {
        socket.on('project', (project) => {
            setProjects((projects) => [...projects, project]);
        });
        return () => socket.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleClick = (id) => {
        setActive(id);
        setSelectedProject(id);
        localStorage.setItem('selectedProject', id);
    };



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
                            onClick = { () => handleClick(project.id)}
                        >
                            <IndividualProject project={project} />
                        </li>
                    ))}
                </ul>

    )
};