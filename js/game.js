window.onload = function () {

    // The sprite object
    var spriteObject = {

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

    var loadedImagesArray = [];
    var symbolsArray = [];
    var spritesArray = [];
    var canvasArray = [];
    var drawingSurfacesArray = [];
    var toload = 7;
    var loaded = 0;
    var drawingSurface;
    var outputText;
    var isTouching = false;

    var spinButton = document.getElementById('spin');
    var output = document.getElementById('outcome');
    var canvases = document.querySelectorAll('canvas');

    // Preload images
    function preload(arguments) {
        for (var i = 0; i < preload.arguments.length; i++) {
            loadedImagesArray[i] = new Image();
            loadedImagesArray[i].src = preload.arguments[i];
            loaded += 1;
        }

         // console.log(loadedImagesArray);
    }

    // Initialise reels at start
    function initReels() {
        canvases.forEach(function (canvas) {
            var ctx = canvas.getContext('2d');
            var img = new Image();
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

            // Get all images except the button and put in symbolsArray
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
             // console.log(canvasArray);
             // console.log(drawingSurfacesArray);

            // Create sprites from symbols
            for (var i = 0; i < symbolsArray.length; i++) {
                var sprite = Object.create(spriteObject);
                sprite.x = 0;
                sprite.y = 0;
                spritesArray.push(sprite);
            }

             // console.log(spritesArray);

            // Add spin button
            spinButton.setAttribute('src', 'images/button.png');            
            spinButton.addEventListener('mousedown', checkEvent, false);
            spinButton.addEventListener('touchstart', checkEvent, false);
        } else {
            console.log('Loaded images does not equal expected images');
        }
    }

    function checkEvent (event) {
       if (event.type == 'mousedown') {
           isTouching = false;
           event.preventDefault();
            console.log('mousedown event');
            update();
       } else {
           event.preventDefault();
           isTouching = true;
           alert('touch event');
           update();
       }
    }

    // Update slot boxes and find matches
    function render(randomImageNumbers, outputText) {
        var i;

        // Do requirement checks
        if (spritesArray.length === 0) {
            alert('WRONG WRONG WRONG');
            return false;
        }

        // Clear slots and update with new images
        for (i = 0; i < drawingSurfacesArray.length; i++) {
            var drawingSurface = drawingSurfacesArray[i];
            var canvas = canvasArray[i];
            var sprite = spritesArray[i];

            drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

            drawingSurface.drawImage(
                symbolsArray[randomImageNumbers[i]],
                sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight,
                sprite.x, sprite.y, sprite.width, sprite.height
            )
        }

        output.innerHTML = outputText;
    }

    function update(event) {
        // Start spinning the reels
        spriteObject.spinning = true;

        // Initialise AJAX
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        // Fetch 3 random integers from NodeJS app
        xhr.open('GET', 'http://localhost:8080/random', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var type = xhr.getResponseHeader("Content-Type");
                console.log("Content-Type: " + type);
                console.log("Status: " + this.statusText);

                if (xhr.response != null) {
                    randomImageNumbers = xhr.response.numbers;
                    outputText = xhr.response.text;
                    render(randomImageNumbers, outputText);
                } else {
                    alert('Error: no data');
                }
            }
        }

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
}