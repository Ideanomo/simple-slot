window.onload = function () {

    // The sprite object
    let spriteObject = {

        // The x and y source position of sprite's image
        sourceX: 0,
        sourceY: 0,
        // The width and height of sprite's image
        sourceWidth: 235,
        sourceHeight: 155,
        // The x and y of sprite on canvas
        x: 0,
        y: 0,
        // The width and height of sprite on canvas
        width: 235,
        height: 155,
        spinning: false,
    };

    let loadedImagesArray = [];
    let symbolsArray = [];
    let spritesArray = [];
    let canvasArray = [];
    let drawingSurfacesArray = [];
    let toload = 7;
    let loaded = 0;
    let drawingSurface;
    let outputText;
    let bonusText;

    let spinButton = document.getElementById('spin');
    let output = document.getElementById('outcome');
    let bonusOutput = document.getElementById('bonusMessage');
    let canvases = document.querySelectorAll('canvas');

    output.innerHTML = " ";
    bonusOutput.innerHTML = "";

    // Preload images
    function preload(arguments) {
        for (let i = 0; i < preload.arguments.length; i++) {
            loadedImagesArray[i] = new Image();
            loadedImagesArray[i].src = preload.arguments[i];
            loaded += 1;
        }

         // console.log(loadedImagesArray);
    }

    // Initialise reels at start
    function initReels() {
        // iterate through all canvas elements, create context and new image
        canvases.forEach(function (canvas) {
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.src = 'images/Symbol_1.png';

            img.onload = function () {
                ctx.drawImage(
                    img,
                    spriteObject.sourceX, spriteObject.sourceY, spriteObject.sourceWidth, spriteObject.sourceHeight,
                    spriteObject.x, spriteObject.y, spriteObject.width, spriteObject.height
                )
            };
        })
    }

    // Do this when all images have loaded
    function loadHandler() {
        if (loaded === toload) {
            // console.log('All images loaded');

            // Get all images except the button and put in symbolsArray; as button is index 0, start from index 1 to skip it.
            for (var i = 1; i < loadedImagesArray.length; i++) {
                symbolsArray.push(loadedImagesArray[i]);
                // console.log(symbolsArray);
            }

            canvases.forEach(canvas => {
                canvasArray.push(canvas);
                drawingSurface = canvas.getContext('2d');
                drawingSurfacesArray.push(drawingSurface);
            });

            // Check array for content
            //  console.log(canvasArray);
            //  console.log(drawingSurfacesArray);

            // Create sprites from symbols
            for (let i = 0; i < symbolsArray.length; i++) {
                let sprite = Object.create(spriteObject);
                sprite.x = 0;
                sprite.y = 0;
                spritesArray.push(sprite);
            }

             // console.log(spritesArray);

            // Add spin button
            spinButton.setAttribute('src', 'images/button.png');            
            spinButton.addEventListener('click', update, false);
        } else {
            console.log('Loaded images does not equal expected images');
        }
    }

    // Update slot boxes and find matches
    function render(randomImageNumbers, outputText, bonusGame, bonusMessage, wilds) {
        let i;

        // Do requirement checks
        if (spritesArray.length === 0) {
            alert('WRONG WRONG WRONG');
            return false;
        }

        // Clear slots and update with new images
        for (i = 0; i < drawingSurfacesArray.length; i++) {
            let drawingSurface = drawingSurfacesArray[i];
            let canvas = canvasArray[i];
            let sprite = spritesArray[i];

            drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

            drawingSurface.drawImage(
                symbolsArray[randomImageNumbers[i]],
                sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight,
                sprite.x, sprite.y, sprite.width, sprite.height
            )
        }

        output.innerHTML = outputText;

        if (bonusGame && wilds === 3) {
            // bonusOutput.innerHTML = bonusMessage;
            output.innerHTML += " " + bonusMessage;
            window.setTimeout(playBonus, 3000);
        }
    }

    function playBonus () {
        // bonusOutput.innerHTML = "";
        update();
    }

    function update(event) {
        //alert(event.type);
        // Start spinning the reels
        spriteObject.spinning = true;

        // Initialise AJAX
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        // Fetch 3 random integers from NodeJS app
        xhr.open('GET', 'http://localhost:8080/random', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let type = xhr.getResponseHeader("Content-Type");
                // console.log("Content-Type: " + type);
                // console.log("Status: " + this.statusText);

                if (xhr.response != null) {
                    console.log(xhr.response);
                    let randomImageNumbers = xhr.response.numbers;
                    let bonusGame = xhr.response.bonusGame;
                    let wilds = xhr.response.wilds;

                    outputText = xhr.response.text;
                    bonusText = xhr.response.bonusMessage;
                    render(randomImageNumbers, outputText, bonusGame, bonusText, wilds);
                } else {
                    alert('Error: no data');
                }
            }
        };

        xhr.send();
    }

    // Call preload function and pass in symbols as arguments
    preload(
        'images/button.png',
        'images/Symbol_0.png',
        'images/Symbol_1.png',
        'images/Symbol_2.png',
        'images/Symbol_3.png',
        'images/Symbol_4.png',
        'images/Symbol_5.png'
    );

    initReels();
    loadHandler();
};
//TODO: Implement in Bonus game, Mobile?