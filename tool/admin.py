from django.contrib import admin
from .models import Customer, Photo, jobRequest, AnnotatedImage
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html

# Register your models here.
class PhotoInline(admin.TabularInline):  # Use admin.StackedInline for a different layout
    model = Photo
    extra = 0  # Specify the number of extra forms to display

class PhotoAdmin(admin.ModelAdmin):
    list_display = ('title', 'customer_name', 'created_at', 'id',)
    readonly_fields = ('id', 'created_at', 'customer',)
    list_display_links = ('title', 'customer_name',)

    def customer_name(self, obj):
        return obj.customer.username
        
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'id',)
    inlines = [PhotoInline]
    readonly_fields = ('user', )  # You can keep this line if you have other readonly fields
    
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
    readonly_fields = ('start_x', 'start_y', 'width', 'height')

admin.site.register(AnnotatedImage, AnnotatedImageAdmin)