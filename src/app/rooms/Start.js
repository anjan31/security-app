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
      const value = {
          uid: currentUser.uid,
      }
      if (name){
          value.name = name;
      }
        console.log(value)
      await fbase.db.collection("roomDetails").doc(window.roomId).set(value);
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
                
                <div className="start-card">
                    <div className="form-group">
                        <label>Room Name:</label><br/>
                        <input type="text"  onChange={(e) => {
                            console.log(e.target.value)
                            SetName(e.target.value)
                        }} />
                    </div>
                    <button className='mdc-button' onClick={createRoom}>Start</button>
                </div>
            </div>
                
                )

        }

    </div>
  );
}

export default StartButton;
