import React, {useEffect} from "react";
import {useSelectedProjectValue, useUserInfoValue} from "../../context";
import {FaPencilAlt} from "react-icons/fa";

export const User = () => {
    const {setSelectedProject} = useSelectedProjectValue();
    const {userInfo} = useUserInfoValue();

    useEffect(() => {

    }, [userInfo]);

    return (
        <>
            <div className="header__user-picture">{userInfo.imageUrl && <img src={userInfo.imageUrl} alt={`avatar ${userInfo.firstName}`}/>}</div>
            <div className="header__user-text">
                <strong>Hi, {userInfo.firstName}</strong>
                <button
                        onClick={() => {
                            localStorage.setItem('selectedProject', 'Setting profile');
                            setSelectedProject(localStorage.getItem('selectedProject'))}
                        }
                >
                    <FaPencilAlt/>
                </button>
                <span className="header__user-text-email">{userInfo.email}</span>
            </div>
        </>
    );
};