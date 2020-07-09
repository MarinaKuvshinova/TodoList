import React, {useState} from "react";
import axios from "axios";
import {useProjectsValue} from "../../context";
import {FaPlusCircle} from "react-icons/fa";

export const AddProject = ({shouldShow = false}) => {
    const [show, setShow] = useState(shouldShow);
    const [projectName, setProjectName] = useState('');
    const {projects, setProjects} = useProjectsValue();

    const addProject = () => {
        projectName &&
            axios.put('/project/add', { name: projectName })
                .then( () => {
                    setProjects([...projects]);
                    setProjectName('');
                    setShow(false);
                })
                .catch(err => console.error(err));
    };

    return(
        <div className="add-project">
            {show ? (
                <div className="add-project__input">
                    <input type="text"
                           value={projectName}
                           onChange={e => setProjectName(e.target.value)}
                           placeholder="Name your project"
                    />
                    <button disabled={!projectName && true} className="add-project__submit"
                            type="button"
                            onClick={() => addProject()}
                    >
                        Add Project
                    </button>
                    <span className="add-project__cancel"
                          onClick={() => {setShow(false)}}
                    >
                        Cancel
                    </span>
                </div>
            ) : (
                <div className="add-project__title">
                    <span className="add-project__plus"><FaPlusCircle/></span>
                    <span className="add-project__text"
                          onClick={() => setShow(!show)}
                    >
                    Add Project
                    </span>
                </div>
            )}
        </div>
    );
};