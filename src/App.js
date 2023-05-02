import React from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import './App.css';
import fbase from "./config/Firebase";
import Dashboard from "./app/Dashboard";
import SignIn from "./app/SignIn";
import SignUp from "./app/SignUp";
import TopNavBar from "./app/navbar/TopNav";
import Settings from './app/Settings';
import ViewVideo from "./app/LiveVideo/ViewVideo";
import StartVideo from "./app/LiveVideo/StartVideo";
import Add from "./app/Rooms/Add";
import ViewRooms from "./app/Rooms/ViewRooms";


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
        {/*<Route path="/" element={<VideoRecorder/>}/>*/}
        <Route path="/pastvideos" element={<Dashboard/>}/>
        <Route path="/startvideo" element={<StartVideo/>}/>
        <Route path="/viewvideo" element={<ViewVideo/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/viewrooms" element={<ViewRooms/>}/>



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
