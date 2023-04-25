import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import SignIn from "./app/SignIn.js"
import firebase from './app/Firebase';
import SignUp from "./app/SignUp.js"
import VideoRecorder from './app/VideoRecorder';
import Dashboard from './app/Dashboard';

function MyRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        navigate('/signin');
      }
    });

    return () => unregisterAuthObserver();
  }, [navigate]);

  return (
      <Routes>
        <Route path="/pastvideos" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<VideoRecorder />} />
      </Routes>
  );
}

function App()  {


  return (
    <Router>
      <MyRoutes/>
    </Router> 
  );
}
export default App;
