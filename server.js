    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var Schema = mongoose.Schema;


  
    // configuration =================

    mongoose.connect('mongodb://localhost/todo')
    .catch(err => { // we will not be here...
      console.error('App starting error:', err.stack);
      process.exit(1);
      });     // connect to mongoDB database on modulus.io
      


    var schema = new mongoose.Schema({ id: 'string', name: 'string' });
    var ProductId = mongoose.model('ProductId', schema);

    
 




    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

     // define model =================
    
        // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

      // use mongoose to get all todos in the database
      Todo.find(function(err, todos) {

          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err)
              res.send(err)

          res.json(todos); // return all todos in JSON format
      });
  });

  // create todo and send back all todos after creation
  app.post('/api/todos', function(req, res) {

      // create a todo, information comes from AJAX request from Angular
      Todo.create({
          text : req.body.text,
          done : false
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

  // delete a todo
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


  app.get('/api/productIds',function(req,res){
     ProductId.find(function(err,docs)
{
    console.log(docs);
    res.json(docs);
});
    
  //  console.log(result);
        // get and return all the todos after you create another
        
    
  })

  app.post('/api/productIds',function(req,res){
    
    var newProduct = new ProductId({name: req.body.text})
    newProduct.save((err,response)=>{
        console.log(response);

        ProductId.find(function(err, products) {
            if (err)
                res.send(err)
            res.json(products);
      
    });
        
    })
    
      
  })

      // application -------------------------------------------------------------
      app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

