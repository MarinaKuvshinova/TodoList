import React, {useState} from "react";

export const TaskMessage = ({setTaskMessage, taskMessage, showTaskMessage, setShowTaskMessage}) => {
    const [message, setMessage] = useState(taskMessage);
    const handleAddMessage = () => {
        if (message.length > 0) {
            setTaskMessage(message);
        } else {
            setTaskMessage('');
            setShowTaskMessage(true);
        }
    };

    const handleDeleteMessage = () => {
        setMessage('');
        setShowTaskMessage(true);
        setTaskMessage('');
    };

    return (
        showTaskMessage &&
            <div className="task-message">
                <textarea  value={message}  cols="30" onBlur={() => handleAddMessage()} onChange={e => setMessage(e.target.value)} rows="10"/>
                <div className="task-message__row">
                    <button className="clear" onClick={() => handleDeleteMessage()}>Clear</button>
                </div>
            </div>
    )
};