const express = require('express');
const app = express();

app.use(function (req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization'); 
    res.setHeader('Access-Control-Allow-Credentials', true); 
    if ('OPTIONS' === req.method) { 
        res.send(204); 
    } else { 
        next(); 
    } 
}); 

app.get('/', (req, res) => {
    res.send('NodeJS app');
});

app.get('/random', (req, res) => {
    let randomImageNumbers = [];
    let num;
    let outputText = '';

    for (var i = 0; i < 3; i++) {
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

    console.log(randomImageNumbers, typeof(randomImageNumbers) + ' ' + outputText, typeof(outputText));;

    //res.header("Access-Control-Allow-Origin", "*");

    res.json({
        'numbers': randomImageNumbers, 
        'text': outputText
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));