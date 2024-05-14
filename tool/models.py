from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    username = models.CharField(max_length=25)
    email = models.EmailField()
    password = models.CharField(max_length=100)

class Photo(models.Model):
    title = models.CharField(max_length=25)
    image = models.ImageField(null=True, blank=True, upload_to='photos')
    customer = models.ForeignKey(Customer, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class job_request(models.Model):
    customer = models.ForeignKey(Customer, null=True, on_delete=models.CASCADE)
    photo = models.ForeignKey(Photo, null=True, on_delete=models.CASCADE)

class AnnotatedImage(models.Model):
    photo = models.ForeignKey(Photo, null=True, on_delete=models.CASCADE)