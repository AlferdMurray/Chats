import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        onSignIn(email, password);
    };

    return (
        <div style={{backgroundColor : 'black'}}>
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="card p-4 bg-dark text-light">
                    <h2 className="text-center">Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">
                            Sign In
                        </button>
                        <a className="mb-3" role="button" onClick={(e)=>navigate('/login')}>Already have an account?</a>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn