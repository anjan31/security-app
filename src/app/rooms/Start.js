import React ,{ useState, useEffect }from 'react';
import './startButton.css';
import fbase from "../../config/Firebase";

function StartButton({ onStart }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [name,SetName] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = fbase.auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        window.openUserMedia();

        return () => unsubscribeAuth();
    }, []);

    const createRoom = async () => {
      await window.createRoom();
      fbase.db.collection("roomDetails").doc(window.roomId).set({
        roomName: name,
        uid: currentUser.uid,
      });
      setRoomId(window.roomId);
    };
    

  return (
    <div className="start-button-container">

      {/*<button className="mdc-button" onClick={window.openUserMedia}>*/}
      {/*      <i className="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>*/}
      {/*      <span className="mdc-button__label">Give Access</span>*/}
      {/*      </button>*/}

        {
            roomId?
                (<button className="mdc-button-danger" onClick={()=>{
                    window.hangUp();
                    setRoomId(null);
                }}>Hangup</button>)
                :(
              <div>
                
                <div className="container">
                <form className="settings-form">
                  <h2>Room Details </h2>
                  
                  <div className="form-group">
                    <label>Room Name:</label>
                    <input type="text"  onChange={(e) => SetName(e.target.value)} />
                  </div>
                  <button className='mdc-button' onClick={createRoom}>Start</button>
                </form>
              </div>
            </div>
                
                )

        }

    </div>
  );
}

export default StartButton;
