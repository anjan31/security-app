import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import fbase from "../../config/Firebase";

function TopNavBar({ onLogout }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = fbase.auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">Security</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {currentUser ? (
            <>
              <li><Link to="/pastvideos">Past Videos</Link></li>
              <li><button onClick={onLogout}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/signin">Sign In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default TopNavBar;
