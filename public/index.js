const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {});

const peers = {};


const myVideo = document.createElement('video');
myVideo.muted = true;


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    // answer the call
    myPeer.on('call', call => {
        call.answer(stream);


        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })


    // when user connect
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
        console.log(userId);
    })


    // when user disconnect
    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
    })


})



myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})



function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoGrid.append(video);
}


function connectToNewUser(userId, strem) {

    const call = myPeer.call(userId, strem);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove();
    })

    peers[userId] = call;
}