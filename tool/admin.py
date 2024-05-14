from django.contrib import admin
from .models import Customer, Photo, job_request
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# Register your models here.
class PhotoInline(admin.TabularInline):  # Use admin.StackedInline for a different layout
    model = Photo
    extra = 0  # Specify the number of extra forms to display

class CustomerAdmin(admin.ModelAdmin):
    inlines = [PhotoInline]
    readonly_fields = ('user',)  # You can keep this line if you have other readonly fields

admin.site.register(Customer, CustomerAdmin)

class PhotoAdmin(admin.ModelAdmin):
    readonly_fields = ('id','created_at', 'customer',)

admin.site.register(Photo, PhotoAdmin)
admin.site.register(job_request)

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