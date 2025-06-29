# Generated by Django 4.2.13 on 2025-06-28 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0002_log_profit_distributed_log_profit_distribution_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='achievements',
            field=models.TextField(blank=True, help_text='Key achievements and milestones', null=True),
        ),
        migrations.AlterField(
            model_name='log',
            name='financial_update',
            field=models.TextField(blank=True, help_text='Financial performance and metrics', null=True),
        ),
        migrations.AlterField(
            model_name='log',
            name='fund_usage',
            field=models.TextField(blank=True, help_text='How the funds are being used', null=True),
        ),
        migrations.AlterField(
            model_name='log',
            name='next_steps',
            field=models.TextField(blank=True, help_text='Planned next steps', null=True),
        ),
        migrations.AlterField(
            model_name='log',
            name='progress_update',
            field=models.TextField(blank=True, help_text='Progress made with the funds', null=True),
        ),
    ]
