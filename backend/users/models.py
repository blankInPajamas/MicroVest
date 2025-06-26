from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    prof_pic = models.ImageField(upload_to='profile_pics/', blank=True)
    fund = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, help_text='Available funds for the user')

    USER_TYPE_CHOICES = (
        ('investor', 'Investor'),
        ('entrepreneur', 'Entrepreneur'),
    )

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='investor', # Set a default value, e.g., 'investor'
        help_text='Designates the type of user (investor or entrepreneur).',
    )

    def __str__(self):
        return self.username
    
    @property
    def formatted_fund(self):
        return f"${self.fund:,.2f}"