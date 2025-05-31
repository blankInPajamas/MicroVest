# MicroBackend/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

# Import your messaging app's routing (you'll create this later)
# For now, we'll comment it out or point it to a placeholder if you prefer.
# For now, it will cause an import error if `messaging` app doesn't exist yet.
# import messaging.routing # UNCOMMENT THIS ONCE YOU CREATE THE MESSAGING APP

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        # For now, keep websocket empty or commented out until messaging app is ready
        # "websocket": AllowedHostsOriginValidator(
        #     AuthMiddlewareStack(URLRouter(messaging.routing.websocket_urlpatterns))
        # ),
    }
)