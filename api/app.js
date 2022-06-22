const session = require('express-session');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { db } = require('./lib/db');
const { readEnv } = require('./lib/env');
readEnv();
const express = require('express');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({
    db: db()
});

// DB models
const UserModel = require('./models/users');
const ArticleModel = require('./models/articles');
const SettingModel = require('./models/settings');
const CategoryModel = require('./models/categories');
const MenuModel = require('./models/menus');

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
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
    }
}));
sessionStore.sync();
app.set('port', process.env.API_PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware
app.use(async (req, res, next) => {
    // Session checking, check for user
    if(req.session.userEmail){
        const user = await UserModel.findOne({
            where: {
                email: req.session.userEmail,
            },
            raw: true
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
        `http://localhost:${process.env.UI_PORT}`
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
    console.log('URL', req.url);
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
    // Startup DB
    try{
        await db().authenticate();

        // Setup DB models
        let dbForce = false;
        if(process.env.NODE_ENV === 'test'){
            dbForce = true;
        }
        await UserModel.sync({ alter: true, force: dbForce });
        await ArticleModel.sync({ alter: true, force: dbForce });
        await SettingModel.sync({ alter: true, force: dbForce });
        await CategoryModel.sync({ alter: true, force: dbForce });
        await MenuModel.sync({ alter: true, force: dbForce });
        
        // Check for existing settings record
        const settingsCount = await SettingModel.count({
            where: {
                id: 1
            }
        });
        if(settingsCount === 0){
            // Add default settings record
            await SettingModel.create({
                id: 1,
                websiteName: 'helpkb',
                websiteDescription: 'Welcome to helpkb where you can get help when you need it most.',
                welcomeMessage: 'Welcome to helpkb!',
                searchPlaceholder: 'Search helpkb...',
                baseUrl: 'http://localhost:3000',
                dateFormat: 'dd/MM/yyyy',
                showArticleDetails: true,
                indexType: 'categories'
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
