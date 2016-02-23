'use strict';

angular.module('zenith.room', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/room', {
        templateUrl: '03_room/room.html',
        controller: 'RoomCtrl'
    });
}])

.controller('RoomCtrl', ['$scope', '$location', '$http', 'CommonFunctions', 'Data',
    function($scope, $location, $http, CommonFunctions, Data) {
		var lsData = CommonFunctions.loadData();
		if (lsData != null) {
			$scope.data = lsData;
		}

        $scope.errorModel = {};

		/*
		var localStream, localPeerConnection, remotePeerConnection;

		var localVideo = document.getElementById("localVideo");
		var remoteVideo = document.getElementById("remoteVideo");

		var startButton = document.getElementById("startButton");
		var callButton = document.getElementById("callButton");
		var hangupButton = document.getElementById("hangupButton");
		startButton.disabled = false;
		callButton.disabled = true;
		hangupButton.disabled = true;
		startButton.onclick = start;
		callButton.onclick = call;
		hangupButton.onclick = hangup;

		function trace(text) {
			console.log((performance.now() / 1000).toFixed(3) + ": " + text);
		}

		function gotStream(stream){
			trace("Received local stream");
			localVideo.src = URL.createObjectURL(stream);
			localStream = stream;
			callButton.disabled = false;
		}

		function start() {
			trace("Requesting local stream");
			startButton.disabled = true;
			getUserMedia({video:true}, gotStream,
			function(error) {
				trace("getUserMedia error: ", error);
			});
		}

		function call() {
			callButton.disabled = true;
			hangupButton.disabled = false;
			trace("Starting call");

			if (localStream.getVideoTracks().length > 0) {
				trace('Using video device: ' + localStream.getVideoTracks()[0].label);
			}
			if (localStream.getAudioTracks().length > 0) {
				trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
			}

			var servers = null;

			localPeerConnection = new RTCPeerConnection(servers);
			trace("Created local peer connection object localPeerConnection");
			localPeerConnection.onicecandidate = gotLocalIceCandidate;

			remotePeerConnection = new RTCPeerConnection(servers);
			trace("Created remote peer connection object remotePeerConnection");
			remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
			remotePeerConnection.onaddstream = gotRemoteStream;

			localPeerConnection.addStream(localStream);
			trace("Added localStream to localPeerConnection");
			localPeerConnection.createOffer(gotLocalDescription,handleError);
		}

		function gotLocalDescription(description){
			localPeerConnection.setLocalDescription(description);
			trace("Offer from localPeerConnection: \n" + description.sdp);
			remotePeerConnection.setRemoteDescription(description);
			remotePeerConnection.createAnswer(gotRemoteDescription,handleError);
		}

		function gotRemoteDescription(description){
			remotePeerConnection.setLocalDescription(description);
			trace("Answer from remotePeerConnection: \n" + description.sdp);
			localPeerConnection.setRemoteDescription(description);
		}

		function hangup() {
			trace("Ending call");
			localPeerConnection.close();
			remotePeerConnection.close();
			localPeerConnection = null;
			remotePeerConnection = null;
			hangupButton.disabled = true;
			callButton.disabled = false;
		}

		function gotRemoteStream(event){
			remoteVideo.src = URL.createObjectURL(event.stream);
			trace("Received remote stream");
		}

		function gotLocalIceCandidate(event){
			if (event.candidate) {
				remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
				trace("Local ICE candidate: \n" + event.candidate.candidate);
			}
		}

		function gotRemoteIceCandidate(event){
			if (event.candidate) {
				localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
				trace("Remote ICE candidate: \n " + event.candidate.candidate);
			}
		}

		function handleError(){}
		*/

		var isInitiator;

		var room = prompt("Enter room name:");

		var socket = io.connect();

		if (room !== "") {
			console.log('Joining room ' + room);
			socket.emit('create or join', room);
		}

		socket.on('full', function (room){
			console.log('Room ' + room + ' is full');
		});

		socket.on('empty', function (room){
			isInitiator = true;
			console.log('Room ' + room + ' is empty');
		});

		socket.on('join', function (room){
			console.log('Making request to join room ' + room);
			console.log('You are the initiator!');
		});

		socket.on('log', function (array){
			console.log.apply(console, array);
		});
	}]);
