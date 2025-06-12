# MicroVest/users/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        # Define all fields from CustomUser that you want on the signup form.
        # UserCreationForm.Meta.fields already includes 'username', 'password', 'password2'
        fields = UserCreationForm.Meta.fields + (
            'name',
            'dob',
            'address',
            'designation',
            'phone_number',
            'id_document_url',
            'user_type',
            'email', # It's good practice to explicitly include email if you want it on signup form
        )

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = UserChangeForm.Meta.fields