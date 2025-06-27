from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from investments.models import Business
from investments_tracking.models import Investment
from notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Test the investment notification signal'

    def handle(self, *args, **options):
        self.stdout.write('Testing investment notification signal...')
        
        # Get users and businesses
        users = User.objects.all()
        businesses = Business.objects.all()
        
        if not users.exists() or not businesses.exists():
            self.stdout.write(self.style.ERROR('Need at least one user and one business'))
            return
        
        # Find a user and business combination that doesn't have an investment
        investor = None
        business = None
        
        for user in users:
            for biz in businesses:
                if not Investment.objects.filter(user=user, business=biz).exists():
                    investor = user
                    business = biz
                    break
            if investor:
                break
        
        if not investor or not business:
            self.stdout.write(self.style.ERROR('No available user-business combination for testing'))
            return
        
        self.stdout.write(f'Using investor: {investor.username}')
        self.stdout.write(f'Using business: {business.title}')
        
        # Check current notification count
        initial_count = Notification.objects.count()
        self.stdout.write(f'Initial notification count: {initial_count}')
        
        # Create an investment manually to trigger the signal
        try:
            investment = Investment.objects.create(
                user=investor,
                business=business,
                amount=100.00
            )
            self.stdout.write(f'Created investment: {investment.id}')
            
            # Check if notification was created
            final_count = Notification.objects.count()
            self.stdout.write(f'Final notification count: {final_count}')
            
            if final_count > initial_count:
                self.stdout.write(self.style.SUCCESS('Signal worked! Notification created.'))
                # Show the notification
                new_notification = Notification.objects.latest('id')
                self.stdout.write(f'Notification message: {new_notification.message}')
            else:
                self.stdout.write(self.style.ERROR('Signal did not work. No notification created.'))
            
            # Clean up
            investment.delete()
            self.stdout.write('Test investment deleted')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
        
        self.stdout.write(self.style.SUCCESS('Investment signal test completed')) 