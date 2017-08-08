var bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    express    = require('express'),
    app        = express(),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');
    require('dotenv').config();
    
//APP CONFIG

/*var sound = new Howl({
  src: ['sound/Huta.mp3']
});
sound.play();*/

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));


//MONGOOSE/MODEL CONFIG

mongoose.connect(process.env.DATABASE_URL, {
  useMongoClient: true,});
  
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

/*Blog.create({
    title: 'Test Blog',
    image: 'http://i.imgur.com/nrNKDra.jpg',
    body: 'This is just a test post'
});*/

//ROUTES

app.get('/', function(req, res){
    res.redirect('/blogs');
});
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('Error!');
        } else{
            res.render('index', {blogs:blogs});
            //sound.play();
        }
    });
});

app.get('/blogs/new', function(req, res){
    res.render('new');
});

app.post('/blogs', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else{
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlogpost){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show',{blog: foundBlogpost});
        }
    });
    
});

app.get('/blogs/:id/edit', function(req, res){
   Blog.findById(req.params.id, function(err, foundBlogpost){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit',{blog: foundBlogpost});
        }
    });
});

app.put('/blogs/:id', function(req, res){
    setTimeout(function(){}, 10000);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlogpost){
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    });
});

app.delete('/blogs/:id', function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect('/blogs');
       } else {
           res.redirect('/blogs');
       }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server is running!');
});