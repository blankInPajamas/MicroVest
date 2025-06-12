# MicroVest/users/views.py

from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm # Import your custom form
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model # To correctly reference the User model

# Get the active User model (which is now CustomUser because of AUTH_USER_MODEL)
User = get_user_model()

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save() # This saves the new CustomUser to the database
            messages.success(request, f'Account created for {user.username}! You can now log in.')
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})

@login_required
def profile(request):
    # request.user will be an instance of your CustomUser model here
    return render(request, 'users/profile.html')