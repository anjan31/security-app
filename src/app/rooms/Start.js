import React ,{ useState, useEffect }from 'react';
import './startButton.css';
import fbase from "../../config/Firebase";

function StartButton({ onStart }) {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = fbase.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribeAuth();
    }, []);


    const createRoom = async ()=>{
        await window.createRoom();
        fbase.db.collection("roomDetails").doc(window.roomId).set({roomName: 'Drive',uid: currentUser.uid})
    }

  return (
    <div className="start-button-container">

      <button className="mdc-button" onClick={window.openUserMedia}>
            <i className="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>
            <span className="mdc-button__label">Give Access</span>
            </button>

      <button className="mdc-button "  onClick={createRoom}>Start</button>
      <button className="mdc-button-danger" onClick={window.hangUp}>Hangup</button>
    </div>
  );
}

export default StartButton;
