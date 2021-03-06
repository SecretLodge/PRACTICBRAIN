const express = require('express');
const path = require('path');

const createPath = (page) => path.resolve(__dirname, '', `${page}.pug`);
const PORT = 8091;
const app = express();

app.use(express.static('assets'));
app.use(express.json());

app.set('view engine', 'pug');

app.listen(PORT, error => {
    error ? console.log(error) : console.log(`Listening PORT: ${PORT}`);
});

app.get('/trainings/:arithmetic', (request, response) => {
    response.render(createPath('index'));
});

app.post('/question', (request, response) => {
    response.json('hello');
});


app.get('', (request, response) => {
    response.send('ERROR 404');
});
