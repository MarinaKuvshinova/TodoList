import React, {useEffect, useState} from "react";
import {FaTelegram} from "react-icons/fa";
import socket from "../../socket";
import {useUserInfoValue} from "../../context";
import axios from "axios";
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import {css} from "react-select";

export const Chat = ({showChat}) => {
    const [messages, setMessages] = useState('');
    const [message, setMessage] = useState('');
    const {userInfo} = useUserInfoValue();

    useEffect(() => {
        if (showChat) {
            const id = localStorage.getItem('selectedProject');
            axios.put(`/chat`, {selectedProject: id}).catch(err => console.error(err));
            showMessage();
        } else {
            setMessages('');
        }
    }, [showChat]);


    useEffect(() => {
        socket.on('chat', (message) => {
            setMessages((messages) => [...messages, message]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const sendMessage = async () => {
        let id = localStorage.getItem('selectedProject');
        await axios.put('/chat/send', {message, selectedProject: id})
            .then( async res => {
                 const sms = {
                    uid: Date.now(),
                    data: {
                        message,
                        dataCreate: Date.now(),
                        userInfo: {
                            name: `${userInfo.firstName} ${userInfo.lastName}`,
                            imageUrl: userInfo.imageUrl
                        }
                    }
                };
                setMessages((messages) => [...messages, sms]);
                await socket.emit('chat', {message:sms, projectId:id});
                setMessage('');
            })
            .catch(err => console.error(err));
    };

    const showMessage  = async () => {
        let id = localStorage.getItem('selectedProject');
        await axios.post('/chat', {selectedProject:id})
            .then( async res => {
                if (res.data.messages) {
                    setMessages([...res.data.messages]);
                }
            })
            .catch(err => console.error(err));
    };

    return (
        showChat && (
            <div className="chat__drop">

                <ScrollToBottom className="chat__messages">
                    {
                        messages.length > 0 ? messages.map ( text =>
                            <div key={text.uid} className="chat__row">
                                <div className="chat__row-holder">
                                    <span className="chat__row-ava">
                                        <img src={text.data.userInfo.imageUrl} alt="avatar"/>
                                    </span>
                                    <div className="chat__row-text">
                                        <span className="chat__row-title">
                                            {text.data.userInfo.name}
                                        </span>
                                        <span className="chat__row-time">{moment(text.data.dateCreate).format("HH:mm  DD/MM/YYYY")}</span>
                                    </div>
                                </div>
                                <div className="chat__row-message">
                                    {text.data.message}
                                </div>
                            </div>
                        ) : <div className="chat__text">You have no messages</div>
                    }
                </ScrollToBottom>
                <div className="chat__send">
                    <input type="text"
                           placeholder="Task name"
                           value={message}
                           onChange={e => setMessage(e.target.value)}
                    />
                    <button onClick={() => sendMessage()}><FaTelegram/></button>
                </div>
            </div>
        )
    );
};