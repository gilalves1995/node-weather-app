const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname);
console.log(path.join(__dirname, '../templates'));

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    // .render to serve hbs templates
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew Mead'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is an help message!',
        name: 'Andrew Mead'
    });
});

// Matches anything that starts with /help - must be after /help
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        } else {
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error });
                } else {
                    res.send({
                        forecast: forecastData,
                        location: location,
                        address: req.query.address
                    });
                }
            });
        }
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        });
    }
    res.send({
        products: []
    });
});

// Matches anything - must be in the end
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    });
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});


/* HEROKU */

/*
* Create an Heroku project:
*
* First, add the SSH key to protect the connection between our laptop and Heroku servers: type in the terminal "heroku keys:add" to search the ~/.ssh directory
* Second, the command "heroku create gilalves-name-of-the-project" from the main directory (WeatherApp) to create the new project

*
* To setup Heroku one must do the following:
*
* First: configure package.json to contain a script "start": "node src/app.js" so that Heroku knows how to run the app
* Second: in src/app.js change the port of the server to process.env.PORT || 3000 - will work both in heroku and in localhost
* Third: in public/js/app.js change remove the url http://localhost:3000 and leave the relative path to the resource
*
*
* Run "git push" to push changes to github
* Run "git push heroku master" to deploy the application
*
* */






// __dirname is the full path where the script lives and __filename is the full path to the file

// Handlebars - Template Engine to render dynamic web pages and way of reusing components such as headers
