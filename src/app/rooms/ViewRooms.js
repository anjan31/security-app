import React, { useState, useEffect } from "react";

import fbase from "../../config/Firebase";
import Start from "./Start";

function RoomList() {
  const [rooms, setRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = fbase.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribeAuth();
    }, []);

  useEffect(() => {
    if (currentUser){
        const unsubscribe = fbase.db
            .collection('roomDetails')
            .where('uid' ,'==', currentUser.uid)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRooms(data);
            });
        return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div>

        Updated Version View Rooms

      <div id="videos">
        Local
        <video id="localVideo" muted autoPlay playsInline></video>
        Remote
        <video id="remoteVideo" muted autoPlay playsInline></video>

      </div>
      <button className="mdc-button mdc-button--raised" id="cameraBtn" onClick={window.openUserMedia}>
        <i className="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>
        <span className="mdc-button__label">Open camera & microphone</span>
      </button>

      {rooms.map((room) => (
        <div key={room.id}>
          <div>{room.id}</div>
          <div>{room.roomName}</div>
          <div>{room.description}</div>
          <button className="start-button" id='createBtn' onClick={()=>window.joinRoomById(room.id)}>Join Room</button>
        </div>
      ))}
    </div>
  );
}

export default RoomList;
