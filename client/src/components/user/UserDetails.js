import React, {useEffect, useState} from "react";
import {HeaderTop} from "../layout/HeaderTop";
import {FormRow} from "../FormRow";
import ReactLoading from "react-loading";
import axios from "axios";
import {useUserInfoValue} from "../../context";
import {FaPencilAlt} from "react-icons/fa";

export const UserDetails = () => {
    const {userInfo, setUserInfo} = useUserInfoValue();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [edit, setEdit] = useState(false);
    const [errors, setErrors] = useState({firstName:'', surName:'', picture: ''});
    const [loading, setLoading] = useState(false);
    const [loadingPhoto, setLoadingPhoto] = useState(false);
    const projectName = localStorage.getItem('selectedProject');

    let valid = false;


    useEffect(() => {
        document.title = `TodoList: ${projectName}`;
        setImageUrl(userInfo.imageUrl);
        if (!firstName && !lastName) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
        }
    }, [userInfo, projectName, errors, firstName, lastName, imageUrl]);

    if(!(errors.firstName==='' && errors.surName==='')) {
        valid = true;
    }

    const handleEdit = async () => {
        setLoading(true);
        await axios.post('/user', {firstName, lastName}).then(() => {
            setLoading(false);
            setUserInfo({...userInfo, firstName, lastName});
            setEdit(false);
        }).catch(err => console.error(err));
    };

    const handleEditPicture = async (e) => {
        const img = e.target.files[0];
        const type = img.name.split('.')[img.name.split('.').length - 1];
        if (type !== 'png' && type !== 'jpeg' && type !== 'jpg') {
//            errors.picture = 'Wrong type file submitted';
            setErrors({...errors, picture: 'Wrong type file submitted'});
        } else {
            const formData = new FormData();
            setLoadingPhoto(true);
            formData.append('image', img, img.name);
            let picture = await axios.post('/user/image', formData).then((data) => {
                errors.picture = '';
                setLoadingPhoto(false);
                return data.data;
            }).catch(err => console.error(err));
            setUserInfo({...userInfo, imageUrl:picture});
            setImageUrl(picture);
        }
    };

    const handleClickPicture = (e) => {
        const inputFile = document.getElementById('inputFile');
        inputFile.click()
    };

    return (
        <div className="tasks">
            <HeaderTop projectName={projectName} />
            <div className="personal">
                <div className="personal-avatar">
                    <div className="personal-avatar__picture">
                        {
                            imageUrl && <img src={imageUrl} alt="users avatar"/>
                        }
                        <button onClick={()=>handleClickPicture()} className='personal-avatar__picture-edit'>
                            <input id="inputFile" hidden='hidden' onChange={(e)=>handleEditPicture(e)} type="file"/>
                            <span>
                                {
                                    loadingPhoto ? <ReactLoading type={'spokes'} color={'#fff'} height={'100%'} width={'100%'} className={'loading'} /> : <FaPencilAlt/>
                                }
                            </span>
                        </button>
                        {
                            errors.picture && (<span className="personal-avatar__picture-error">{errors.picture}</span>)
                        }
                    </div>
                </div>
                <div className="personal-info">
                    <h2>Personal Info</h2>
                    <div className='personal-info__form'>
                        <div className="personal-info__form__row">
                            {
                                !edit ?
                                    <span className="personal-info__form__row-text">{firstName}</span> :
                                    <FormRow name='firstName' value={firstName} setValue={setFirstName} text='Name' type='text' setErrorInput={setErrors} errors={errors} />
                            }
                        </div>
                        <div className="personal-info__form__row">
                            {
                                !edit ?
                                    <span className="personal-info__form__row-text">{lastName}</span> :
                                    <FormRow name='lastName' value={lastName} setValue={setLastName} text='Surname' type='text' setErrorInput={setErrors} errors={errors} />
                            }
                        </div>
                        <div className="personal-info__form__row-button">
                            {
                                !edit ?
                                    <button onClick={ () => setEdit(true)}>
                                        Edit
                                    </button>
                                    :
                                    <>
                                        <button onClick={() => handleEdit()} disabled={ (valid || loading) ? 'disabled' : undefined}>
                                            {
                                                loading ? <ReactLoading type={'bubbles'} color={'#c4c9d2'} height={'30px'} width={'60%'} className={'loading'} /> : 'Save'
                                            }
                                        </button>
                                        <button className="btn__cancel" onClick={() => setEdit(false)}>
                                            Cancel
                                        </button>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};