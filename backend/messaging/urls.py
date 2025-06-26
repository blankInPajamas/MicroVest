from django.urls import path
from .views import (
    FriendRequestListView, CreateFriendRequestView, AcceptRejectFriendRequestView,
    UserSearchView, FriendsListView, ConversationListView, ConversationDetailView,
    MessageListView, MarkMessagesAsReadView
)

urlpatterns = [
    # Friend Requests
    path('friend-requests/', FriendRequestListView.as_view(), name='friend-request-list'),
    path('friend-requests/create/', CreateFriendRequestView.as_view(), name='create-friend-request'),
    path('friend-requests/<int:pk>/', AcceptRejectFriendRequestView.as_view(), name='accept-reject-friend-request'),
    
    # Friends List
    path('friends/', FriendsListView.as_view(), name='friends-list'),
    
    # User Search
    path('users/search/', UserSearchView.as_view(), name='user-search'),
    
    # Conversations
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    
    # Messages
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('conversations/<int:conversation_id>/mark-read/', MarkMessagesAsReadView.as_view(), name='mark-messages-read'),
] 