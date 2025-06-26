from django.db import models
from django.contrib.auth import get_user_model
from investments.models import Business

User = get_user_model()

class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='investments_received')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    invested_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'business']  # One investment per user per business
        ordering = ['-invested_at']
    
    def __str__(self):
        return f"{self.user.username} invested ${self.amount} in {self.business.title}"
    
    @property
    def formatted_amount(self):
        return f"${self.amount:,.2f}"
