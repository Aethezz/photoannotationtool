from django.shortcuts import render, redirect
from upload.forms import UploadForm
from django.contrib.auth.decorators import login_required
from tool.models import Customer

# Create your views here.
def upload(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            customer_id = request.session.get('customer_id')
            customer = Customer.objects.get(pk=customer_id)
            form.instance.customer = customer
            form.save()
        return redirect("upload")
    else:
        form = UploadForm()
    return render(request, "upload.html", {"form":form})  