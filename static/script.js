var canvas = document.getElementById('annotation_canvas');
var ctx = canvas.getContext('2d');
var boxes = [];
var annotation_container = document.getElementById('annotation_container');
var objects_container = document.getElementById('objects_container');
var message_container = document.getElementById('message_container');

first_image = document.querySelector('.photo.selected');

if (first_image) {
    var image = new Image();
    image.onload = function() {
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
    };
    image.src = first_image.src;
    updateObjects(first_image)
}

function updateObjects(imageSrc) {
    const photoId = imageSrc.getAttribute('photo-id');
    var objects_container = document.getElementById('objects_container');

    objects_container.innerHTML = '';
    
    var objects = photoObjectsDict[photoId];
    
    if (objects.length > 0) {
        objects.forEach(obj => {
            var label = document.createElement('label');
            var radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = 'object';
            radioButton.setAttribute('object_id', obj[0]);
            radioButton.setAttribute('object_name', obj[1]);
            radioButton.classList.add('photo_objects');
            
            label.appendChild(radioButton);
            label.appendChild(document.createTextNode(' ' + obj[1]));
            objects_container.appendChild(label);
            objects_container.appendChild(document.createElement('br')); // Add line break to separate items vertically
        });
    } else {
        objects_container.innerHTML = "No associated objects";
    }
    
    const radioButtons = objects_container.querySelectorAll('input[name="object"]');
    
    // Attach change event listener to the radio button
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', () => {
            // Remove 'selected' class from all radio buttons
            radioButtons.forEach(rb => rb.classList.remove('selected'));
            
            // Add 'selected' class to the currently selected radio button
            radioButton.classList.add('selected');
        });
    });
}

function loadPhoto(imageSrc, canvas) {
    var ctx = canvas.getContext('2d');
    var image = new Image();

    image.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
    };
    image.src = imageSrc.src;
}

function selectPhoto(element) {
    boxes = [];
    annotation_container.innerHTML = '';
    
    // Remove 'selected' class from all photos
    var photos = document.getElementsByClassName('photo');
    for (var i = 0; i < photos.length; i++) {
        photos[i].classList.remove('selected');
    }

    // Add 'selected' class to the clicked photo
    element.classList.add('selected');

    // Update canvas with the selected image
    loadPhoto(element, canvas);
    updateObjects(element);
}

function drawDashedBox(x, y, width, height) { 
        var strokeWidth = Math.min(canvas.width, canvas.height) * 0.003; // Adjust the factor as needed
        var dashSize = Math.min(canvas.width, canvas.height) * 0.01; 
        var gapSize = dashSize; // Same as dash size for consistency

        ctx.setLineDash([dashSize, gapSize]);
        
        ctx.strokeStyle = 'red';
        ctx.lineWidth = strokeWidth; // Set the stroke width
        ctx.strokeRect(x, y, width, height)
    }

function drawSolidBox(x, y, width, height, obj='') {
    var strokeWidth = Math.min(canvas.width, canvas.height) * 0.003; // Adjust the factor as needed
    var fontSize = Math.min(canvas.width, canvas.height) * 0.02;

    ctx.setLineDash([]); // Clear line dash
    ctx.strokeStyle = 'red';
    ctx.lineWidth = strokeWidth; // Set the stroke width
    ctx.strokeRect(x, y, width, height); // Draw the outline of the rectangle

    ctx.font = fontSize + 'px Arial';
    ctx.fillStyle = 'darkred';
    ctx.fillText(obj, x, y + 15);
}

