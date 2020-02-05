const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    let lookup = path.basename(decodeURI(req.url)) ||
        'index.html';
    let f = 'public/' + lookup;

    console.log(fs.existsSync(f) ? lookup + " file exist" : lookup + "file doesn't exist");

    // res.sendFile('index.html');
});

app.get('/random', (req, res) => {
    let randomImageNumbers = [];
    let num;
    let outputText = '';

    for (let i = 0; i < 3; i++) {
        num = Math.floor(Math.random() * 6);
        randomImageNumbers.push(num);
    }

    // Output text
    if (randomImageNumbers[0] === randomImageNumbers[1] && 
        randomImageNumbers[1] === randomImageNumbers[2] ) {
            outputText = 'Big Win!';
    } else if (randomImageNumbers[0] === randomImageNumbers[1] ||
        randomImageNumbers[1] === randomImageNumbers[2] ||
        randomImageNumbers[0] === randomImageNumbers[2]
        ) {
            outputText = 'Small Win!';
        } else {
            outputText = 'No Win!';
        }

    console.log('Array: ' + randomImageNumbers + ' ' + 'Result: ' + outputText);

    res.header("Access-Control-Allow-Origin", "*");

    res.json({
        'numbers': randomImageNumbers,
        'text': outputText
    });

    res.send();
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Slot app istening on port ${port}...`));