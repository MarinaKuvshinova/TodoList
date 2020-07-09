import React from "react";
import axios from "axios";
import {useRoomsValue, useSelectedProjectValue} from "../../context";
import {FaTrashAlt} from "react-icons/fa";

export const IndividualRoom = ({room}) => {
  const {rooms, setRooms} = useRoomsValue();
  const {setSelectedProject} = useSelectedProjectValue();

  //delete room
  const deleteRoom = roomId => {
      axios.delete(`/room/${roomId}`)
          .then(res => {
              setRooms([...rooms.filter(res => res.roomId !== roomId)]);
              setSelectedProject('INBOX');
          })
          .catch(err => console.error(err));
  };

  return(
      <>
          <span className="sidebar__project-name">{room.name}</span>
          <button type="button" className="sidebar__project-delete" onClick={() => {deleteRoom(room.id)}}><FaTrashAlt/></button>
      </>
  )

};
