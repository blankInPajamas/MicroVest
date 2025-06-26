# blossomvest_backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser # This imports your actual CustomUser MODEL

# Define your custom admin configuration class with a unique name
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'user_type',
        'fund',
        'is_active',
        'is_staff',
        'is_superuser',
        'date_joined',
        'last_login',
        # 'phone_number',    # Make sure this field exists in your CustomUser model
        # 'profile_picture', # Make sure this field exists in your CustomUser model
    )

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'user_type', 'fund')}),
        (('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (('Important dates'), {'fields': ('last_login', 'date_joined')}),
        # Add a section for your custom fields if they exist in models.py
        # (('Custom Fields'), {'fields': ('phone_number', 'profile_picture')}),
    )

    search_fields = (
        'username',
        'email',
        'first_name',
        'last_name',
        'user_type'
    )

    list_filter = (
        'is_active',
        'is_staff',
        'is_superuser',
        'groups',
        'date_joined',
        'user_type'
    )

    ordering = ('-date_joined',)


# Register your CustomUser MODEL with your CustomUserAdmin configuration class
admin.site.register(CustomUser, CustomUserAdmin)

# Remove this line, it's redundant and incorrect:
# admin.site.register(CustomUser)