import React from 'react'
import Start from './Start';

function Add() {
  return (
    <div id="videos">
        <video id="localVideo" muted autoPlay playsInline></video>
        <video id="remoteVideo" muted autoPlay playsInline className="displayNone"></video>
      <Start/>
    </div>
    
  )
}

export default Add;