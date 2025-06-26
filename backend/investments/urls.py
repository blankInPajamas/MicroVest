from django.urls import path
from .views import BusinessListView, BusinessDetailView, BusinessCreateView, BusinessDeleteView, InvestAPIView, BusinessUpdateView, UserBusinessListView

urlpatterns = [
    path('businesses/', BusinessListView.as_view(), name='business-list'),
    path('businesses/<int:id>/', BusinessDetailView.as_view(), name='business-detail'),
    path('businesses/<int:id>/update/', BusinessUpdateView.as_view(), name='business-update'),
    path('businesses/<int:id>/delete/', BusinessDeleteView.as_view(), name='business-delete'),
    path('businesses/pitch/', BusinessCreateView.as_view(), name='business-pitch'),
    path('my-businesses/', UserBusinessListView.as_view(), name='user-business-list'),
    path('invest/', InvestAPIView.as_view(), name='invest'),
]