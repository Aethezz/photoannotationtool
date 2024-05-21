from django.shortcuts import render, redirect
from upload.forms import UploadForm
from django.contrib.auth.decorators import login_required
from tool.models import Customer, Object

# Create your views here.
def upload(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            objects = request.POST.getlist('objects[]')
            
            customer_id = request.session.get('customer_id')
            customer = Customer.objects.get(pk=customer_id)
            
            photo = form.save(commit=False)
            photo.customer = customer
            photo.save()
            for obj in objects:
                Object.objects.create(name=obj, photo=photo)
            
        return redirect("upload")
    else:
        form = UploadForm()
    return render(request, "upload.html", {"form":form})  