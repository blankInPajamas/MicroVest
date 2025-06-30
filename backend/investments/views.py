# investments/views.py
from rest_framework import generics
from rest_framework.response import Response 
from rest_framework import status 
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.db import transaction
from .models import Business, CalendarEvent, SavedBusiness
from .serializers import (
    BusinessListSerializer,
    BusinessDetailSerializer,
    BusinessPitchSerializer,
    InvestmentSerializer,
    BusinessImageSerializer,
    BusinessVideoSerializer,
    BusinessDocumentSerializer,
    CalendarEventSerializer,
    SavedBusinessSerializer,
    SavedBusinessListSerializer
)
from .permissions import IsOwnerOrReadOnly, IsOwner, IsAuthenticatedOrReadOnly
from django.db.models import F
from investments_tracking.models import Investment
from django.utils.dateparse import parse_date
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from messaging.utils import create_automatic_friendship
from django.shortcuts import get_object_or_404
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pdf_extractor import PDFExtractor

class InvestAPIView(generics.GenericAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]  # Require authentication for investment

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Check if user is an entrepreneur - they cannot invest in any business
        if request.user.user_type == 'entrepreneur':
            return Response({
                'error': 'Entrepreneurs cannot invest in other businesses. Focus on growing your own business!'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Get the business and investment amount
        business_id = serializer.validated_data['business_id']
        investment_amount = serializer.validated_data['investment_amount']
        
        # Get the business
        business = Business.objects.get(id=business_id)
        
        # Check if user has already invested in this business
        existing_investment = Investment.objects.filter(user=request.user, business=business).first()
        
        if existing_investment:
            # Update existing investment
            old_amount = existing_investment.amount
            existing_investment.amount += investment_amount
            existing_investment.save()
            
            # Update the business funding (only add the new amount)
            business.current_funding += investment_amount
            business.save(update_fields=['current_funding'])
            
            # Automatically create friendship between investor and business owner
            create_automatic_friendship(request.user, business.user)
            
            # Return the updated business data
            return Response({
                'message': f'Additional investment of ${investment_amount} successful! Total investment: ${existing_investment.amount}',
                'current_funding': business.current_funding,
                'backers': business.backers,
                'investment_id': existing_investment.id,
                'total_investment': existing_investment.amount
            }, status=status.HTTP_200_OK)
        else:
            # Create new investment record
            investment = Investment.objects.create(
                user=request.user,
                business=business,
                amount=investment_amount
            )
            
            # Update the business funding and backers count
            business.current_funding += investment_amount
            business.backers += 1
            business.save(update_fields=['current_funding', 'backers'])
            
            # Automatically create friendship between investor and business owner
            create_automatic_friendship(request.user, business.user)
            
            # Return the updated business data
            return Response({
                'message': 'Investment successful!',
                'current_funding': business.current_funding,
                'backers': business.backers,
                'investment_id': investment.id
            }, status=status.HTTP_200_OK)

class BusinessDeleteView(generics.DestroyAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessDetailSerializer
    lookup_field = 'id'
    permission_classes = [IsOwner]  # Only owner can delete

class BusinessCreateView(generics.CreateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessPitchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Require authentication for creation

    def perform_create(self, serializer):
        # Assign the current user to the business
        serializer.save(user=self.request.user)

class BusinessListView(generics.ListAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessListSerializer
    permission_classes = [AllowAny]  # Allow public access to browse businesses

    def get_serializer_context(self): # Add this method to pass request context
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)

        if category and category != 'All Categories':
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        sort_by = self.request.query_params.get('sort_by', 'trending')

        if sort_by == 'funding':
            queryset = queryset.order_by('-current_funding')
        elif sort_by == 'goal':
            queryset = queryset.order_by('-funding_goal')
        else:
            queryset = queryset.order_by('-backers')

        return queryset

class BusinessDetailView(generics.RetrieveAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessDetailSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]  # Allow public access to view business details

    def get_serializer_context(self): # Add this method to pass request context
        return {'request': self.request}

class BusinessUpdateView(generics.UpdateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessPitchSerializer
    lookup_field = 'id'
    permission_classes = [IsOwnerOrReadOnly]  # Only owner can update

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class UserBusinessListView(generics.ListAPIView):
    serializer_class = BusinessListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Return only businesses owned by the current user
        return Business.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_events(request):
    """Get calendar events for the current month for user's businesses"""
    try:
        # Get current month and year
        today = datetime.now()
        year = request.GET.get('year', today.year)
        month = request.GET.get('month', today.month)
        
        # Get user's businesses
        user_businesses = Business.objects.filter(user=request.user)
        
        # Get events for the specified month
        events = CalendarEvent.objects.filter(
            business__in=user_businesses,
            date__year=year,
            date__month=month
        ).select_related('business')
        
        serializer = CalendarEventSerializer(events, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_calendar_event(request):
    """Create a new calendar event"""
    try:
        serializer = CalendarEventSerializer(data=request.data)
        if serializer.is_valid():
            # Verify the business belongs to the user
            business_id = request.data.get('business')
            if not Business.objects.filter(id=business_id, user=request.user).exists():
                return Response(
                    {'error': 'Business not found or access denied'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class SavedBusinessListView(generics.ListAPIView):
    serializer_class = SavedBusinessListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedBusiness.objects.filter(user=self.request.user)

class SavedBusinessCreateView(generics.CreateAPIView):
    serializer_class = SavedBusinessSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedBusinessDeleteView(generics.DestroyAPIView):
    queryset = SavedBusiness.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedBusiness.objects.filter(user=self.request.user)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_save_business(request, business_id):
    """
    Toggle save/unsave a business for the current user
    """
    try:
        business = Business.objects.get(id=business_id)
    except Business.DoesNotExist:
        return Response({'error': 'Business not found'}, status=status.HTTP_404_NOT_FOUND)

    saved_business, created = SavedBusiness.objects.get_or_create(
        user=request.user,
        business=business
    )

    if request.method == 'DELETE':
        # Unsave the business
        saved_business.delete()
        return Response({'message': 'Business unsaved successfully'}, status=status.HTTP_200_OK)
    else:
        # Save the business (already created above)
        return Response({
            'message': 'Business saved successfully',
            'saved': True
        }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def extract_business_documents(request, business_id):
    """Extract text from business documents for AI chat"""
    try:
        # Get the business
        business = get_object_or_404(Business, id=business_id)
        
        # Get documents from the business
        documents = business.documents.all()
        
        if not documents.exists():
            return Response({
                'documents': {},
                'summary': 'No documents available for this business.',
                'message': 'This business has no documents uploaded.'
            })
        
        # Convert documents to the format expected by PDFExtractor
        documents_data = []
        for doc in documents:
            if doc.document_file:  # Check if file exists
                documents_data.append({
                    'name': doc.name,
                    'file_url': request.build_absolute_uri(doc.document_file.url),
                    'size': doc.size or f"{doc.document_file.size / 1024 / 1024:.1f} MB" if doc.document_file.size else "Unknown"
                })
        
        # Extract text from documents
        extractor = PDFExtractor()
        extracted_documents = extractor.process_business_documents(documents_data)
        document_summary = extractor.get_document_summary(documents_data)
        
        return Response({
            'documents': extracted_documents,
            'summary': document_summary,
            'message': f'Successfully processed {len(extracted_documents)} documents.'
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to extract documents: {str(e)}',
            'documents': {},
            'summary': 'Error processing documents.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)