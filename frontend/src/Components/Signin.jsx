import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validationMessages } from "../constant";
import { signInService } from "../Service/chatService";
import Popup from "./Popup";

const SignIn = ({ onSignIn }) => {
    const [formInputs, setFormInputs] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [formValidationMessage, setFormValidationMessage] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [popup, setPopUp] = useState({ state: '', message: '' })
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let validation = { name: '', email: '', password: '', confirmPassword: '' }
            debugger
            let error = false
            if (formInputs.name == '') { validation.name = validationMessages.mandatoryMessage; error = true }
            if (formInputs.email == '') { validation.email = validationMessages.mandatoryMessage; error = true }
            if (formInputs.password == '') { validation.password = validationMessages.mandatoryMessage; error = true }
            if (formInputs.confirmPassword == '') { validation.confirmPassword = validationMessages.mandatoryMessage; error = true }
            if (error) {
                setFormValidationMessage(validation)
                return
            }
            if (formInputs.password !== formInputs.confirmPassword) {
                validation.password = validationMessages.passwordMismatch
                validation.confirmPassword = validationMessages.passwordMismatch
                setFormValidationMessage(validation)
                return
            }
            setFormValidationMessage({ name: '', email: '', password: '', confirmPassword: '' })
            let result = await signInService({ name: formInputs.name, email: formInputs.email, password: formInputs.password })
            if (result.status == 201) {
                setPopUp({ message: result.data, state: 'success' })
            }

        } catch (error) {
            console.log(error);
            if (error.response.status == 409) {
                setPopUp({ message: error.response.data.message, state: 'failure' })
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
            navigate('/login')
        }
    }

    return (
        <div style={{ backgroundColor: 'black' }}>
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="card p-4 bg-dark text-light">
                    <h2 className="text-center">Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={formInputs.name}
                                onChange={(e) => handleInputChange(e)}
                            />
                            <span hidden={formValidationMessage.name == ''} className="text-danger">*{formValidationMessage.name}</span>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={formInputs.email}
                                onChange={(e) => handleInputChange(e)}
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
                                onChange={(e) => handleInputChange(e)}
                            />
                            <span hidden={formValidationMessage.password == ''} className="text-danger">*{formValidationMessage.password}</span>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                value={formInputs.confirmPassword}
                                onChange={(e) => handleInputChange(e)}
                            />
                            <span hidden={formValidationMessage.confirmPassword == ''} className="text-danger">*{formValidationMessage.confirmPassword}</span>
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            Sign In
                        </button>
                        <a className="mb-3" role="button" onClick={(e) => navigate('/login')}>Already have an account?</a>
                    </form>
                </div>
            </div>
            {(popup.message != '') && <Popup message={popup.message} type={popup.state} onClose={() => { handlePopup() }} />}
        </div>
    );
};

export default SignIn