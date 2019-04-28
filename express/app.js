const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('NodeJS app');
});

app.get('/random', (req, res) => {
    let randomImageNumbers = [];
    let num;

    for (var i = 0; i < 3; i++) {
        num = Math.floor(Math.random() * 6) + 1;
        randomImageNumbers.push(num);
    }

    console.log(randomImageNumbers, typeof(randomImageNumbers));

    res.header("Access-Control-Allow-Origin", "*");
    res.json({'numbers': randomImageNumbers});
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));