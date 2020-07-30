import React, {useEffect} from "react";
import axios from "axios";
import socket from "../../socket";
import {useSelectedProjectValue} from "../../context";

export const Checkbox = ({id, handelChangArchive}) => {
    const {selectedProject} = useSelectedProjectValue();


   const archiveTask = async (id) => {
       await axios.put(`/task/check/${id}`).then(res => {
           socket.emit("task check", id);
           handelChangArchive(id);
       }).catch((error) => {
           console.log(error)
       });
   };

    useEffect(() => {
        socket.on('check', (id) => {
            handelChangArchive(id);
            console.log("check ", id);
        });
    }, []);

   return (
       <span className="checkbox" onClick={() => archiveTask(id)}/>
   );
};