from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from investments.models import Business
from investments_tracking.models import Investment
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test investments for businesses'

    def handle(self, *args, **options):
        # Get all businesses and users
        businesses = Business.objects.all()
        users = User.objects.filter(user_type='investor')
        
        if not businesses.exists():
            self.stdout.write(self.style.ERROR('No businesses found. Please create some businesses first.'))
            return
            
        if not users.exists():
            self.stdout.write(self.style.ERROR('No investor users found. Please create some investor users first.'))
            return
        
        # Create test investments
        investment_amounts = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 50000]
        
        for business in businesses:
            # Skip if business has no funding goal
            if business.funding_goal <= 0:
                continue
                
            # Create 3-8 random investments per business
            num_investments = random.randint(3, min(8, users.count()))
            selected_users = random.sample(list(users), num_investments)
            
            for user in selected_users:
                # Skip if user is the business owner
                if user == business.user:
                    continue
                    
                # Check if investment already exists
                if Investment.objects.filter(user=user, business=business).exists():
                    continue
                
                # Random investment amount
                amount = random.choice(investment_amounts)
                
                # Create investment
                investment = Investment.objects.create(
                    user=user,
                    business=business,
                    amount=Decimal(amount)
                )
                
                # Update business funding and backers
                business.current_funding += amount
                business.backers += 1
                business.save(update_fields=['current_funding', 'backers'])
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created investment: {user.username} invested ${amount} in {business.title}'
                    )
                )
        
        self.stdout.write(self.style.SUCCESS('Test investments created successfully!')) 