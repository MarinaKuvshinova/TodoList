import React, {useEffect} from "react";
import {ProjectsProvider, useProjectsValue, UserInfoProvider, useSelectedProjectValue} from "../../context";
import {Header} from "../layout/Header";
import {Context} from "../layout/Content";
import socket from "../../socket";


export const Home = () => {

    // useEffect(() => {
    //     socket.emit('join', projects);
    //     // socket.on('done_task', (id) => {
    //     //     console.log("taskId", id)
    //     // });
    // }, []);

    return (
        <ProjectsProvider>
            <UserInfoProvider>
                <div className="App">
                    <Header/>
                    <Context/>
                </div>
            </UserInfoProvider>
        </ProjectsProvider>
    )
};