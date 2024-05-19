from django.shortcuts import render, HttpResponse, redirect
from .models import Customer, Photo, AnnotatedImage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
import json
from PIL import Image
from io import BytesIO
import requests

# Create your views here.
def Homepage(request):
    return render(request, "home.html")

def view_images(request):
    
    customer = Customer.objects.get(pk=request.session['customer_id'])
    # Query all photos related to this customer
    customer_photos = customer.photo_set.all()  # Assuming "photo_set" is the related name

    if customer_photos.exists():
        first_photo = customer_photos.first()
        first_photo_url = first_photo.image.url

    return render(request, 'view.html', {'customer': customer, 'customer_photos': customer_photos, 'first_photo_url': first_photo_url})

def submit_annotation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        boxes = data.get('boxes', [])
        image_src = data.get('currentImageSrc', '')
        customer = Customer.objects.get(id=request.session['customer_id'])
        #photo = Photo.objects.get(id=request.session['photo_id'])

        response = requests.get(image_src)
        img = Image.open(BytesIO(response.content))

        for box in boxes:
            start_x = box.get('x')
            start_y = box.get('y')
            width = box.get('width')
            height = box.get('height')
            # Do something with these values, e.g., save to database, print, etc.
            print(f'x: {start_x}, y: {start_y}, width: {width}, height: {height}')

            annotated_image = img.crop((start_x, start_y, start_x+width, start_y+height))
            annotated_image_io = BytesIO()
            annotated_image.save(annotated_image_io, format='JPEG')
            annotated_image_io.seek(0)
            
            annotated_image_instance = AnnotatedImage(
                start_x=start_x, start_y=start_y, width=width, height=height, customer=customer
            )
            annotated_image_instance.annotated_image.save(f'cropped_{start_x}_{start_y}_{width}_{height}.jpg', ContentFile(annotated_image_io.read()), save=True)

        return JsonResponse({'status': 'success', 'data': boxes})
    return JsonResponse({'status': 'failed', 'message': 'Invalid request'}, status=400)