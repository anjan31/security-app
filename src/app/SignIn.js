import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './Firebase';
import './SignIn.css';

export default function SignIn() {
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignIn = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const errorMessage = validateForm(email, password);
    setError(errorMessage);
    if (!errorMessage) {
      auth.signInWithEmailAndPassword(email, password)
        .then((auth) => {
          console.log(auth);
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
