import TextInput from "../Inputs/TextInput";
import './_loginForm.scss';
import Submit from "../Submit";
import {useNavigate} from "react-router-dom"
import { useState } from "react";
import BASE_URL from "../../settings";

const LoginForm = ({ setLoggedIn, setDoctorId }) => {
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [submittedPassword, setSubmittedPassword] = useState('');

    const navigate = useNavigate();
    const logInHandleSubmit = (e) => {
        e.preventDefault();
        let form = {
            email: submittedEmail,
            password: submittedPassword
        };

        fetch(BASE_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: form.email,
                password: form.password,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    setLoggedIn(true)
                    navigate('/admin')
                    return response.json()
                }
            }).catch(error => {
                alert('Wrong credentials', error)
            }).then(data => {
                setDoctorId(data.doctorId)
        })
    };

    return (
        <form className="login-form-container" onSubmit={logInHandleSubmit}>
            <TextInput
                value={submittedEmail}
                setInputValue={setSubmittedEmail}
                inputLabel="Email:"
                inputType="email"
                spellCheck={false}
                characterLimit={255}
            />
            <TextInput
                value={submittedPassword}
                setInputValue={setSubmittedPassword}
                inputLabel="Password:"
                inputType="password"
                spellCheck={false}
                characterLimit={255}
            />
            <Submit />
        </form>
    );
};

export default LoginForm;
