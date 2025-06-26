from django.shortcuts import render

# Create your views here.
# blossomvest_backend/users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated # Allows unauthenticated users to access these views
from rest_framework_simplejwt.tokens import RefreshToken # Used for generating JWTs

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserProfileUpdateSerializer
from .models import CustomUser # <--- ENSURE CustomUser IS IMPORTED HERE

# Helper function to generate JWT tokens for a given user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all() # Specifies the model this view operates on
    serializer_class = UserRegisterSerializer # Links to your registration serializer
    permission_classes = [AllowAny] # No authentication required to register

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Raise an error if validation fails
        user = serializer.save() # Create the user using the serializer's create method

        # Optional: You could generate tokens immediately upon registration here
        # tokens = get_tokens_for_user(user) 

        return Response({
            "message": "User Registered Successfully",
            # "tokens": tokens, # Uncomment if you want tokens immediately after registration
        }, status=status.HTTP_201_CREATED) # 201 status for successful creation

class UserLoginView(APIView):
    permission_classes = [AllowAny] # No authentication required to log in

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Validate incoming login data
        user = serializer.validated_data['user'] # Get the authenticated user object from serializer

        tokens = get_tokens_for_user(user) # Generate access and refresh tokens for the user

        return Response({
            "message": "Login Successful",
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "user_type": user.user_type,
            "tokens": tokens,
        }, status=status.HTTP_200_OK) # 200 status for successful login

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated] # Requires authentication

    def put(self, request, *args, **kwargs):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "message": "Profile Updated Successfully",
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "user_type": user.user_type,
        }, status=status.HTTP_200_OK)