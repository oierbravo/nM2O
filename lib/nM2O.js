var osc = require('omgosc');
var midi = require('midi');

var DEBUG = true;

var nM2O = function(midiInId,midiOutId,oscTargetHost,oscSenderPort,oscReceiverPort){
  var self = this;
  self.sendOSCMessage = function(message){
    self.oscSender.send(message.path,message.typetag,message.params);
    if(DEBUG){
      console.log('OSC message sended:');
      console.log(message);
    }
  }
  self.oscMessageReceived = function(message){
    if(DEBUG){
      console.log('OSC Message received');
      console.log(message);
    }
      
  }
  self.sendMIDIMessage = function(message){
    self.midiOutput.sendMessage(message);
    if(DEBUG){
      console.log('MIDI message sended:');
      console.log(message);
    }
  }
  self.midiMessageReceived = function(deltaTime, message){
    if(DEBUG){
      console.log('MIDI Message received');
      console.log(deltaTime);
      console.log(message);
    }
  }
  self.closeMIDIPorts = function(){
    self.midiInput.closePort();
    self.midiOutput.closePort();
  }
  self.oscSender = new osc.UdpSender(oscTargetHost,oscSenderPort);
  
  self.oscReceiver = new osc.UdpReceiver(oscReceiverPort,"localhost");
  self.oscReceiver.on('',self.oscMessageReceived);
  
  self.midiInput = new midi.input();
  self.midiInput.openPort(midiInId);
  self.midiInput.on('message', self.midiMessageReceived);
  
  self.midiOutput = new midi.output();
  self.midiOutput.openPort(midiOutId);
  
  
  process.on('exit',function(){
    self.closeMIDIPorts();
  });
  
  return self;
}
var nm2o = new nM2O(1,2,"localhost",9000,9100);
