import React, { useRef, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './SignIn.css';
import fbase from "../config/Firebase";

export default function SignIn() {
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const errorMessage = validateForm(email, password);
    setError(errorMessage);
    if (!errorMessage) {
      fbase.auth.signInWithEmailAndPassword(email, password)
        .then((auth) => {
          navigate('/');
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }

  const validateForm = (email, password) => {
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email address';
    }
    return '';
  }

  return (
    <div className="signin">
      <form className='form'>
        <h1>Sign In</h1>
        <input ref={emailRef} className='inp1' type="text" placeholder='Email Address' />
        <input ref={passwordRef} className='inp2' type="password" placeholder='Password' />
        <button onClick={handleSignIn} className='butt'>Sign In</button>
        {error && <p className='error'>{error}</p>}
        <h4>New to HomeSecurity?
          <Link to="/signup" className='sign'> Sign Up now</Link>.
        </h4>
      </form>
    </div>
  )
}
