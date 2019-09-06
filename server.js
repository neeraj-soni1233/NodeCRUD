var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/model/vehicle');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set  port for server to listen
var port = process.env.PORT || 4000;

// Connect to DB

mongoose.connect('mongodb://localhost:27017/VehicleDb' ,{useNewUrlParser:true});

// Api Routes
var router = express.Router();

// Routes will all be prefixed with /api
app.use('/api', router);

// middleware to use for all requests landing
router.use(function(req, res, next) {
  console.log('FYI...There is some processing currently going down...');
  next();
});

// Test Route
router.get('/', function(req, res) {
  res.json({message: 'Guten Tag'});
});

router.route('/vehicles')
  .post(function(req, res) {
    var vehicle = new Vehicle(); // new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Vehicle data successfully Saved'});
    });
  })

  .get(function(req, res) {
    Vehicle.find(function(err, vehicles) {
      if (err) {
        res.send(err);
      }
      res.json(vehicles);
    });
  });

router.route('/vehicle/:vehicle_id')
  .get(function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/make/:make')
  .get(function(req, res) {
    Vehicle.find({make:req.params.make}, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/color/:color')
  .get(function(req, res) {
    Vehicle.find({color:req.params.color}, function(err, vehicle) {
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

// start server
app.listen(port);
// Printing server listining port
console.log('Server listening on port ' + port);
