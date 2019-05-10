const express = require('express');
let router = express.Router();
const cors = require('cors');
const app = express();

router.options('/', cors());
router.get('/', cors());
module.exports = router;

app.use(cors());
app.options('*', cors());
cors({credentials: true, origin: true});



app.get('/', (req, res, next) => {
    res.send('NodeJS app');
});

app.get('/random', (req, res, next) => {
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

    res.header("Access-Control-Allow-Origin", "*");

    res.json({
        'numbers': randomImageNumbers, 
        'text': outputText
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));