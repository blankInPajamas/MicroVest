from django.contrib import admin
from .models import Investment

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'business', 'amount', 'invested_at']
    list_filter = ['invested_at', 'business__category']
    search_fields = ['user__username', 'business__title']
    readonly_fields = ['invested_at']
    ordering = ['-invested_at']
