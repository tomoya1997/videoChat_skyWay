'use strict';
let localStream = null;
let peer = null;
let existingCall = null;

const myVideo = document.getElementById('my-video');
const theirVideo = document.getElementById('their-video');
const myIdSpan = document.getElementById('my-id');
const theirIdSpan = document.getElementById('their-id');
const makeCallForm = document.getElementById('make-call');
const endCallForm = document.getElementById('end-call');
const calltoIdInput = document.getElementById('callto-id');

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        myVideo.srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

peer = new Peer({
    key: '231d89ea-e74e-497e-97ae-53c1d10f3585',
    debug: 3
});

peer.on('open', function(){
    myIdSpan.textContent = peer.id;
});

peer.on('error', function(err){
    alert(err.message);
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});

makeCallForm.addEventListener('submit', function(e){
    e.preventDefault();
    const call = peer.call(calltoIdInput.value, localStream);
    setupCallEventHandlers(call);
});

endCallForm.addEventListener('click', function(){
    if (existingCall) {
        existingCall.close();
    }
});

peer.on('call', function(call){
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    }
 
    existingCall = call;
 
    call.on('stream', function(stream){
        addVideo(call, stream);
        setupEndCallUI();
        theirIdSpan.textContent = call.remoteId;
    });
    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

function addVideo(call, stream){
    theirVideo.srcObject = stream;
}

function removeVideo(peerId){
    const element = document.getElementById(peerId);
    if (element) {
        element.remove();
    }
}

function setupMakeCallUI(){
    makeCallForm.style.display = 'block';
    endCallForm.style.display = 'none';
}
 
function setupEndCallUI() {
    makeCallForm.style.display = 'none';
    endCallForm.style.display = 'block';
}
