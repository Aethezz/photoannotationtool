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
    return render(request, 'view.html')

def annotate(request):
    customer = Customer.objects.get(pk=request.session['customer_id'])
    customer_photos = customer.photo_set.filter(completed=False) 
    photo_ids = []
    if customer_photos.exists():
        photo_ids = [photo.id for photo in customer_photos]
    else:
        pass

    return render(request, 'annotate.html', {
        'customer': customer, 
        'customer_photos': customer_photos, 
        'photo_ids': photo_ids,
    })

def submit_annotation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        boxes = data.get('boxes', [])
        image_src = data.get('currentImageSrc', '')
        customer = Customer.objects.get(id=request.session['customer_id'])
        
        photo_id = data.get('photoId', '')
        photo = Photo.objects.get(id=photo_id)
        photo.completed = True
        photo.save()

        response = requests.get(image_src)
        img = Image.open(BytesIO(response.content))

        for box in boxes:
            start_x = box.get('x')
            start_y = box.get('y')
            width = box.get('width')
            height = box.get('height')

            annotated_image = img.crop((start_x, start_y, start_x+width, start_y+height))
            annotated_image_io = BytesIO()
            annotated_image.save(annotated_image_io, format='JPEG')
            annotated_image_io.seek(0)
            
            annotated_image_instance = AnnotatedImage(
                start_x=start_x, start_y=start_y, width=width, height=height, customer=customer, photo=photo,
            )
            annotated_image_instance.annotated_image.save(f'annotated_{start_x}_{start_y}_{width}_{height}.jpg', ContentFile(annotated_image_io.read()), save=True)

        

        return JsonResponse({'status': 'success', 'data': boxes})
    return JsonResponse({'status': 'failed', 'message': 'Invalid request'}, status=400)