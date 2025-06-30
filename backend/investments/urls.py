from django.urls import path
from .views import (
    BusinessListView, BusinessDetailView, BusinessCreateView, BusinessUpdateView, 
    BusinessDeleteView, UserBusinessListView, InvestAPIView, calendar_events, create_calendar_event,
    SavedBusinessListView, SavedBusinessCreateView, SavedBusinessDeleteView, toggle_save_business,
    extract_business_documents
)

urlpatterns = [
    path('businesses/', BusinessListView.as_view(), name='business-list'),
    path('businesses/<int:id>/', BusinessDetailView.as_view(), name='business-detail'),
    path('businesses/create/', BusinessCreateView.as_view(), name='business-create'),
    path('businesses/pitch/', BusinessCreateView.as_view(), name='business-pitch'),
    path('businesses/<int:id>/update/', BusinessUpdateView.as_view(), name='business-update'),
    path('businesses/<int:id>/delete/', BusinessDeleteView.as_view(), name='business-delete'),
    path('my-businesses/', UserBusinessListView.as_view(), name='user-business-list'),
    path('invest/', InvestAPIView.as_view(), name='invest'),
    path('calendar/events/', calendar_events, name='calendar-events'),
    path('calendar/events/create/', create_calendar_event, name='create-calendar-event'),
    
    # Saved Business URLs
    path('saved-businesses/', SavedBusinessListView.as_view(), name='saved-business-list'),
    path('saved-businesses/create/', SavedBusinessCreateView.as_view(), name='saved-business-create'),
    path('saved-businesses/<int:pk>/', SavedBusinessDeleteView.as_view(), name='saved-business-delete'),
    path('businesses/<int:business_id>/toggle-save/', toggle_save_business, name='toggle-save-business'),
    
    # Document extraction for AI chat
    path('businesses/<int:business_id>/documents/extract/', extract_business_documents, name='extract-business-documents'),
]