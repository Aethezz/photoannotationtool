from django.forms import ModelForm
from django import forms
from tool.models import Photo

class UploadForm(ModelForm):
    title = forms.TextInput()
    image = forms.ImageField()
    
    class Meta:
        model = Photo 
        fields = ["title", "image",]
