import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import './App.css';
import fbase from "./config/Firebase";
import Dashboard from "./app/Dashboard";
import SignIn from "./app/SignIn";
import SignUp from "./app/SignUp";
import VideoRecorder from "./app/VideoRecorder";
import TopNavBar from "./app/navbar/TopNav";

function MyRoutes() {
  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // const location = useLocation();
  // const allowedRoutes = ['/signup'];

  // useEffect(() => {
  //   const unregisterAuthObserver = fbase.auth.onAuthStateChanged((user) => {
  //     setIsLoading(false);
  //     if (!user && !allowedRoutes.includes(location.pathname)) {
  //       navigate('/signin');
  //     }
  //   });
  //   return () => unregisterAuthObserver();
  // }, [location]);

  function handleLogout() {
    fbase.auth.signOut()
      .then(() => {
        navigate('/signin');
      })
      .catch((error) => {
        // An error happened.
      });
  }

  // if (isLoading) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <ClipLoader color="#000000" size={50} />
  //     </div>
  //   );
  // }

  return (
    <div>
      <TopNavBar onLogout={handleLogout}/>
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/" element={<VideoRecorder/>}/>
        <Route path="/pastvideos" element={<Dashboard/>}/>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MyRoutes/>
    </Router>
  );
}

export default App;
