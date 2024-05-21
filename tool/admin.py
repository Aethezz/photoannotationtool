from django.contrib import admin
from .models import Customer, Photo, jobRequest, AnnotatedImage, Object
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# Register your models here.
class ObjectInline(admin.TabularInline):
    model = Object
    extra = 0  

class PhotoInline(admin.TabularInline): 
    model = Photo
    extra = 0  
    inlines = [ObjectInline]

class ObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'photo_name', 'id',)
    list_display_links = ('name', 'photo_name', 'id',)
    readonly_fields = ('photo', 'id',)

    def photo_name(self, obj):
        return obj.photo.title

class PhotoAdmin(admin.ModelAdmin):
    inlines = [ObjectInline]
    list_display = ('title', 'customer_name', 'created_at', 'id',)
    readonly_fields = ('id', 'created_at', 'customer',)
    list_display_links = ('title', 'customer_name',)

    def customer_name(self, obj):
        return obj.customer.username

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'id',)
    inlines = [PhotoInline]
    readonly_fields = ('user', ) 
    
admin.site.register(Object, ObjectAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Photo, PhotoAdmin)
admin.site.register(jobRequest)

class CustomerInline(admin.StackedInline):
    model = Customer
    can_delete = False
    verbose_name_plural = 'Customer'
    fields = ('username',)
    readonly_fields = ('username',)

class UserAdmin(BaseUserAdmin):
    inlines = (CustomerInline,)

# Re-register the User model with the updated UserAdmin class
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

class AnnotatedImageAdmin(admin.ModelAdmin):
    readonly_fields = ('start_x', 'start_y', 'width', 'height', 'photo', 'customer',)

admin.site.register(AnnotatedImage, AnnotatedImageAdmin)