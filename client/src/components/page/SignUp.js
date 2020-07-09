import React, {useState} from "react";
import {FormRow} from "../FormRow";
import axios from "axios";
import {useSelectedProjectValue, useUserValue} from "../../context";
import ReactLoading from "react-loading";
import {Link} from "react-router-dom";

export const SignUp = ({ history }) => {
    const {setSelectedProject} = useSelectedProjectValue();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState({email: false, password: false});
    const {setUser} = useUserValue();
    const [loading, setLoading] = useState(false);

    let valid = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('/signUp', {email, password, firstName, lastName})
            .then(res => {
                if (res.data.general) {
                    setErrors({...res.data});
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setLoading(false);
                } else {
                    setLoading(false);
                    const FBIdToken = res.data.token;
                    localStorage.setItem('FBIdToken', FBIdToken);
                    setUser(FBIdToken);
                    localStorage.setItem('selectedProject', 'Setting profile');
                    setSelectedProject('Setting profile');
                    history.push("/");
                }
            })
            .catch(err => {
                console.error(err);
                console.log("errors", errors);
            })
    };
    if(!(errors.password==='' && errors.email==='' && errors.confirmPassword==='')) {
        valid = true;
    }

    return (
        <main className="login">
            <form onSubmit = {handleSubmit} className="login__form">
                <header className="login__form__title">
                    <strong>Sign up</strong>
                    <span>Welcome to KUBE</span>
                </header>
                {
                    errors.general && (<span className="error_message">{errors.general}</span>)
                }
                <div className="login__form__double-row">
                    <div className="login__form__row">
                        <FormRow name='firstName' value={firstName} setValue={setFirstName} text='Name' type='text' setErrorInput={setErrors} errors={errors} />
                    </div>
                    <div className="login__form__row">
                        <FormRow name='lastName' value={lastName} setValue={setLastName} text='Surname' type='text' setErrorInput={setErrors} errors={errors} />
                    </div>
                </div>
                <div className="login__form__row">
                    <FormRow name='email' value={email} setValue={setEmail} text='Email' type='email' setErrorInput={setErrors} errors={errors} />
                </div>
                <div className="login__form__row">
                    <FormRow name='password' value={password} setValue={setPassword} text='Password' type='password' setErrorInput={setErrors} errors={errors} />
                </div>
                <div className="login__form__row">
                    <FormRow name='confirmPassword' value={confirmPassword} setValue={setConfirmPassword} password={password} text='Confirm Password' type='password' setErrorInput={setErrors} errors={errors} />
                </div>

                <button disabled={ (valid || loading) ? 'disabled' : undefined}  type="submit">
                    {
                        loading ? <ReactLoading type={'bubbles'} color={'#c4c9d2'} height={'25px'} width={'20%'} className={'loading'} /> : 'Sign Up'
                    }
                </button>
                <span className="login__form__text-down">Have an account? <Link to="/signIn">Sign In</Link></span>
            </form>
            <div className="login__text">
                <span>K<span>dfg</span></span>
                <span>U<span>dfg</span></span>
                <span>B</span>
                <span>E</span>
            </div>
        </main>
    );
};