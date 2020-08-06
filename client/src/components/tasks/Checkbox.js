import React from "react";
import axios from "axios";
import socket from "../../socket";

export const Checkbox = ({id, handelChangArchive}) => {
   const archiveTask = async (id) => {
       await axios.put(`/task/check/${id}`).then(res => {
           socket.emit("task check", id);
           handelChangArchive(id);
       }).catch((error) => {
           console.log(error)
       });
   };

    // useEffect(() => {
    //     socket.on('check', async (id) => {
    //         console.log("check ", id);
    //         await handelChangArchive(id);
    //     });
    // }, []);

   return (
       <span className="checkbox" onClick={() => archiveTask(id)}/>
   );
};