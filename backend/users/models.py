from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Add any additional fields you need for your users here
    # For example:
    user_type_choices = (
        ('investor', 'Investor'),
        ('entrepreneur', 'Entrepreneur'),
    )
    user_type = models.CharField(max_length=20, choices=user_type_choices, default='investor')
    # You might want to add more specific fields for investors/entrepreneurs directly here
    # or use related models later.

    def __str__(self):
        return self.email # Or self.username, depending on what you want as primary identifier