import React from "react";
import {useUserValue} from "../../context";
import {Redirect, Route} from "react-router-dom";

export const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {user} = useUserValue();
    return (
        <Route
            {...rest}
            render = {routeProps => !!user ? (<RouteComponent {...routeProps}/>) : (<Redirect to={"/signIn"}/>)}
        />
    );
};