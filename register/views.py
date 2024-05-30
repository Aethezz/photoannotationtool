from django.shortcuts import render, redirect
from tool.models import Customer
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from django.contrib.auth import logout as auth_logout
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
# Create your views here.

def register_or_login(request):
    if request.method == "POST":
        action = request.POST.get('action')
        login_error_message = None
        register_error_message = None

        if action == 'register':
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')

            if not username or not password or not email:
                register_error_message = "All fields are required for registration."
            else:
                try:
                    validate_email(email)
                except ValidationError:
                    register_error_message = "Invalid email address."
                if User.objects.filter(username=username).exists():
                    register_error_message = "Username already exists."
                if User.objects.filter(email=email).exists():
                    register_error_message = "Email already registered."

            if register_error_message:
                return render(request, 'register_or_login.html', {'register_error_message': register_error_message, 'action': 'register'})
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                Customer.objects.create(user=user, username=user.username, email=user.email, password=user.password)
                return redirect("register_or_login")
        
        elif action == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')
            
            if not username or not password:
                login_error_message = "Both username and password are required for login."
            else:
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    auth_login(request, user)
                    customer = Customer.objects.get(username=username)
                    request.session['customer_id'] = customer.id
                    return redirect('upload')
                else:
                    login_error_message = 'Invalid username or password'
            return render(request, 'register_or_login.html', {'login_error_message': login_error_message, 'action': 'login'})
    else:
        return render(request, 'register_or_login.html')

def logout(request): 
    auth_logout(request)
    return render(request, 'logout.html')