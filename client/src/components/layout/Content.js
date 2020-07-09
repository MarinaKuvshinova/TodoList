import React from "react";
import {Tasks} from "../tasks/Tasks";
import {useSelectedProjectValue} from "../../context";
import {UserDetails} from '../user/UserDetails';


export const Context = () => {
    const {selectedProject} = useSelectedProjectValue();

    return (
        <>
            {selectedProject !== 'Setting profile' ? <Tasks/> : <UserDetails/>}
        </>
    );
};