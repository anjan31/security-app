import React from 'react';
import './startButton.css';

function StartButton({ onStart }) {
  return (
    <div className="start-button-container">

      <button className="mdc-button mdc-button--raised" id="cameraBtn" onClick={window.openUserMedia}>
            <i className="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>
            <span className="mdc-button__label">Open camera & microphone</span>
            </button>

      <button className="start-button" id='createBtn' onClick={window.createRoom}>Start</button>
    </div>
  );
}

export default StartButton;
