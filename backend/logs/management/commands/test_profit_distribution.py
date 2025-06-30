from django.core.management.base import BaseCommand
from logs.models import Log
from investments.models import Business
from investments_tracking.models import Investment
from users.models import CustomUser
from decimal import Decimal

class Command(BaseCommand):
    help = 'Test profit distribution functionality by creating a test log with profit'

    def add_arguments(self, parser):
        parser.add_argument(
            '--business-id',
            type=int,
            help='ID of the business to create log for',
        )
        parser.add_argument(
            '--revenue',
            type=float,
            default=10000.0,
            help='Revenue amount for the log',
        )
        parser.add_argument(
            '--expense',
            type=float,
            default=6000.0,
            help='Expense amount for the log',
        )

    def handle(self, *args, **options):
        business_id = options['business_id']
        revenue = options['revenue']
        expense = options['expense']

        try:
            # Get the business
            business = Business.objects.get(id=business_id)
            self.stdout.write(f"Found business: {business.title}")

            # Check if business has investors
            investments = Investment.objects.filter(business=business)
            if not investments.exists():
                self.stdout.write(
                    self.style.ERROR(f"No investments found for business {business.title}")
                )
                return

            self.stdout.write(f"Found {investments.count()} investments for this business")

            # Get next month and year for the log
            next_month, next_year = Log.get_next_month_year(business_id)
            
            # Create a test log with profit
            log = Log.objects.create(
                business=business,
                title=f"Test Profit Log - {business.title}",
                content="This is a test log to verify profit distribution functionality.",
                total_revenue=revenue,
                total_expense=expense,
                month=next_month,
                year=next_year,
                profit_notes="Test profit distribution to investors"
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created test log for {business.title} with revenue: ${revenue}, expense: ${expense}, profit: ${log.profit_generated}"
                )
            )

            # Check profit distributions
            from logs.models import ProfitDistribution
            distributions = ProfitDistribution.objects.filter(log=log)
            
            if distributions.exists():
                self.stdout.write(f"Profit distributions created:")
                for dist in distributions:
                    self.stdout.write(f"  - {dist.user.username}: ${dist.amount_distributed} ({dist.distribution_percentage}%)")
            else:
                self.stdout.write(
                    self.style.WARNING("No profit distributions were created. Check the signal.")
                )

        except Business.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"Business with ID {business_id} does not exist")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error creating test log: {str(e)}")
            ) 