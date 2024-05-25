var canvas = document.getElementById('annotation_canvas');
var ctx = canvas.getContext('2d');
var boxes = [];
var annotation_container = document.getElementById('annotation_container');
var annotated_images_container = document.getElementById('annotated_images_container');
var objects_container = document.getElementById('objects_container');
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
    if (objects_container) {
        objects_container.innerHTML = '';
    }
    console.log(photoId);
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
    annotated_images_container.innerHTML = '';
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

document.addEventListener('DOMContentLoaded', function() {
    var isDrawing = false;
    var startX, startY;
    
    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        startX = (e.clientX - rect.left) * (canvas.width / rect.width);
        startY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (!isDrawing) return;

        current_image = document.querySelector('.photo.selected')

        var rect = canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left) * (canvas.width / rect.width);
        var y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(current_image, 0, 0);

        // Redraw all existing rectangles
        boxes.forEach(function(box) {
            drawBox(box.x, box.y, box.width, box.height);
        });

        // Draw box
        drawBox(startX, startY, x - startX, y - startY);
    });

    canvas.addEventListener('mouseup', function(e) {
        isDrawing = false;
        current_image = document.querySelector('.photo.selected');

        // Record box coordinates
        var rect = canvas.getBoundingClientRect();
        var width = (e.clientX - rect.left) * (canvas.width / rect.width) - startX;
        var height = (e.clientY - rect.top) * (canvas.height / rect.height) - startY;
        boxes.push({ x: startX, y: startY, width: width, height: height });

        annotation_container.innerHTML = ''; // Clear previous content
        annotated_images_container.innerHTML = '';

        boxes.forEach(function(box, index) {
            var paragraph = document.createElement('p');
            
            paragraph.textContent = 'Box ' + (index + 1) + ':' + box.x + ' x ' + box.y + ', width=' + box.width + ', height=' + box.height;
            annotation_container.appendChild(paragraph);
            
            var annotated_image = document.createElement('img'); 
            annotated_image.setAttribute('name', 'abc');
            annotated_image.src = current_image.src; 

            annotated_image.style.width = box.width + 'px'; 
            annotated_image.style.height = box.height + 'px'; 

            annotated_image.style.objectFit = 'none'; // Ensure the image is not stretched or resized
            annotated_image.style.objectPosition = '-' + box.x + 'px -' + box.y + 'px'; // Position the image within its container

            annotated_images_container.appendChild(annotated_image);
        });
    });

    canvas.addEventListener('mouseleave', function(e) {
        isDrawing = false;
    });

    function drawBox(x, y, width, height) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, width, height);
    }
});

document.getElementById("submit-button").addEventListener('click', function() { 
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
            document.getElementById("annotation_container").innerHTML = "";
            document.getElementById("annotated_images_container").innerHTML = "";
            
            const currentIndex = Array.from(document.querySelectorAll('.photo')).indexOf(currentImage);
            
            // Get the next photo element in line
            const nextIndex = (currentIndex + 1) % document.querySelectorAll('.photo').length;
            const nextImage = document.querySelectorAll('.photo')[nextIndex];

            // Add the 'selected' class to the next photo in line
            nextImage.classList.add('selected');

            // Update the canvas to display the image associated with the newly selected photo
            const currentImageSrc = nextImage.src;
            
            loadPhoto(currentImageSrc, canvas);  
        
            const completedImage = document.querySelector(`[photo-id="${photoId}"]`);
            if (completedImage) {
                completedImage.parentElement.remove();  // Remove the <li> element containing the image
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
    console.error('Error: Boxes array is empty. Please annotate the image before submitting.');
    }
})

document.getElementById("reset-button").addEventListener('click', function() {
    annotation_container.innerHTML = '';
    annotated_images_container.innerHTML = '';
    boxes = []
    current_image = document.querySelector('.photo.selected');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadPhoto(current_image, canvas);o
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

