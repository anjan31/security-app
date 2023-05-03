import React from 'react'
import Start from './Start';


function Add() {
  return (
    <div id="videos">
      Local
      <video id="localVideo" muted autoPlay playsInline></video>
      Remote
      <video id="remoteVideo" muted autoPlay playsInline></video>

      <Start/>
    </div>
  )
}

export default Add