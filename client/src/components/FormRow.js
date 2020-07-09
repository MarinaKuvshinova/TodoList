import React, {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";

export const FormRow = ({name, value, setValue, text, type = 'text', setErrorInput, errors, password}) => {
    const [active, setActive] = useState(false);
    const [toggleShow, setToggleShow] = useState(true);
    const [error, setError] = useState([]);

    const activateField = () => {
        setActive(true);
        errors.general = '';
    };

    const disableFocus = (e) => {
        if (e.target.value === "") {
            setActive(false);
        }
    };

    const updateInputValue = (e) => {
        activateField();
        const { name, value } = e.target;
        let error;
        //сделать проверку полей и в бере сделать принятие полей
        switch (name) {
            case 'firstName':
                error =
                    value.length < 1
                        ? 'Name must be at least 1 characters long!'
                        : '';
                setErrorInput({...errors, firstName: error});
                break;
            case 'lastName':
                error =
                    value.length < 1
                        ? 'Surname must be at least 1 characters long!'
                        : '';
                setErrorInput({...errors, surName: error});
                break;
            case 'email':
                error =
                    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value)
                        ? ''
                        : 'Email is not valid!';
                setErrorInput({...errors, email: error});
                break;
            case 'password':
                error =
                    value.length < 8
                        ? 'Password must be at least 8 characters long!'
                        : '';
                setErrorInput({...errors, password: error});
                break;
            case 'confirmPassword':
                error =
                    value !== password
                        ? 'Confirm password must be the same as password!'
                        : '';
                setErrorInput({...errors, confirmPassword: error});
                break;
            default:
                break;
        }
        setError(error);
        setValue(value);
    };




    return (
        <>
        <label className={active ? "field-active" : ""}>{text}</label>
            { type==="password" ? (
                <>
                    <input type={toggleShow ? "password" : "text"}
                           name={name}
                           value={value}
                           onFocus={activateField}
                           onBlur={(e) => disableFocus (e)}
                           onChange={(e) => updateInputValue(e)}
                    />
                    <span className="login__form__row__eye" onClick={() => setToggleShow(!toggleShow)}>{!toggleShow ? <FaEye/> : <FaEyeSlash/>}</span>
                </>
            ) : (
                <input type={type}
                name={name}
                value={value}
                onFocus={activateField}
                onBlur={(e) => disableFocus (e)}
                onChange={(e) => updateInputValue(e)}
                />
                )
            }
            {
                error.length > 0 && <span className='error'>{error}</span>
            }
        </>
    );
};