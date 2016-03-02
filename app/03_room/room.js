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

		var socket = io();

		/*
		getUserMedia(conf, function(localMediaStream){
			var video = document.getElementById('localVideo');
			video.src = window.URL.createObjectURL(localMediaStream);
			socket.emit('video', video.src);
		}, function(err){
			console.log(err);
		});

		socket.on('video', function(localMediaStream){
			var video = document.getElementById('remoteVideo');
			video.src = localMediaStream;
		});
		*/

//----------------------------------------------------------------------------//

		var servers = {
			iceServers: [
				{url:'stun:stun.l.google.com:19302'},
				{url:'stun:stun1.l.google.com:19302'},
				{url:'stun:stun2.l.google.com:19302'},
				{url:'stun:stun3.l.google.com:19302'},
				{url:'stun:stun4.l.google.com:19302'}
			]
		};

		// Si el navegador es Firefox, quita los iceServers
		if (typeof InstallTrigger !== 'undefined') {
			servers = null;
		}

		var userMediaConf = {video: true, audio: false};

		var pc = new RTCPeerConnection(servers);

		pc.onaddstream = function(obj) {
			var video = document.createElement("video");
			document.getElementById("videoChat").appendChild(video);
			video.src = window.URL.createObjectURL(obj.stream);
			video.autoplay = true;
		}

		// Helper functions
		function endCall() {
			var videos = document.getElementsByTagName("video");
			for (var i = 0; i < videos.length; i++) {
				videos[i].pause();
			}

			pc.close();
		}

		function error(err) {
			endCall();
		}

//----------------------------------------------------------------------------//

		var numberOfPeople = 0;

		if (numberOfPeople == 0) {
			// Get a list of friends from a server
			// User selects a friend to start a peer connection with
			//
			getUserMedia(userMediaConf, function(stream) {
				// Adding a local stream won't trigger the onaddstream callback,
				// so call it manually.
				pc.onaddstream({stream: stream});
				pc.addStream(stream);

				pc.createOffer(function(offer) {
					pc.setLocalDescription(new RTCSessionDescription(offer), function() {
						// send the offer to a server to be forwarded to the friend you're calling.
						$scope.data.myOffer = offer;
						socket.emit('video offer', offer);
					}, error);
				}, error);
			}, error);
		}

		if (numberOfPeople != 0) {
			socket.on('video offer', function(offer){
				//if (offer.sdp != $scope.data.myOffer.sdp) {
					/*
					pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
						pc.createAnswer(function(answer) {
							pc.setLocalDescription(new RTCSessionDescription(answer), function() {
								// send the answer to a server to be forwarded back to the caller (you)
								$scope.data.myAnswer = answer;
								socket.emit('video answer', answer);
							}, error);
						}, error);
					}, error);
					*/
					getUserMedia({video: true}, function(stream) {
						pc.onaddstream({stream: stream});
						pc.addStream(stream);

						pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
							pc.createAnswer(function(answer) {
								pc.setLocalDescription(new RTCSessionDescription(answer), function() {
									// send the answer to a server to be forwarded back to the caller (you)
									$scope.data.myAnswer = answer;
									socket.emit('video answer', answer);
								}, error);
							}, error);
						}, error);
					}, error);
				//}
			});
		}

		socket.on('video answer', function(answer){
			if (answer != $scope.data.myAnswer) {
				pc.setRemoteDescription(new RTCSessionDescription(answer), function() { }, error);
			}
		});
//----------------------------------------------------------------------------//

		socket.on('chat message', function(msg){
			console.log(msg);
		});

		socket.emit('chat message', $scope.data.username);

		$(window).on('beforeunload', function(){
			socket.close();
		});

	}]);
