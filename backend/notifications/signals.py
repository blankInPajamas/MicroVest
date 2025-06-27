# backend/notifications/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from investments_tracking.models import Investment
from logs.models import Log, ProfitDistribution
from .models import Notification
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Investment)
def investment_notification(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Investment notification signal triggered for investment {instance.id}")
        try:
            business_owner = instance.business.user
            investor_name = instance.user.get_full_name() or instance.user.username
            message = f"You have a new investment of ${instance.amount} from {investor_name} in your business '{instance.business.title}'."
            notification = Notification.objects.create(recipient=business_owner, message=message)
            logger.info(f"Notification created: {notification.id} for user {business_owner.username}")
        except Exception as e:
            logger.error(f"Error creating investment notification: {e}")

@receiver(post_save, sender=Log)
def new_log_notification(sender, instance, created, **kwargs):
    if created:
        investors = instance.business.investments_received.values_list('user', flat=True)
        for investor_id in investors:
            message = f"A new business report log is available for '{instance.business.title}'."
            Notification.objects.create(recipient_id=investor_id, message=message)

@receiver(post_save, sender=ProfitDistribution)
def invoice_notification(sender, instance, created, **kwargs):
    if created:
        message = f"You have received a profit distribution of ${instance.amount_distributed} from '{instance.log.business.title}'."
        Notification.objects.create(recipient=instance.user, message=message)