from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction, models
from django.utils import timezone
from .models import Log, ProfitDistribution
from investments_tracking.models import Investment
from users.models import CustomUser

@receiver(post_save, sender=Log)
def distribute_profit_to_investors(sender, instance, created, **kwargs):
    """
    Automatically distribute profit to investors when a log is created with profit
    """
    if created and instance.profit_generated and float(instance.profit_generated) > 0:
        try:
            with transaction.atomic():
                # Get all investments for this business
                investments = Investment.objects.filter(business=instance.business)
                
                if not investments.exists():
                    return
                
                # Calculate total investment in this business
                total_business_investment = investments.aggregate(
                    total=models.Sum('amount')
                )['total'] or 0
                
                if total_business_investment <= 0:
                    return
                
                # Distribute profit proportionally to each investor
                for investment in investments:
                    # Calculate this investor's share of the profit
                    investor_share = (float(investment.amount) / float(total_business_investment)) * float(instance.profit_generated)
                    
                    # Create profit distribution record
                    ProfitDistribution.objects.create(
                        log=instance,
                        investment=investment,
                        user=investment.user,
                        amount_distributed=investor_share,
                        distribution_percentage=(float(investment.amount) / float(total_business_investment)) * 100
                    )
                    
                    # Add the profit to the investor's fund
                    investor = investment.user
                    current_fund = float(investor.fund or 0)
                    investor.fund = current_fund + investor_share
                    investor.save(update_fields=['fund'])
                
                # Update the log to mark profit as distributed
                instance.profit_distributed = instance.profit_generated
                instance.profit_distribution_date = timezone.now()
                instance.save(update_fields=['profit_distributed', 'profit_distribution_date'])
        except Exception as e:
            # Log the error but don't crash the application
            print(f"Error in profit distribution signal: {str(e)}")
            import traceback
            traceback.print_exc() 