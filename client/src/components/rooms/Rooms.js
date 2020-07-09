import React from "react";
import {useRoomsValue, useSelectedProjectValue} from "../../context";
import {IndividualRoom} from "./IndividualRoom";
import {FaFrown} from "react-icons/fa";

export const Rooms =({setActive}) => {
    const {setSelectedProject} = useSelectedProjectValue();
    const {rooms} = useRoomsValue();

    return (
        rooms.length === 0 ?
            <div className="header__project-no">
                <span>You don't have rooms</span>
                <FaFrown />
            </div> :
            <ul>
                { rooms && rooms.map(room => (
                    <li
                        key = { room.id }
                        className = { localStorage.getItem('selectedProject') === room.id ? 'active sidebar__project' : 'sidebar__project' }
                        onClick = { () => {
                            setActive(room.id);
                            setSelectedProject(`Room: ${room.name}`);
                            localStorage.setItem('selectedProject', room.id);
                        }}
                    >
                        <IndividualRoom room={room} />
                    </li>
                ))}
            </ul>

    )
};