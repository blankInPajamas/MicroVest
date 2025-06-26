from django.core.management.base import BaseCommand
from messaging.models import FriendRequest
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Check all friend requests in the database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Checking friend requests...'))
        
        # Get all friend requests
        friend_requests = FriendRequest.objects.all()
        
        if not friend_requests.exists():
            self.stdout.write(self.style.WARNING('No friend requests found in the database.'))
            return
        
        self.stdout.write(f'Found {friend_requests.count()} friend request(s):\n')
        
        for request in friend_requests:
            self.stdout.write(
                f'ID: {request.id} | '
                f'From: {request.from_user.username} (ID: {request.from_user.id}) | '
                f'To: {request.to_user.username} (ID: {request.to_user.id}) | '
                f'Status: {request.status} | '
                f'Created: {request.created_at}'
            )
        
        # Show pending requests
        pending_requests = friend_requests.filter(status='pending')
        if pending_requests.exists():
            self.stdout.write(f'\n{pending_requests.count()} pending request(s):')
            for request in pending_requests:
                self.stdout.write(
                    f'  - {request.from_user.username} -> {request.to_user.username}'
                )
        
        # Show accepted requests
        accepted_requests = friend_requests.filter(status='accepted')
        if accepted_requests.exists():
            self.stdout.write(f'\n{accepted_requests.count()} accepted request(s):')
            for request in accepted_requests:
                self.stdout.write(
                    f'  - {request.from_user.username} -> {request.to_user.username}'
                )
        
        # Show rejected requests
        rejected_requests = friend_requests.filter(status='rejected')
        if rejected_requests.exists():
            self.stdout.write(f'\n{rejected_requests.count()} rejected request(s):')
            for request in rejected_requests:
                self.stdout.write(
                    f'  - {request.from_user.username} -> {request.to_user.username}'
                ) 