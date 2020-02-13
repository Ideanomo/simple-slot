const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('docs'));

app.get('/random', (req, res) => {
    let randomImageNumbers = [];
    let bonusSymbol = 0;
    let bonusGame = false;
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


    console.log(`Array ${randomImageNumbers} | Result ${outputText} | Bonus game ${bonusGame}`);

    res.header("Access-Control-Allow-Origin", "*");

    // Bonus game
    let numberOfFreeSpins = 0;
    randomImageNumbers.map(function (num, i) {
        if (bonusSymbol === num) {
            numberOfFreeSpins++;
            bonusGame = true;
        }
    });

    res.json({
        'numbers': randomImageNumbers,
        'text': outputText,
        'bonusGame': numberOfFreeSpins,
        'bonusMessage': "You've won " + numberOfFreeSpins + " free spin"
    });

    res.send();
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));