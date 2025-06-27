from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from investments.models import Business
from investments_tracking.models import Investment
from notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Test the notification system'

    def handle(self, *args, **options):
        self.stdout.write('Testing notification system...')
        
        # Check if there are any users
        users = User.objects.all()
        self.stdout.write(f'Found {users.count()} users')
        
        # Check if there are any businesses
        businesses = Business.objects.all()
        self.stdout.write(f'Found {businesses.count()} businesses')
        
        # Check if there are any investments
        investments = Investment.objects.all()
        self.stdout.write(f'Found {investments.count()} investments')
        
        # Check if there are any notifications
        notifications = Notification.objects.all()
        self.stdout.write(f'Found {notifications.count()} notifications')
        
        # Show sample data
        if users.exists():
            user = users.first()
            self.stdout.write(f'Sample user: {user.username} (ID: {user.id})')
        
        if businesses.exists():
            business = businesses.first()
            self.stdout.write(f'Sample business: {business.title} (ID: {business.id}, User: {business.user})')
        
        if investments.exists():
            investment = investments.first()
            self.stdout.write(f'Sample investment: {investment.user.username} invested ${investment.amount} in {investment.business.title}')
        
        if notifications.exists():
            notification = notifications.first()
            self.stdout.write(f'Sample notification: {notification.message}')
        
        # Test creating a notification manually
        if users.exists() and businesses.exists():
            user = users.first()
            business = businesses.first()
            
            # Create a test notification
            test_notification = Notification.objects.create(
                recipient=user,
                message=f"Test notification for {user.username}"
            )
            self.stdout.write(f'Created test notification: {test_notification.id}')
            
            # Clean up
            test_notification.delete()
            self.stdout.write('Test notification deleted')
        
        self.stdout.write(self.style.SUCCESS('Notification test completed')) 