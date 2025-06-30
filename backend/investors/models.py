# investors/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser # This might not be needed if CustomUser is correctly imported
from users.models import CustomUser # Assuming CustomUser is in a 'users' app
# You'll likely need a Business model, assuming it's in a 'businesses' or 'entrepreneurs' app
# For this example, let's assume a 'Business' model exists in 'businesses.models'
# from businesses.models import Business # Uncomment and adjust path if you have a Business model

# Mock Business model for demonstration if you don't have one yet
class Business(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100) # For portfolio diversity

    class Meta:
        verbose_name_plural = "Businesses"

    def __str__(self):
        return self.name

class Industry(models.Model):
    """
    Represents a category or sector of industry.
    """
    name = models.CharField(max_length=100, unique=True,
                            help_text="Name of the industry (e.g., 'Technology', 'Healthcare').")
    description = models.TextField(blank=True, null=True,
                                   help_text="A brief description of the industry.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Industries" # Correct pluralization for 'Industry'
        ordering = ['name'] # Order industries alphabetically by name

    def __str__(self):
        return self.name

class InvestorProfile(models.Model):
    """
    Stores additional profile information for investor users.
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='investor_profile',
        limit_choices_to={'user_type': 'investor'},
        help_text="The CustomUser associated with this investor profile."
    )
    bio = models.TextField(blank=True, null=True,
                           help_text="A brief biography of the investor.")
    investment_focus = models.ManyToManyField(
        Industry,
        blank=True,
        related_name='investors',
        help_text="The industries the investor is interested in."
    )
    min_investment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Minimum investment amount the investor considers."
    )
    max_investment = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Maximum investment amount the investor considers."
    )
    website = models.URLField(max_length=200, blank=True, null=True,
                              help_text="Investor's personal or company website.")
    linkedin_profile = models.URLField(max_length=200, blank=True, null=True,
                                      help_text="Link to the investor's LinkedIn profile.")

    RISK_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )
    risk_tolerance = models.CharField(
        max_length=10,
        choices=RISK_CHOICES,
        default='medium',
        blank=True,
        null=True,
        help_text="Investor's tolerance for risk."
    )
    ACCREDITED_CHOICES = (
        ('yes', 'Yes'),
        ('no', 'No'),
        ('pending', 'Pending'),
    )
    # REMOVED: current_fund field as it's redundant with CustomUser.fund
    accredited_investor_status = models.CharField(
        max_length=10,
        choices=ACCREDITED_CHOICES,
        default='no',
        help_text="Accredited investor status."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Changed from .name to .username as CustomUser uses username
        return f"Investor Profile for {self.user.username}"

    @property
    def get_investment_focus_names(self):
        return ", ".join([industry.name for industry in self.investment_focus.all()])

    # New properties to derive dashboard metrics
    @property
    def total_investments_count(self):
        """Returns the total number of distinct businesses the investor has invested in."""
        from investments_tracking.models import Investment
        return Investment.objects.filter(user=self.user).count()

    @property
    def total_money_invested(self):
        """Returns the sum of all amounts invested by this investor."""
        from django.db.models import Sum
        from investments_tracking.models import Investment
        total = Investment.objects.filter(user=self.user).aggregate(total=Sum('amount'))['total']
        return total if total is not None else 0.00