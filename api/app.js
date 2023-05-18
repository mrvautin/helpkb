const session = require('express-session');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const prisma = require('./lib/prisma');
const { readEnv } = require('./lib/env');
readEnv();
const express = require('express');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

// Setup app
const app = express();

// Setup file upload
app.use(fileUpload({
    useTempFiles : true,
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.enable('trust proxy');
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
    ),
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
    }
}));
app.set('port', process.env.API_PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware
app.use(async (req, res, next) => {
    // Session checking, check for user
    if(req.session.userEmail){
        const user = await prisma.users.findFirst({
            where: {
                email: req.session.userEmail,
            }
        });
        if (user && user.email) {
            req.user = user;
        }
    }
    next();
});

// Routes
const api = require('./routes/api');
const auth = require('./routes/auth');
const users = require('./routes/users');
const settings = require('./routes/settings');
const category = require('./routes/category');
const menu = require('./routes/menu');
const website = require('./routes/website');

// Only load this route when in TEST
let oauth = null;
if (process.env.NODE_ENV === 'test') {
    oauth = require('./routes/oauth');
}

// CORS setup
app.use(cors({
    origin: [
        process.env.BASE_URL,
        `http://localhost:${process.env.UI_PORT}`,
        `http://lvh.me:${process.env.UI_PORT}`
    ],
    credentials: true
}));

// Setup the routes
app.use('/', api);
app.use('/', auth);
app.use('/', users);
app.use('/', settings);
app.use('/', category);
app.use('/', menu);
app.use('/', website);

// Only load this route when in TEST
if (process.env.NODE_ENV === 'test') {
    app.use('/', oauth);
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        if (err && err.code === 'EACCES') {
            res.status(400).json({ message: 'File upload error. Please try again.' });
            return;
        }
        res.status(err.status || 500);
        res.status(400).json({ message: err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    console.error(err.stack);
    if(err && err.code === 'EACCES'){
        res.status(400).json({ message: 'File upload error. Please try again.' });
        return;
    }
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

(async () => {
    try{    
        // Check for existing settings record
        const settingsCount = await prisma.settings.count();
        if(settingsCount === 0){
            // Add default settings record
            await prisma.settings.create({
                data: {
                    websiteName: 'helpkb',
                    websiteDescription: 'Welcome to helpkb where you can get help when you need it most.',
                    welcomeMessage: 'Welcome to helpkb!',
                    searchPlaceholder: 'Search helpkb...',
                    baseUrl: 'http://localhost:3000',
                    dateFormat: 'dd/MM/yyyy',
                    showArticleDetails: true,
                    indexType: 'categories'
                }
            });
        }
    }catch(ex){
        console.log('Cannot connect to DB', ex);
        process.exit(2);
    }

    // Start app
    await app.listen(app.get('port'));
    app.emit('appStarted');
    if(process.env.NODE_ENV !== 'test'){
        console.log(`helpkb running on host: http://localhost:${app.get('port')}`);
    }
})();

module.exports = app;
