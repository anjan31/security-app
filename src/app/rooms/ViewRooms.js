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
        {!roomJoined && <h2 className="heading">Available Rooms</h2>}
      <div className="button-container">

        {roomJoined ? (
            <button className="mdc-button-danger" onClick={async () => {
                await window.hangUp();
                window.location.reload();
            }}>Hang Up</button>
        ) : (
            rooms.map((room) => (
                <div className="items" key={room.id}>
                    <div>Room Id : {room.id}</div>
                    { room.name ? <div>Room Name : {room.name}</div> : <span></span>}

                    <button
                        className="mdc-button margin-top"
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