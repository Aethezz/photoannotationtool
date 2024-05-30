from django.urls import path
from . import views
from register.views import register_or_login, logout 
from upload.views import upload

urlpatterns = [
    path("", views.Homepage, name="home"),
    path("upload/", upload, name="upload"),
    path('logout/', logout, name='logout'),
    path('annotate/', views.annotate, name='annotate'),
    path('submit-annotation/', views.submit_annotation, name='submit_annotation'),
    path('register_or_login/', register_or_login, name='register_or_login'),
    path('view/', views.view_annotations, name='view_annotations'),
]