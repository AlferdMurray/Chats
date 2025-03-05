import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../Service/chatService";
import { validationMessages } from "../constant";
import Popup from "./Popup";
import io from "socket.io-client";
import { connectSocket } from "../Socket/socket";
const Login = ({ onSignIn }) => {
    const [formInputs, setFormInputs] = useState({ email: '', password: '' })
    const [formValidationMessage, setFormValidationMessage] = useState({ email: '', password: '' })
    const [popup, setPopUp] = useState({ state: '', message: '' })
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let validation = { email: '', password: '' }
            let error = false
            if (formInputs.email == '') { validation.email = validationMessages.mandatoryMessage; error = true }
            if (formInputs.password == '') { validation.password = validationMessages.mandatoryMessage; error = true }
            if (error) {
                setFormValidationMessage(validation)
                return
            }
            setFormValidationMessage({ name: '', email: '', password: '', confirmPassword: '' })
            let result = await loginService({ email: formInputs.email, password: formInputs.password })
            if (result.status == 200) {
                sessionStorage.setItem('email', result.data.userData.email)
                sessionStorage.setItem('name', result.data.userData.name)
                sessionStorage.setItem('sourceId', result.data.userData._id)
                connectSocket()
                navigate('/chat',)
            }

        } catch (error) {
            console.log(error);
            if (error.response.status == 400) {
                setPopUp({ message: error.response.data, state: 'failure' })
            }
        }
    };

    function handleInputChange(e) {
        try {
            setFormInputs({ ...formInputs, [e.target.id]: e.target.value })
            if (e.target.id == 'email') {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regex.test(e.target.value)) {
                    setFormValidationMessage({ ...formValidationMessage, [e.target.id]: validationMessages.emailRegexMessage })
                }
                else {
                    setFormValidationMessage({ ...formValidationMessage, [e.target.id]: '' })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handlePopup() {
        setPopUp({ message: '', state: '' });
        if (popup.state == 'success') {
            navigate('/chat')
        }
    }

    return (
        <div style={{ backgroundColor: 'black' }}>
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="card p-4 bg-dark text-light">
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={formInputs.email}
                                onChange={handleInputChange}
                            />
                            <span hidden={formValidationMessage.email == ''} className="text-danger">*{formValidationMessage.email}</span>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={formInputs.password}
                                onChange={handleInputChange}
                            />
                            <span hidden={formValidationMessage.password == ''} className="text-danger">*{formValidationMessage.password}</span>
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
            {(popup.message != '') && < Popup message={popup.message} type={popup.state} onClose={handlePopup} />}
        </div>
    );
};

export default Login