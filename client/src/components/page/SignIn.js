import React, {useState} from "react";
import {FormRow} from "../FormRow";
import axios from "axios";
import {useUserValue} from "../../context";
import ReactLoading from "react-loading";
import {Link} from "react-router-dom";

export const SignIn = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({email: false, password: false});
    const {setUser} = useUserValue();
    const [loading, setLoading] = useState(false);

    let valid = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('/signIn', {email, password})
            .then(res => {
                if (res.data.general) {
                    setErrors({...res.data});
                    setEmail('');
                    setPassword('');
                    setLoading(false);
                } else {
                    setLoading(false);
                    const FBIdToken = res.data.token;
                    localStorage.setItem('FBIdToken', FBIdToken);
                    setUser(FBIdToken);

                    //axios.defaults.headers.common['Authorization'] = `Bearer ${FBIdToken}`;
                    //Cookies.set("token", res.data.token, {expires: 1});
                    //setUser({...res.data.token});
                    history.push("/");
                }
            })
            .catch(err => {
                if (err.response.data.general) {
                    setErrors({general:err.response.data.general});
                    setEmail('');
                    setPassword('');
                    setLoading(false);
                } else {
                    console.error(err);
                }
            })
    };

    if(!(errors.password==='' && errors.email==='')) {
        valid = true;
    }



    return (
        <main className="login">
            <form onSubmit = {handleSubmit} className="login__form">
                <header className="login__form__title">
                    <strong>Sign in</strong>
                    <span>Welcome to KUBE</span>
                </header>
                {
                    errors.general && (<span className="error_message">{errors.general}</span>)
                }
                <div className="login__form__row">
                    <FormRow name='email' value={email} setValue={setEmail} text='Email' type='email' setErrorInput={setErrors} errors={errors} />
                </div>
                <div className="login__form__row">
                    <FormRow name='password' value={password} setValue={setPassword} text='Password' type='password' setErrorInput={setErrors} errors={errors} />
                </div>
                <button disabled={ (valid || loading) ? 'disabled' : undefined}  type="submit">
                    {
                        loading ? <ReactLoading type={'bubbles'} color={'#c4c9d2'} height={'25px'} width={'20%'} className={'loading'} /> : 'Sign In'
                    }
                </button>
                <span className="login__form__text-down">Don’t have an account? <Link to="/signUp">Sign Up</Link></span>
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