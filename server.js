// configuration    =============================================================================================================================
    // Load required modules
    var http    = require("http");              // http server core module
    var express = require("express");           // web framework external module
    var httpApp = express();
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    //    var io      = require("socket.io");         // web socket external module
    //    var easyrtc = require("easyrtc");           // EasyRTC external module

    // Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
    httpApp.use(express.static(__dirname + "/app/"));

    httpApp.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    httpApp.use(bodyParser.json());                                     // parse application/json
    httpApp.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    httpApp.use(methodOverride());

// define model     =============================================================================================================================
    var Lista = {
        "elementos": [{
            "id": 1,
            "text": "Texto de prueba"
        },{
            "id": 2,
            "text": "Segundo elemento"
        }]
    };

// routes           =============================================================================================================================

    // api ---------------------------------------------------------------------
    // get de la lista de elementos
    httpApp.get('/api/lista', function(req, res) {
        res.json(Lista);
    });

    // crea un elemento nuevo en la lista
    httpApp.post('/api/lista', function(req, res) {
        var alreadyExists = false;

        Lista.elementos.forEach(function(value, index, ar) {
            if (value.id == req.body.id) {
                alreadyExists = true;
            }
        });

        if (!alreadyExists) {
            Lista.elementos[Lista.elementos.length] = {
                id: req.body.id,
                text: req.body.text
            };
            res.json(Lista);
        } else {
            res.send({
                "Error": "El elemento ya existe"
            });
        }
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
// Start Socket.io so it attaches itself to Express server
//    var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
//    var rtc = easyrtc.listen(httpApp, socketServer);

// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(8080);