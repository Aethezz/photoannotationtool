from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User

class RegisterForm(ModelForm):
    username = forms.TextInput()
    email = forms.EmailField()
    password = forms.PasswordInput()

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        help_texts = {
            'username': None,
        }