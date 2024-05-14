from django.shortcuts import render, HttpResponse, redirect
from .models import Customer

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