import React from 'react'
import Start from './Start';

function Add() {
  return (
    <div className="container">
    <form className="settings-form" >
      <h2>Video Preview</h2>
      <div className="form-group" id ="videos">
      <video id="localVideo" muted autoPlay playsInline></video>
      </div>
      <div className="form-group">
      <Start/>
      </div>
      
    </form>
  </div>
  

    
  )
}

export default Add;