const socket = io('/');
const cams = document.querySelector('section#cams');
const lumPeer = new Peer(undefined, {
  host: 'localhost',
  port: '8081',
  path: '/myapp'
});
const myCam = document.createElement('video');
myCam.muted = true;
const participants = {};

onload = function () {
  let room = roomName;
  room = room.replace('_', ' ');
  document.querySelector('#roomName').textContent = room;
  document.querySelector('#roomName').style.display = 'block';
  document.querySelector('.namePlaceholder').style.display = 'none';
}

const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  vidStream(myCam, stream);

  lumPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');

    call.on('stream', remoteStream => {
      vidStream(video, remoteStream);
    });
  });

  socket.on('usrconnected', uuid => {
    connectToNewUser(uuid, stream);
  });
});

socket.on('usrdisconnected', uuid => {
  if (participants[uuid]) participants[uuid].close();
});

lumPeer.on('open', id => {
  socket.emit('init', roomName, id);
});

function connectToNewUser(uuid, stream) {
  const call = lumPeer.call(uuid, stream);
  const video = document.createElement('video');
  call.on('stream', function(remoteStream) {
    console.log('yep');
    vidStream(video, remoteStream);
  });
  call.on('close', () => {
    video.remove();
  });

  participants[uuid] = call;
}

function vidStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  cams.append(video);
  //console.log('yep');
}

lumPeer.on('error', function (err) {
  console.log(err);
});