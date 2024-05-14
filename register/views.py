from django.shortcuts import render, redirect
from register.forms import RegisterForm
from tool.models import Customer
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from django.contrib.auth import logout as auth_logout
# Create your views here.

def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(request.POST["password"])
            user.save()
            Customer.objects.create(user=user, username=user.username, email=user.email, password=user.password)
        return redirect("login")
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form":form})  
  
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        error_message = None 
        
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            auth_login(request, user)
            customer = Customer.objects.get(username=username)
            request.session['customer_id'] = customer.id
            print(customer.id)
            return redirect('upload')
        else:
            error_message = 'Invalid username or password'
        return render(request, 'login.html', {'error_message': error_message})
    else:
        return render(request, 'login.html')

def logout(request): 
    auth_logout(request)
    return render(request, 'logout.html')