document.addEventListener('DOMContentLoaded', () => {
    // implement if object is currently selected
    var isDrawing = false;
    var mouseIn = false;
    var startX, startY;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        startX = (e.clientX - rect.left) * (canvas.width / rect.width);
        startY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    canvas.addEventListener('mousemove', (e) =>  {
        if (!isDrawing) return;

        current_image = document.querySelector('.photo.selected')

        var rect = canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left) * (canvas.width / rect.width);
        var y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(current_image, 0, 0);

        // Redraw all existing rectangles
        boxes.forEach(function(box) {
            drawSolidBox(box.x, box.y, box.width, box.height, box.obj);
        });

        // Draw box
        drawDashedBox(startX, startY, x - startX, y - startY);
    });

    canvas.addEventListener('mouseup', (e) =>  {
        isDrawing = false;
        var current_image = document.querySelector('.photo.selected');
        var current_object = document.querySelector('.photo_objects.selected')
        if (current_object) {
            var object_name = current_object.getAttribute('object_name');
            var object_id = current_object.getAttribute('object_id');

            // Record box coordinates
            var rect = canvas.getBoundingClientRect();
            var width = (e.clientX - rect.left) * (canvas.width / rect.width) - startX;
            var height = (e.clientY - rect.top) * (canvas.height / rect.height) - startY;
            boxes.push({ x: startX, y: startY, width: width, height: height, obj: object_name, id: object_id });

            // Clear previous content
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(current_image, 0, 0);
            annotation_container.innerHTML = ''; 

            boxes.forEach((box) => {
                drawSolidBox(box.x, box.y, box.width, box.height, box.obj);
                var paragraph = document.createElement('p');
                paragraph.innerHTML = 'Object: ' + box.obj + '<br>Corner: ' + Math.round(box.x) + ' x ' + Math.round(box.y) + '<br>Size: ' + Math.round(box.width) + ' x ' + Math.round(box.height);
                annotation_container.appendChild(paragraph);
                
                var annotated_image = document.createElement('img'); 
                annotated_image.setAttribute('name', box.obj);
                annotated_image.classList.add('annotated_image');
                annotated_image.src = current_image.src; 
                annotated_image.style.width = box.width + 'px'; 
                annotated_image.style.height = box.height + 'px'; 
                annotated_image.style.objectFit = 'none'; // Ensure the image is not stretched or resized
                annotated_image.style.objectPosition = '-' + box.x + 'px -' + box.y + 'px'; // Position the image within its container
                annotation_container.appendChild(annotated_image);
            });
        } else {
            loadPhoto(current_image, canvas);
            error_message = document.createElement('p');
            error_message.innerHTML = "Select an object first.";
            message_container.appendChild(error_message);
        }
    });

    canvas.addEventListener('mouseleave', () => {
        mouseIn = false;
    });

    canvas.addEventListener('mouseenter', () => {
        mouseIn = true;
    })
});

document.getElementById("submit-button").addEventListener('click', () => { 
    if (boxes.length > 0) {
        currentImage = document.querySelector('.photo.selected');
        currentImageSrc = currentImage.src;
        const photoId = currentImage.getAttribute('photo-id');

        boxes.forEach(box => {
            console.log(`x: ${box.x}, y: ${box.y}, width: ${box.width}, height: ${box.height}`);
        });
        
        fetch('/submit-annotation/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // Add CSRF token for Django
            },
            body: JSON.stringify({ 
                boxes: boxes, 
                currentImageSrc: currentImageSrc,
                photoId: photoId
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            boxes = []
            annotation_container.innerHTML = "";
            
            const currentIndex = Array.from(document.querySelectorAll('.photo')).indexOf(currentImage);
            
            // Get the next photo element in line
            const nextIndex = (currentIndex + 1) % document.querySelectorAll('.photo').length;
            const nextImage = document.querySelectorAll('.photo')[nextIndex];

            // Add the 'selected' class to the next photo in line
            nextImage.classList.add('selected');

            // Update the canvas to display the image associated with the newly selected photo
            loadPhoto(nextImage, canvas);  
            updateObjects(nextImage);
            
            const completedImage = document.querySelector(`[photo-id="${photoId}"]`);
            if (completedImage) {
                completedImage.parentElement.remove();  // Remove the <li> element containing the image
            }

            success_message = document.createElement('p');
            success_message.innerHTML = "Successfully submitted";
            message_container.appendChild(success_message);
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        error_message = document.createElement('p');
        error_message.innerHTML = "No annotations to submit";
        message_container.appendChild(error_message);
    }
})

document.getElementById("reset-button").addEventListener('click', () => {
    annotation_container.innerHTML = '';
    boxes = []
    current_image = document.querySelector('.photo.selected');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadPhoto(current_image, canvas);
})

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

