// configuration    =============================================================================================================================
    // Load required modules
    var http    		= require('http');				// http server core module
    var express 		= require('express');			// web framework external module
    var httpApp 		= express();
    var bodyParser 		= require('body-parser'); 		// pull information from HTML POST (express4)
    var methodOverride 	= require('method-override'); 	// simulate DELETE and PUT (express4)
    var io 				= require('socket.io');			// web socket external module

    // Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
    httpApp.use(express.static(__dirname + "/app/"));

    httpApp.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    httpApp.use(bodyParser.json());                                     // parse application/json
    httpApp.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    httpApp.use(methodOverride());

// define model     =============================================================================================================================
    var listOfRooms = {
        "rooms": [{
            "roomID": 1,
            "roomName": "Sala de pruebas",
			"roomOwner": "Basch",
            "password": "",
			"hasPassword": "No"
        },{
            "roomID": 2,
            "roomName": "Salón de juegos",
			"roomOwner": "Link",
            "password": "asddsa",
			"hasPassword": "Si"
        },{
            "roomID": 3,
            "roomName": "Sala DSP",
			"roomOwner": "Saix",
            "password": "",
			"hasPassword": "No"
        }]
    };

    // Lista de errores con código y texto
    function errorList(err) {
        var data = {};
        data.errorCode = err;
        data.errorText;
        data.errorVar;

        switch (err){
            case 1000:
                data.errorText = "El nombre de la sala ya existe";
                data.errorInput = "roomName";
                break;
            case 1001:
                data.errorText = "La ID no puede ir vacía";
                data.errorInput = "id";
                break;
            case 1002:
                data.errorText = "La ID debe ser un número";
                data.errorInput = "id";
                break;
            case 1003:
                data.errorText = "El texto no puede ir vacío";
                data.errorInput = "texto";
                break;
            case 1004:
                data.errorText = "";
                break;
            case 1005:
                data.errorText = "";
                break;
            case 1006:
                data.errorText = "";
                break;

            default:
                data.errorText = "Error desconocido";
        };

        return data;
    }

// routes           =============================================================================================================================

    // api ---------------------------------------------------------------------
    // get de la lista de elementos
    httpApp.get('/api/list-of-rooms', function(req, res) {
        res.json(listOfRooms);
    });

    // crea un elemento nuevo en la lista
    httpApp.post('/api/list-of-rooms', function(req, res, next) {
        var alreadyExists = false;

        listOfRooms.rooms.forEach(function(value, index, ar) {
            if (value.text == req.body.text) {
                alreadyExists = true;
            }
        });

        if (alreadyExists) {
            res.status(500).json(errorList(1000));
        } else if (req.body.id == null || req.body.id == "" || typeof(req.body.id) == 'undefined') {
            res.status(500).json(errorList(1001));
        } else if (isNaN(req.body.id)) {
            res.status(500).json(errorList(1002));
        } else if (req.body.text == null || req.body.text == "" || typeof(req.body.text) == 'undefined') {
            res.status(500).json(errorList(1003));
        } else {
            listOfRooms.rooms[listOfRooms.rooms.length] = {
                id: req.body.id,
                owner: req.body.owner,
                text: req.body.text
            };
            res.json(listOfRooms);
        }
    });

	// recupera una sala concreta mediante su ID
    httpApp.post('/api/get-room', function(req, res) {
		req.body.roomID;
        res.json(listOfRooms);
    });

    // TODO: Borrar un elemento y ordenar el array cada vez que se borra o se añade un elemento
    // Realizar llamadas desde el front-end
    // Controlar error que aparece en la consola del NodeJS
/*
    // borrar un elemento
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
*/

// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(8080);
io = io.listen(webServer);

io.sockets.on('connection', function (socket){

	// convenience function to log server messages on the client
	function log(){
		var array = [">>> Message from server: "];
		for (var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
		}
		socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message:', message);
		// for a real app, would be room only (not broadcast)
		socket.broadcast.emit('message', message);
	});

	socket.on('create or join', function (room) {
		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room ' + room);

		if (numClients === 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients === 1) {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
	});

});
