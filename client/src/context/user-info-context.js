import React, {createContext, useContext} from "react";
import {useUser} from "../hooks";

export const UserInfoContext = createContext();
export const UserInfoProvider = ({children}) => {
    const {userInfo, setUserInfo} = useUser();
    return (
        <UserInfoContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserInfoContext.Provider>
    );
};
export const useUserInfoValue = () => useContext(UserInfoContext);
