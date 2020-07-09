import React from "react";
import {FaSpaceShuttle,FaRegPaperPlane, FaSun} from "react-icons/fa";
import moment from "moment";
import {Calendar} from "react-calendar";

export const TaskDate = ({setTaskDate, showTaskDate, setShowTaskDate}) => {
    return (
        showTaskDate &&
        <ul  className="task-date__list">
            <li>
                <Calendar
                    minDate = {moment().toDate()}
                    onChange = {(date) => {
                        setShowTaskDate(false);
                        setTaskDate(moment(date).format("DD/MM/YYYY"));
                    }}
                />
            </li>
            <li onClick={() => {
                setShowTaskDate(false);
                setTaskDate(moment().format("DD/MM/YYYY"));
            }}>
                <FaSpaceShuttle/>Today
            </li>
            <li onClick={() => {
                setShowTaskDate(false);
                setTaskDate(moment().add(1,'day').format("DD/MM/YYYY"));
            }}>
                <FaSun/>Tomorrow
            </li>
            <li onClick={() => {
                setShowTaskDate(false);
                setTaskDate(moment().add(7,'days').format("DD/MM/YYYY"));
            }}>
                <FaRegPaperPlane/>Next Week
            </li>
        </ul>
    )
};