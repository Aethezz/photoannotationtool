from django.urls import path
from . import views
from register.views import register, login, logout
from upload.views import upload

urlpatterns = [
    path("", views.Homepage, name="home"),
    path("register/", register, name="register"),
    path("upload/", upload, name="upload"),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('view/', views.view_images, name='view'),
    path('submit-annotation/', views.submit_annotation, name='submit_annotation'),
]