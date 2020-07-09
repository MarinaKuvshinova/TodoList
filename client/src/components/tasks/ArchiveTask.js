import React from "react";
import {FaTrashAlt} from "react-icons/fa";
import axios from "axios";

export const ArchiveTask = ({task, handelDeleteTask}) => {
    const deleteTask = taskId => {
        axios.delete(`/task/${taskId}`)
            .then(res => {
                handelDeleteTask(taskId);
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            <span>{task.task}</span>
            <button type="button"
                    className="tasks__list-delete"
                    onClick={() => deleteTask(task.id)}
            >
                <FaTrashAlt/>
            </button>
        </>
    );
};