import './SignUp.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from './Firebase';

export default function SignUp() {
  const [error, setError] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const history = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirm = confirmRef.current.value;
    const errorMessage = validateForm(email, password, confirm);
    setError(errorMessage);
    if (!errorMessage) {
      auth.createUserWithEmailAndPassword(email, password)
        .then((auth) => {
          console.log(auth);
          history('/');
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const validateForm = (email, password, confirm) => {
    if (submitClicked && (!email || !password || !confirm)) {
      return 'Please fill in all fields';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password !== confirm) {
      return 'Passwords do not match';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email address';
    }
    return '';
  };

  return (
    <div className="signin">
      <form className="form">
        <h1>Sign Up</h1>
        <input
          ref={emailRef}
          className="inp1"
          type="text"
          placeholder="Email Address"
          onChange={() =>
            setError(
              validateForm(
                emailRef.current.value,
                passwordRef.current.value,
                confirmRef.current.value
              )
            )
          }
        />
        {submitClicked && error && <p className="error">{error}</p>}
        <input
          ref={passwordRef}
          className="inp2"
          type="password"
          placeholder="Password"
          onChange={() =>
            setError(
              validateForm(
                emailRef.current.value,
                passwordRef.current.value,
                confirmRef.current.value
              )
            )
          }
        />
        {submitClicked && error && <p className="error">{error}</p>}
        <input
          ref={confirmRef}
          className="inp2"
          type="password"
          placeholder="Confirm Password"
          onChange={() =>
            setError(
              validateForm(
                emailRef.current.value,
                passwordRef.current.value,
                confirmRef.current.value
              )
            )
          }
        />
        {submitClicked && error && <p className="error">{error}</p>}
        <button onClick={handleSignUp} className="butt">
          Sign Up
        </button>
        <h4>
          Already have an account?
          <span onClick={() => history('/signin')} className="sign">
            Sign In now
          </span>
          .
        </h4>
      </form>
    </div>
  );
}
