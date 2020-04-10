'use strict';
let localStream = null;
let peer = null;
let existingCall = null;

 
navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) { // 上記の処理をコールバックとして下記に渡す
        // Success
        $('#my-video').get(0).srcObject = stream;// my-videoの0番目をgetして格納
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

peer = new Peer({// peerオブジェクトを生成（外部）
    key: '231d89ea-e74e-497e-97ae-53c1d10f3585',
    debug: 3
});

peer.on('open', function(){// open字にテキストを記載
    $('#my-id').text(peer.id);
});

peer.on('error', function(err){// error時にアラート
    alert(err.message);
});

peer.on('close', function(){// 今回は必要ない
});

peer.on('disconnected', function(){// 今回は必要ない
});

$('#make-call').submit(function(e){
    e.preventDefault();// エラーは止める
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
});

$('#end-call').click(function(){// 終了処理 
    existingCall.close();
});

peer.on('call', function(call){// 
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){ // 発信処理
    if (existingCall) {
        existingCall.close();
    };
 
    existingCall = call;
 
    call.on('stream', function(stream){
        addVideo(call,stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}
// 下記はDOM操作
function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId){
    $('#' + peerId).remove();
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}
 
function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
