from django.contrib import admin
from .models import Industry, InvestorProfile

@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    ordering = ['name']

@admin.register(InvestorProfile)
class InvestorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'investment_range_min', 'investment_range_max', 'risk_tolerance', 'accredited_investor_status', 'created_at']
    list_filter = ['risk_tolerance', 'accredited_investor_status', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['preferred_industries']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Investment Preferences', {
            'fields': ('investment_range_min', 'investment_range_max', 'risk_tolerance', 'preferred_industries')
        }),
        ('Accreditation', {
            'fields': ('accredited_investor_status', 'proof_of_accreditation')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
