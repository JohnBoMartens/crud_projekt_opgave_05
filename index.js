const server = require('./lib/server');

const app = {}

// Vi initialiserer vores applikation.
app.init = () => {

    // Vi kalder run metoden på vores server module.
    server.run();

}

app.init();