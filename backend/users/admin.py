# MicroVest/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # This remains the same: defines what columns appear in the list view
    list_display = (
        'username', 'email', 'name', 'phone_number', 'user_type',
        'is_staff', 'is_active',
    )

    # --- EDIT THIS SECTION FOR THE 'CHANGE USER' FORM (editing existing users) ---
    fieldsets = (
        # Default AbstractUser fields:
        (None, {'fields': ('username', 'password')}),
        ('Personal information', {'fields': ('first_name', 'last_name', 'email')}),
        # Your custom fields in a new group:
        ('Custom User Information', {'fields': (
            'name',          # full name field
            'dob',
            'phone_number',
            'user_type',
            'address',
            'designation',
            'id_document_url',
        )}),
        # Default AbstractUser fields related to permissions and dates:
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # --- EDIT THIS SECTION FOR THE 'ADD USER' FORM (creating new users) ---
    # This is slightly different because it usually doesn't show last_login or date_joined
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password', 'password2'), # password and password2 are required for new users
        }),
        ('Personal Info', {'fields': (
            'name',
            'dob',
            'phone_number',
            'user_type',
            'address',
            'designation',
            'id_document_url',
        )}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Optional: filters on the right sidebar for list view
    list_filter = UserAdmin.list_filter + ('user_type',)

    # Optional: fields for searching
    search_fields = ('username', 'email', 'name', 'phone_number')

    # Optional: order of users in the list view
    ordering = ('email',)


# Register your CustomUser model with your CustomUserAdmin class
admin.site.register(CustomUser, CustomUserAdmin)