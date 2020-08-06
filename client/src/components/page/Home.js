import React from "react";
import {ProjectsProvider, UserInfoProvider} from "../../context";
import {Header} from "../layout/Header";
import {Context} from "../layout/Content";


export const Home = () => {
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