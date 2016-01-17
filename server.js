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
            "owner": "Basch",
            "text": "Sala de Basch"
        },{
            "id": 2,
            "owner": "Link",
            "text": "Sala de Link"
        },{
            "id": 3,
            "owner": "Saix",
            "text": "DSPRoom"
        }]
    };

    //Lista de errores con código y texto
    function errorList(err) {
        var data = {};
        data.errorCode = err;
        data.errorText;
        data.errorVar;

        switch (err){
            case 1000:
                data.errorText = "La ID ya existe";
                data.errorInput = "id";
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
    httpApp.get('/api/lista', function(req, res) {
        res.json(Lista);
    });

    // crea un elemento nuevo en la lista
    httpApp.post('/api/lista', function(req, res, next) {
        var alreadyExists = false;

        Lista.elementos.forEach(function(value, index, ar) {
            if (value.id == req.body.id) {
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
            Lista.elementos[Lista.elementos.length] = {
                id: req.body.id,
                owner: req.body.owner,
                text: req.body.text
            };
            res.json(Lista);
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