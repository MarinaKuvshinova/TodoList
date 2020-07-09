import React from "react";
import axios from "axios";
import {useProjectsValue, useSelectedProjectValue} from "../../context";
import {FaTrashAlt} from "react-icons/fa";

export const IndividualProject = ({project}) => {
  const {projects, setProjects} = useProjectsValue();
  const {setSelectedProject} = useSelectedProjectValue();

  //delete project
  const deleteProject = projectId => {
      axios.delete(`/project/${projectId}`)
          .then(res => {
              setProjects([...projects.filter(res => res.projectId !== projectId)]);
              setSelectedProject('INBOX');
          })
          .catch(err => console.error(err));
  };

  return(
      <>
          <span className="sidebar__project-name">{project.name}</span>
          <button type="button" className="sidebar__project-delete" onClick={() => {deleteProject(project.id)}}><FaTrashAlt/></button>
      </>
  )

};
