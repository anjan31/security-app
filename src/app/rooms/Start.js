import React, { useState, useEffect } from 'react';
import './startButton.css';
import fbase from '../../config/Firebase';

function StartButton({ onStart }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = fbase.auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleStartClick = async () => {
    if (roomName) {
      setIsModalOpen(false);
      await window.createRoom();
      fbase
        .db.collection('roomDetails')
        .doc(window.roomId)
        .set({ roomName: roomName, uid: currentUser.uid });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="start-button-container">
      <div className="button-row">
        <button
          className="mdc-button mdc-button--raised camera-btn"
          onClick={window.openUserMedia}
        >
          <i className="material-icons mdc-button__icon" aria-hidden="true">
            perm_camera_mic
          </i>
          <span className="mdc-button__label">Open camera & microphone</span>
        </button>

        <button className="start-button" onClick={() => setIsModalOpen(true)}>
          Start (Create Button UID)
        </button>

        <button className="start-button" onClick={window.hangUp}>
          Hangup
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create Room</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="material-icons">close</i>
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="roomName">Room Name:</label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="start-button" onClick={handleStartClick}>
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartButton;