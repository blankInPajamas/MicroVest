from django.core.management.base import BaseCommand
from django.contrib.auth import authenticate
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Check user credentials and test login'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Checking users...'))
        
        # Get all users
        users = CustomUser.objects.all()
        
        if not users.exists():
            self.stdout.write(self.style.WARNING('No users found in the database.'))
            return
        
        self.stdout.write(f'Found {users.count()} user(s):\n')
        
        for user in users:
            self.stdout.write(
                f'ID: {user.id} | '
                f'Username: {user.username} | '
                f'Email: {user.email} | '
                f'User Type: {user.user_type}'
            )
            
            # Test common passwords
            test_passwords = ['admin', 'admin123', 'password', '123456', 'test']
            for password in test_passwords:
                authenticated_user = authenticate(username=user.username, password=password)
                if authenticated_user:
                    self.stdout.write(f'  ✅ Password found: {password}')
                    break
            else:
                self.stdout.write(f'  ❌ Password not found in common passwords')
        
        self.stdout.write('\nTo test login with a specific user, use:')
        self.stdout.write('python manage.py shell -c "from django.contrib.auth import authenticate; user = authenticate(username=\'admin\', password=\'password\'); print(f\'Auth result: {user}\')"') 