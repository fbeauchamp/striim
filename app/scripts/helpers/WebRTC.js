/*global define:true */
define([
    'underscore',
    'webrtcadapter'
], function (_, adpater) {
    'use strict';
    console.log('ADAPTER',adpater);
    var RTCPeerConnection = adpater.RTCPeerConnection;
    var RTCSessionDescription = adpater.RTCSessionDescription;
    var RTCIceCandidate = adpater.RTCIceCandidate;
    var getUserMedia = adpater.getUserMedia;

    var pcConfig = {iceServers: [
        {url: 'stun:23.21.150.121'},
        {url: 'stun:stun.l.google.com:19302'},
        {url: 'turn:numb.viagenie.ca:3478', username: 'florent.beauchamp%40gmail.com', 'credential': 'striimisgood4u'}
    ]};
    var pcConstraints = {optional: [
        {DtlsSrtpKeyAgreement: true}
    ]};
    // Set up audio and video regardless of what devices are present.
    var sdpConstraints = {'mandatory': {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }};

    var constraints = {
        mandatory: {
            //OfferToReceiveAudio: true,
            //OfferToReceiveVideo: true
        }
    };

    var initPeerConnection = function (local, remote, isLocalCaller, success, error) {
        var pc = new RTCPeerConnection(pcConfig, pcConstraints);
        remote.set('peerconnection', pc); //should handle multiple peer connection ?

        _.each(local.get('streams'), function (stream) {
            pc.addStream(stream);
        });
        pc.onaddstream = function (event) {

            //remote.trigger('addStream', remote, event.stream);
            var streams = remote.get('streams');
            streams.push(event.stream);
            remote.set('streams', streams);
            //streams is an arrya, it does not trigger built in events
            remote.trigger('change', remote);
            remote.trigger('change:streams', remote, streams);
        };

        pc.onremovestream = function (event) {
            remote.trigger('removeStream', remote, event.stream);
        };

        pc.onicecandidate = function (event) {
            if (event.candidate) {
                remote.message('rtc', {
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            } else {
                success.call(null, pc);
            }
        };


        local.on('rtc', function (message) {
            //message from this remote peer to local peer
            //there can be multiple peer connection simultaneously
            if (message.from === remote.id) {
                if (message.type === 'offer') {
                    console.log('>>>OFFER RECEIVED');
                    pc.setRemoteDescription(
                        new RTCSessionDescription(message),
                        function () {
                            handleIceCandidate(); //remote description is set , now it's time to look into ice candidate
                        },
                        error
                    );
                    console.log('>>>MAKE ANSWER');
                    pc.createAnswer(
                        function (sdp) {
                            pc.setLocalDescription(sdp,
                                function () {},
                                error
                            );
                            remote.message('rtc', sdp);
                        },
                        error,
                        sdpConstraints
                    );

                } else if (message.type === 'answer') {
                    console.log('>>>ANSWER RECEIVED');
                    pc.setRemoteDescription(
                        new RTCSessionDescription(message),
                        function () {
                            handleIceCandidate(); //remote description is set , now it's time to look into ice candidate
                        },
                        error
                    );
                } else if (message.type === 'candidate') {
                    handleIceCandidate(message);
                }
            }
        });


        if (isLocalCaller) {
            console.log('>>>MAKE OFFER');
            pc.createOffer(
                function (sdp) {
                    pc.setLocalDescription(sdp,
                        function () {},
                        error
                    );
                    remote.message('rtc', sdp);
                },
                error, constraints);
        }


        var iceCandidateBuffer = [];

        function handleIceCandidate(message) {

            if (!pc.remoteDescription) {
                //cant process it for now, it will make  peerConnection.addIceCandidate giving error: invalid string
                // buffer it
                iceCandidateBuffer.push(message);
            } else {
                while (iceCandidateBuffer.length) {
                    addIceCandidate(iceCandidateBuffer.shift());
                }
                if (message) {
                    addIceCandidate(message);
                }
            }
        }

        function addIceCandidate(message) {
            var candidate = new RTCIceCandidate({sdpMLineIndex: message.label,
                candidate: message.candidate});
            pc.addIceCandidate(candidate);
        }
    };

    var getLocalScreen = function (opts, success, err) {
        var screenSharing =
            !navigator.userAgent.match(/android/i) &&/* not on smartiphone/tablette*/
                navigator.userAgent.match('Chrome') && /* on crome */
                parseInt(navigator.userAgent.match(/Chrome\/(.*) /)[1], 10) >= 26; /*26 and more*/

        if (!screenSharing) {
            err.call(null, new Error('This browser doesn\'t support screen sharing'));
            return;
        }
        var screenConstraints = {
            mandatory: {
                chromeMediaSource: 'screen',
                maxWidth: 1280,
                maxHeight: 720
            },
            optional: []
        };
        var constraints = {
            audio: false,
            video: screenConstraints
        };
        try {
            getUserMedia(constraints,
                success,
                err);
        } catch (e) {
            if (err) {
                err.call(null, new Error('getUserMedia() failed. Is this a WebRTC capable browser?'));
            } else {
                console.log(e);
            }
        }
    };
    var getLocalWebcam = function (opts, success, err) {
        var mediaConstraints = {audio: true, video: true};

        if (opts.audio === false){
            mediaConstraints.audio = false;
        }
        if (opts.video === false){
            mediaConstraints.video = false;
        }

        if (mediaConstraints.video && opts.hd) {
            mediaConstraints.video.mandatory = {
                minWidth: 1280,
                minHeight: 720
            };
        }
        try {

            getUserMedia(mediaConstraints, success, err);
        } catch (e) {
            console.log('dans webrtc');
            console.log(e);
            if (err) {
                err.call(null, new Error('getUserMedia() failed. Is this a WebRTC capable browser?'));
            } else {
                console.log(e);
            }
        }
    };

    return {
        initPeerConnection: initPeerConnection,
        getLocalScreen: getLocalScreen,
        getLocalWebcam: getLocalWebcam
    };
});
