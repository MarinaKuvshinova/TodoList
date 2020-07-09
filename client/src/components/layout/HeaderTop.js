import React, {useState} from "react";
import {AddTask} from "../tasks/AddTask";
import {FaPlus, FaSignOutAlt} from "react-icons/fa";

export const HeaderTop = ({projectName, showAddTask, handelCreateTask}) => {
    const [shouldShowMain, setShouldShowMain] = useState(false);
    const [showQuickAddTask, setShowQuickAddTask] = useState(false);

    const handleOut = () => {
        localStorage.removeItem('selectedProject');
        localStorage.removeItem('FBIdToken');
        window.location.href = '/signIn';
    };

    return (
      <header className="header_top">
          <h1>{projectName}</h1>
          {
              projectName === 'Setting profile' && (<FaSignOutAlt className="header_top-out" onClick={() => handleOut()} />)
          }
          {
              showAddTask && (
                  <div className="settings">
                      <ul>
                          <li className="settings__add"
                              onClick={() => {
                                  setShowQuickAddTask(!showQuickAddTask);
                                  setShouldShowMain(true);
                              }}
                          >
                              <FaPlus/></li>
                      </ul>
                      <AddTask showAddTaskMain={false} shouldShowMain={shouldShowMain} setShowQuickAddTask={setShowQuickAddTask} showQuickAddTask={showQuickAddTask} handelCreateTask={handelCreateTask}/>
                  </div>
              )
          }
      </header>
    );
};