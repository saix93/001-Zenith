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

		socket.on('chat message', function(msg){
			console.log(msg);
		});

		socket.emit('chat message', $scope.data.username);

		$(window).on('beforeunload', function(){
			socket.close();
		});

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
			console.log(obj.stream);
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
			console.log(err);
		}

		$scope.data.myOffer = {};
		$scope.data.myAnswer = {};

		getUserMedia(userMediaConf, function(stream) {
			pc.onaddstream({stream: stream});
			pc.addStream(stream);
		}, error);

		socket.on('offer', function(offer) {
			if (offer.sdp != $scope.data.myOffer.sdp) {
				pc.setRemoteDescription(new RTCSessionDescription(offer), function() {
					pc.createAnswer(function(answer) {
						pc.setLocalDescription(answer, function() {
							// send the answer to a server to be forwarded back to the caller (you)
							$scope.data.myAnswer = answer;
							socket.emit('answer', answer);
						}, error);
					}, error);
				}, error);
			}
		});

		socket.on('answer', function(answer){
			if (answer.sdp != $scope.data.myAnswer.sdp) {
				pc.setRemoteDescription(new RTCSessionDescription(answer), function() {
					console.log("OKI DOKI");
				}, error);
			}
		});

		$scope.call = function() {
			pc.createOffer(function(offer) {
				pc.setLocalDescription(offer, function() {
					// send the offer to a server to be forwarded to the friend you're calling.
					$scope.data.myOffer = offer;
					socket.emit('offer', offer);
				}, error);
			}, error);
		};

		pc.onicecandidate = function (event) {
			console.log("New Candidate");
			console.log(event.candidate);

			socket.emit('candidate',event.candidate);
		};

		socket.on('candidate', function (candidate) {
			console.log("New Remote Candidate");
			console.log(candidate);

			try {
				pc.addIceCandidate(new RTCIceCandidate({
					sdpMLineIndex: candidate.sdpMLineIndex,
					candidate: candidate.candidate
				}));
			} catch(err) {
				console.log(err);
			}
		});
	}]);
