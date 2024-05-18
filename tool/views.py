from django.shortcuts import render, HttpResponse, redirect
from .models import Customer, AnnotatedImage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
import json

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
        #current_image = request.FILES.get('current_image')
        data = json.loads(request.body)
        boxes = data.get('boxes', [])

        for box in boxes:
            x = box.get('x')
            y = box.get('y')
            width = box.get('width')
            height = box.get('height')
            # Do something with these values, e.g., save to database, print, etc.
            print(f'x: {x}, y: {y}, width: {width}, height: {height}')

        return JsonResponse({'status': 'success', 'data': boxes})
    return JsonResponse({'status': 'failed', 'message': 'Invalid request'}, status=400)