import React, { useState, useEffect } from "react";
import './startButton.css';

import fbase from "../../config/Firebase";
import Start from "./Start";
import './Add.css';

function RoomList() {
  const [rooms, setRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [roomJoined, setRoomJoined] = useState(false);

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
        window.openUserMedia();
        return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div>
      <div id="videos" className="container">
          <video id="localVideo" muted autoPlay playsInline className="displayNone"></video>
            <video id="remoteVideo" muted autoPlay playsInline className={roomJoined? '': 'displayNone'}></video>
      </div>
      <div className="start-button-container">
      {/*<button className="mdc-button" id="cameraBtn" onClick={window.openUserMedia}>*/}
      {/*  <i className="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>*/}
      {/*  <span className="mdc-button">Give Access</span>*/}
      {/*</button>*/}

        {roomJoined ? (
            <button className="mdc-button-danger" onClick={async () => {
                await window.hangUp();
                window.location.reload();
            }}>Hang Up</button>
        ) : (
            rooms.map((room) => (
                <div key={room.id}>
                    <div><h4>{room.roomName}</h4></div>
                    <div>{room.id}</div>

                    <div>{room.description}</div>
                    <button
                        className="mdc-button"
                        id="createBtn"
                        onClick={() => {
                            window.joinRoomById(room.id);
                            setRoomJoined(true);
                        }}
                    >
                        Join Room
                    </button>
                </div>
            ))
        )}
        </div>
    </div>
  );
}

export default RoomList;