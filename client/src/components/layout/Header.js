import React, {useEffect, useRef, useState} from "react";
import { FaCalendarTimes, FaCalendarWeek, FaChevronDown, FaCalendarDay, FaCalendarCheck} from 'react-icons/fa';
import {useSelectedProjectValue} from "../../context";
import {Projects} from "../projects/Projects"
import {AddProject} from "../projects/AddProject";
import {collatedTasksExist} from "../../helpers";
import {User} from "../user/User";
import {FaArrowLeft} from "react-icons/fa";
import {useOutsideClick} from "../../hooks";

export const Header = () => {
    const {setSelectedProject, selectedProject} = useSelectedProjectValue();
    const [active, setActive] = useState(localStorage.getItem('selectedProject').toLowerCase());
    const [showProjects, setShowProjects] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const refHeader = useRef();

    useEffect(()=>{
        if (!collatedTasksExist(selectedProject) && selectedProject !== 'Setting profile' ) {
            setShowProjects(true);
        }
    }, [selectedProject]);

    useOutsideClick(refHeader, () => {
        if (showMenu) setShowMenu(false);
    });


    return (
        <header className={showMenu ? "header open_header" : "header"}  ref={refHeader}>
            <button onClick={() => setShowMenu(!showMenu)} className="header__open"><FaArrowLeft/></button>
            <h1 className="header__logo">CUBE</h1>
            <div className="header__holder">
                <ul className="header__catalog">
                    <li
                        className={active === "inbox" ? 'active' : undefined}
                    >
                        <button type="button"
                           onClick={() => {
                               localStorage.setItem('selectedProject', 'INBOX');
                               setActive(localStorage.getItem('selectedProject').toLowerCase());setSelectedProject(localStorage.getItem('selectedProject'))}
                           }
                        >
                            <FaCalendarTimes/><span>Inbox</span>
                        </button>
                    </li>
                    <li
                        className={active === "today" ? 'active' : undefined}
                    >
                        <button type="button"
                           onClick={() => {
                               localStorage.setItem('selectedProject', 'TODAY');
                               setActive(localStorage.getItem('selectedProject').toLowerCase());setSelectedProject(localStorage.getItem('selectedProject'))}
                           }
                        >
                            <FaCalendarDay/><span>Today</span>
                        </button>
                    </li>
                    <li
                        className={active === "next_7" ? 'active' : undefined}
                    >
                        <button type="button"
                           onClick={() => {
                               localStorage.setItem('selectedProject', 'NEXT_7');
                               setActive(localStorage.getItem('selectedProject').toLowerCase());setSelectedProject(localStorage.getItem('selectedProject'))}
                           }
                        >
                            <FaCalendarWeek/><span>For 7 days</span>
                        </button>
                    </li>
                    <li
                        className={active === "archive" ? 'active' : undefined}
                    >
                        <button type="button"
                                onClick={() => {
                                    localStorage.setItem('selectedProject', 'ARCHIVE');
                                    setActive(localStorage.getItem('selectedProject').toLowerCase());setSelectedProject(localStorage.getItem('selectedProject'))}
                                }
                        >
                            <FaCalendarCheck/><span>Archive</span>
                        </button>
                    </li>
                </ul>
                <div className="header__project">
                    <div className="header__project-title" onClick={() => {setShowProjects(!showProjects)}}>
                        <FaChevronDown className = {!showProjects ? 'hidden' : undefined} />
                        <span>Projects</span>
                    </div>

                    {
                        showProjects && (
                            <div className="header__project-box">
                                <Projects  setActive = {setActive} active={active} />
                                <AddProject />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="header__user">
                <User/>
            </div>
        </header>
    );
};