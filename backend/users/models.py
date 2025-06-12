# MicroVest/users/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    # ... (your existing field definitions) ...
    name = models.CharField(_("full name"), max_length=100)
    dob = models.DateField(_("date of birth")) # This field is causing the error
    address = models.TextField(_("address"), blank=True, null=True)
    designation = models.CharField(_("designation"), max_length=100, blank=True, null=True)
    phone_number = models.CharField(_("phone number"), max_length=20, unique=True)
    id_document_url = models.CharField(_("ID document URL"), max_length=255, blank=True, null=True)
    USER_TYPE_CHOICES = (
        ('investor', _('Investor')),
        ('entrepreneur', _('Entrepreneur')),
    )
    user_type = models.CharField(
        _("user type"),
        max_length=12,
        choices=USER_TYPE_CHOICES,
        default='investor',
        db_index=True
    )

    # --- ADD/MODIFY THIS SECTION ---
    # Specify additional fields that are required when creating a user via createsuperuser.
    # 'username' and 'password' are always required by default.
    # 'email' is typically added here if you want it prompted and required.
    REQUIRED_FIELDS = ['email', 'name', 'dob', 'phone_number', 'user_type'] # Add all your NOT NULL fields

    # You don't usually need to override __str__ or Meta unless you want custom behavior
    def __str__(self):
        return self.email or self.username or f"User {self.pk}"

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")