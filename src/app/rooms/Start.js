import React from 'react';
import './startButton.css';
import fbase from "../../config/Firebase";
import  { useState } from 'react';


function StartButton() {

  const currentUser = fbase.auth.currentUser.uid;
  console.log(currentUser);
  



  const [roomName, setRoomName] = useState('');


  return (
    <div className="start-button-container">

      <button className="mdc-button mdc-button--raised" onClick={window.openUserMedia}>
            <i className="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>
            <span className="mdc-button__label">Open camera & microphone</span>
            </button>

      
      <form>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(event) => setRoomName(event.target.value)}
      />
      <button className="start-button"  onClick={()=>window.createRoom(roomName,currentUser)}>Create Room</button>
    </form>

      <button className="start-button" onClick={window.hangUp}>Hangup</button>
    </div>
  );
}

export default StartButton;
