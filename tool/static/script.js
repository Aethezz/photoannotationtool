function selectPhoto(element) {
    // Remove 'selected' class from all photos
    var photos = document.getElementsByClassName('photo');
    for (var i = 0; i < photos.length; i++) {
        photos[i].classList.remove('selected');
    }

    // Add 'selected' class to the clicked photo
    element.classList.add('selected');

    // Update canvas with the selected image
    var canvas = document.getElementById('annotation_canvas');
    var ctx = canvas.getContext('2d');
    var image = new Image();
    image.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
    };
    image.src = element.src;
}

document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('annotation_canvas');
    var ctx = canvas.getContext('2d');
    
    // Initially draw the first image (assuming the first image is selected by default)
    var selectedImage = document.querySelector('.photo.selected');
    if (selectedImage) {
        var image = new Image();
        image.onload = function() {
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
        };
        image.src = selectedImage.src;
    }

    var isDrawing = false;
    var startX, startY;
    var boxes = []; // Array to store drawn boxes

    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        startX = (e.clientX - rect.left) * (canvas.width / rect.width);
        startY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!isDrawing) return;

        var rect = canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left) * (canvas.width / rect.width);
        var y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);

        // Redraw all existing rectangles
        boxes.forEach(function(box) {
            drawBox(box.x, box.y, box.width, box.height);
        });

        // Draw box
        drawBox(startX, startY, x - startX, y - startY);
    });

    canvas.addEventListener('mouseup', function(e) {
        isDrawing = false;

        // Record box coordinates
        var rect = canvas.getBoundingClientRect();
        var width = (e.clientX - rect.left) * (canvas.width / rect.width) - startX;
        var height = (e.clientY - rect.top) * (canvas.height / rect.height) - startY;
        boxes.push({ x: startX, y: startY, width: width, height: height });
    });

    canvas.addEventListener('mouseleave', function(e) {
        isDrawing = false;
    });

    // Function to draw a box
    function drawBox(x, y, width, height) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, width, height);
    }

});

