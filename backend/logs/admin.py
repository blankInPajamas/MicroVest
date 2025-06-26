from django.contrib import admin
from .models import Log, ProfitDistribution

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ['title', 'business', 'profit_generated', 'profit_distributed', 'created_at']
    list_filter = ['created_at', 'business', 'profit_distribution_date']
    search_fields = ['title', 'content', 'business__title']
    readonly_fields = ['created_at', 'updated_at', 'profit_retained']
    fieldsets = (
        ('Basic Information', {
            'fields': ('business', 'title', 'content')
        }),
        ('Progress Details', {
            'fields': ('fund_usage', 'progress_update', 'achievements')
        }),
        ('Additional Information', {
            'fields': ('challenges', 'next_steps', 'financial_update')
        }),
        ('Profit Information', {
            'fields': ('profit_generated', 'profit_distributed', 'profit_retained', 'profit_distribution_date', 'profit_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ProfitDistribution)
class ProfitDistributionAdmin(admin.ModelAdmin):
    list_display = ['user', 'log', 'amount_distributed', 'distribution_percentage', 'distributed_at']
    list_filter = ['distributed_at', 'log__business']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'log__title']
    readonly_fields = ['distributed_at']
    ordering = ['-distributed_at']
