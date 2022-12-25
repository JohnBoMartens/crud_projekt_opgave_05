// Requires
const express = require('express');
const path = require('path');
const users = require('./users');
const database = require('./middleware/database');
const multer = require('multer');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const cookieAuth = require('./middleware/cookieAuth');
const configuration = require('./config/configuration');

// Constants.
const expressServer = express();

// Express server use(s).
// Dette er moduler til Express serveren.

// Dette er "middleware" services til express.
// Det er moduler der udføre opgaver og som simplificere de opgaver vi har med f.eks:

// 1. Modtage JSON.
expressServer.use(express.json());

// Vi benytter Cors som middelware for at kunne sende data "cross-domain". 
expressServer.use(cors())

// Vi benytter CookieParser middelware for at læse cookies fra server og client.
expressServer.use(cookieParser())

// 2. Eksponere statiske filer. Her angiver vi hvilke mapper det er tilladt for en client at hente.
expressServer.use(express.static('client'));    // --> Vores client filer, js, css osv.
expressServer.use(express.static('storage'));   // --> Vores profil billeder.


// 3. Urlencode ¨parser" form post´s til objects. 
expressServer.use(express.urlencoded({
    extended: true
}));

// Skab kontakt til database. Vi benytter "connect" metoden i vores database fil og skaber kontakt til vores database.
database.connect();

// Multer upload. Opsætter multer til gemme billeder i profiles mappen under storage.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './storage/users/profiles')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname + '.png')

    }
})

const upload = multer({storage : storage})

// Server Module.
const server = {};

/*


    Endpoints til backoffice klient routes


*/

// Route til vores Klient forside.
expressServer.get('/', cookieAuth, (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/frontpage.html'))
    
});

expressServer.get('/create', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/create.html'))

});

expressServer.get('/read', cookieAuth, (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/read.html'))

});

expressServer.get('/update', cookieAuth, (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/update.html'))

});

expressServer.get('/delete', cookieAuth, (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/delete.html'))

});

expressServer.get('/upload', cookieAuth, (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/upload.html'))

});

expressServer.get('/login', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/login.html'))

});

/*


    Endpoints til backend routes


*/

// Route til at hente alle brugere.
expressServer.get('/users/all', (req, res) => {

    users.getUsers( (code, returnObj) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })
})

// Route til at hente én bruger.
expressServer.get('/users/:id', (req, res) => {

    users.getUserByID(req.params.id, (code, returnObj) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })

})

expressServer.post('/users/register', (req, res) => {

    users.registerUser(req.body, (code, returnObj) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })
})

expressServer.delete('/users/delete', auth, (req, res) => {

    users.deleteUser(req.body, (code, returnObj) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })


})

expressServer.put('/users/update', (req, res) => {

    users.updateUser(req.body, (code, returnObj) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })

})

expressServer.post('/users/profile', upload.single('profile'), (req, res) => {

    users.updateProfile(req.body, (code, returnObj) => {

        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);

    })
})

expressServer.post('/users/login', (req, res) => {

    users.loginUser(req.body, (code, returnObj) => {

        if(returnObj.token) {

            let age = returnObj.expire * 1000;
            res.cookie('token', returnObj.token, {maxAge : age, secure: false})

        }

        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })

})


// Undersøger om vi rammer en route vi ikke har defineret, vi sender en 404 status kode og præsentere en 404 side.
// Prøv feks "localhost:3000/minside" som vi ikke har oprettet en route til.
expressServer.get('*', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.status(404);
    res.sendFile(path.resolve(__dirname, '../client/404.html'))

});

// Starter Express server, og vi lytter på requests/forespørgelser.
server.run = () => {

    console.log('\n\n---------------------')
    console.log('Starter server')

    const port = configuration.port;

    expressServer.listen(port, () => {

        console.log('Server er startet, lytter på http://localhost:' + port);

        console.log('---------------------\n')
    })
}

// Exporterer vores server module objekt.
module.exports = server;