import React from 'react';
import './startButton.css';

function StartButton({ onStart }) {
  return (
    <div className="start-button-container">
      <button class="mdc-button mdc-button--raised" id="cameraBtn">
            <i class="material-icons mdc-button__icon" aria-hidden="true">perm_camera_mic</i>
            <span class="mdc-button__label">Open camera & microphone</span>
            </button>

      <button className="start-button" id='createBtn'>Start</button>
    </div>
  );
}

export default StartButton;
