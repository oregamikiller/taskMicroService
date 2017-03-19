var express = require('express'),
    config =  require('./config'),
    session = require('express-session'),
    SessionStore = require('connect-redis')(session),
    redis = new require('ioredis')(config.redisUrl),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema,
    bodyParser = require('body-parser'),
    bcrypt = require('bcryptjs'),
    bcryptGenSalt  = Promise.promisify(bcrypt.genSalt),
    bcryptHash     = Promise.promisify(bcrypt.hash),
    bcryptCompare  = Promise.promisify(bcrypt.compare),
    app = express();


function generatePasswordHash(password) {
    // Generate a new salt
    return bcryptGenSalt().then(function (salt) {
        // Hash the provided password with bcrypt
        return bcryptHash(password, salt);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function uid(len) {
    var buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length,
        i;

    for (i = 1; i < len; i = i + 1) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

var taskSchema = new Schema({
    id:  String,
    title: String,
    description: String,
    type:  String,
    user: String,
    param: Object,
    extra: Object,
    create_date: { type: Date, default: new Date().toLocaleString() },
});

var Task = mongoose.model('Task', taskSchema);

mongoose.connect(config.mongodbUrl);
mongoose.Promise = Promise;
app.set('trust proxy', 1);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
    Task.find({id:'test'}).exec().then(function(data) {
        res.json({msg: 'ok', tasks: data});
    });
});

app.post('/', function(req, res) {
    let task = new Task({id:'test', description: 'first test task', user:'test', param: {myparm: {hi: 'aaa'}}});
    task.save().then(function (data) {
        res.json({msg:'ok', data: data.toObject()});

    })
});

app.listen(config.port);

console.log("Server is listening: " + config.port);


process.on("uncaughtException", function (err) {
    console.log(err);
});
