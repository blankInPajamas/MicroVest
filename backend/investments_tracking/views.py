from logs.models import Log
from logs.models import ProfitDistribution
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Sum, Count
from .models import Investment
from .serializers import InvestmentSerializer, InvestmentCreateSerializer
from investments.models import Business
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from django.db import models

# Create your views here.

class InvestmentCreateView(generics.CreateAPIView):
    serializer_class = InvestmentCreateSerializer
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Check if user is an entrepreneur - they cannot invest in any business
        if request.user.user_type == 'entrepreneur':
            return Response({
                'error': 'Entrepreneurs cannot invest in other businesses. Focus on growing your own business!'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        business = serializer.validated_data['business']
        amount = serializer.validated_data['amount']
        
        # Check if user has enough funds (optional, add if needed)
        # if user.fund < amount:
        #     return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)
        # user.fund -= amount
        # user.save(update_fields=['fund'])

        investment, created = Investment.objects.get_or_create(user=user, business=business, defaults={'amount': amount})
        if not created:
            investment.amount += amount
            investment.save(update_fields=['amount'])
            new_investment = False
        else:
            new_investment = True
        
        # Update the business funding
        business.current_funding += amount
        if new_investment:
            business.backers += 1
        business.save(update_fields=['current_funding', 'backers'])
        
        return Response({
            'message': 'Investment successful!',
            'investment': InvestmentSerializer(investment, context={'request': request}).data,
            'business_updated': {
                'current_funding': business.current_funding,
                'backers': business.backers
            }
        }, status=status.HTTP_201_CREATED)

class UserInvestmentsListView(generics.ListAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            return Investment.objects.filter(user=self.request.user)
        except Exception as e:
            import traceback
            print('Error in UserInvestmentsListView:', e)
            traceback.print_exc()
            from rest_framework.exceptions import APIException
            raise APIException(f'Error fetching investments: {e}')

class BusinessInvestmentsListView(generics.ListAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        business_id = self.kwargs.get('business_id')
        return Investment.objects.filter(business_id=business_id)

class BusinessInvestmentStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, business_id):
        try:
            business = Business.objects.get(id=business_id)
            
            # Check if the user is the owner of the business
            if business.user != request.user:
                return Response(
                    {'error': 'You can only view statistics for your own businesses.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get all investments for this business
            investments = Investment.objects.filter(business=business).select_related('user')
            
            # Calculate total invested amount
            total_invested = investments.aggregate(total=Sum('amount'))['total'] or 0
            
            # Get individual investor data (top 10 by amount)
            investor_data = []
            for investment in investments.order_by('-amount')[:10]:
                investor_data.append({
                    'user_id': investment.user.id,
                    'username': investment.user.username,
                    'first_name': investment.user.first_name,
                    'last_name': investment.user.last_name,
                    'amount': float(investment.amount),
                    'invested_at': investment.invested_at
                })
            
            # Calculate "Others" amount if there are more than 10 investors
            total_from_top_investors = sum(item['amount'] for item in investor_data)
            others_amount = float(total_invested) - total_from_top_investors
            
            # Prepare chart data
            chart_data = {
                'labels': [f"{item['first_name']} {item['last_name']}" if item['first_name'] and item['last_name'] else item['username'] for item in investor_data],
                'amounts': [item['amount'] for item in investor_data],
                'colors': [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                ]
            }
            
            # Add "Others" if there are additional investors
            if others_amount > 0:
                chart_data['labels'].append('Others')
                chart_data['amounts'].append(others_amount)
                chart_data['colors'].append('#E7E7E7')
            
            # Summary statistics
            summary = {
                'total_invested': float(total_invested),
                'total_investors': investments.count(),
                'business_title': business.title,
                'funding_goal': float(business.funding_goal),
                'progress_percentage': (float(total_invested) / float(business.funding_goal)) * 100 if business.funding_goal > 0 else 0
            }
            
            return Response({
                'summary': summary,
                'investor_data': investor_data,
                'chart_data': chart_data,
                'others_amount': others_amount if others_amount > 0 else 0
            })
            
        except Business.DoesNotExist:
            return Response(
                {'error': 'Business not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investment_list(request):
    """List all investments"""
    investments = Investment.objects.all()
    serializer = InvestmentSerializer(investments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_investment(request):
    """Create a new investment"""
    # Check if user is an entrepreneur - they cannot invest in any business
    if request.user.user_type == 'entrepreneur':
        return Response({
            'error': 'Entrepreneurs cannot invest in other businesses. Focus on growing your own business!'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = InvestmentSerializer(data=request.data)
    if serializer.is_valid():
        # Check if user already invested in this business
        existing_investment = Investment.objects.filter(
            user=request.user,
            business=serializer.validated_data['business']
        ).first()
        
        if existing_investment:
            return Response(
                {'error': 'You have already invested in this business'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user has enough funds
        if request.user.fund < serializer.validated_data['amount']:
            return Response(
                {'error': 'Insufficient funds'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Deduct amount from user's fund
        request.user.fund -= serializer.validated_data['amount']
        request.user.save(update_fields=['fund'])
        
        # Add amount to business current funding
        business = serializer.validated_data['business']
        business.current_funding += serializer.validated_data['amount']
        business.backers = Investment.objects.filter(business=business).count() + 1
        business.save(update_fields=['current_funding', 'backers'])
        
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_investment_stats(request, business_id):
    """Get investment statistics for a specific business"""
    try:
        business = get_object_or_404(Business, id=business_id)
        investments = Investment.objects.filter(business=business)
        
        total_invested = investments.aggregate(total=models.Sum('amount'))['total'] or 0
        total_investors = investments.count()
        
        # Get recent investments
        recent_investments = investments.order_by('-invested_at')[:5]
        recent_serializer = InvestmentSerializer(recent_investments, many=True)
        
        return Response({
            'total_invested': float(total_invested),
            'total_investors': total_investors,
            'recent_investments': recent_serializer.data
        })
    except Business.DoesNotExist:
        return Response(
            {'error': f'Business with ID {business_id} not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_investments(request):
    """Get recent investments for businesses owned by the current user"""
    try:
        # Get businesses owned by the current user
        user_businesses = Business.objects.filter(user=request.user)
        
        # Get recent investments in those businesses
        recent_investments = Investment.objects.filter(
            business__in=user_businesses
        ).select_related('user', 'business').order_by('-invested_at')[:10]
        
        # Enhance the data with user and business information
        enhanced_data = []
        for investment in recent_investments:
            enhanced_data.append({
                'id': investment.id,
                'user_name': investment.user.username,
                'user_full_name': f"{investment.user.first_name} {investment.user.last_name}".strip() or investment.user.username,
                'amount': float(investment.amount),
                'invested_at': investment.invested_at.isoformat(),
                'business_title': investment.business.title
            })
        
        return Response(enhanced_data)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investor_recent_investments(request):
    """Get recent investments made by the current investor"""
    try:
        # Get recent investments made by the current user
        recent_investments = Investment.objects.filter(
            user=request.user
        ).select_related('business', 'business__user').order_by('-invested_at')[:10]
        
        # Enhance the data with business information and share percentage
        enhanced_data = []
        for investment in recent_investments:
            try:
                business = investment.business
                
                # Calculate share percentage
                total_business_investment = Investment.objects.filter(business=business).aggregate(
                    total=models.Sum('amount')
                )['total'] or 0
                
                share_percentage = (float(investment.amount) / float(total_business_investment)) * 100 if total_business_investment > 0 else 0
                
                # Get business image safely
                business_image = None
                try:
                    if business.images.exists():
                        business_image = business.images.first().image.url
                except Exception:
                    pass
                
                enhanced_data.append({
                    'id': investment.id,
                    'business_id': business.id,
                    'business_name': business.title,
                    'category_name': business.category.name if hasattr(business.category, 'name') else (business.category if business.category else 'Uncategorized'),
                    'amount_invested': float(investment.amount),
                    'investment_date': investment.invested_at.isoformat(),
                    'entrepreneur_name': f"{business.user.first_name} {business.user.last_name}".strip() or business.user.username,
                    'entrepreneur_id': business.user.id,
                    'share_percentage': round(share_percentage, 2),
                    # Additional business details with proper fallbacks
                    'business_location': getattr(business, 'location', 'Location not specified'),
                    'business_funding_goal': float(getattr(business, 'funding_goal', 0)),
                    'business_current_funding': float(getattr(business, 'current_funding', 0)),
                    'business_backers': getattr(business, 'backers', 0),
                    'business_image': business_image,
                    'business_deadline': None,  # Business model doesn't have deadline field
                    'entrepreneur_first_name': business.user.first_name or '',
                    'entrepreneur_last_name': business.user.last_name or '',
                    'entrepreneur_username': business.user.username
                })
            except Exception:
                continue
        
        return Response(enhanced_data)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def entrepreneur_investors(request):
    """Get all investors for businesses owned by the current entrepreneur"""
    try:
        # Get businesses owned by the current user
        user_businesses = Business.objects.filter(user=request.user)
        
        if not user_businesses.exists():
            return Response([])
        
        # Get all investments in those businesses
        investments = Investment.objects.filter(
            business__in=user_businesses
        ).select_related('user', 'business').order_by('-invested_at')
        
        # Group by investor to avoid duplicates
        investor_data = {}
        for investment in investments:
            investor_id = investment.user.id
            if investor_id not in investor_data:
                investor_data[investor_id] = {
                    'investor_id': investment.user.id,
                    'investor_name': f"{investment.user.first_name} {investment.user.last_name}".strip() or investment.user.username,
                    'investor_username': investment.user.username,
                    'investor_email': investment.user.email,
                    'total_invested_in_my_businesses': 0,
                    'total_businesses_invested_in': 0,
                    'investments': []
                }
            
            # Add investment details
            investor_data[investor_id]['investments'].append({
                'business_id': investment.business.id,
                'business_title': investment.business.title,
                'business_category': investment.business.category,
                'amount_invested': float(investment.amount),
                'invested_at': investment.invested_at.isoformat(),
                'share_percentage': round((float(investment.amount) / float(investment.business.funding_goal)) * 100, 2)
            })
            
            # Update totals
            investor_data[investor_id]['total_invested_in_my_businesses'] += float(investment.amount)
            investor_data[investor_id]['total_businesses_invested_in'] = len(set(
                inv['business_id'] for inv in investor_data[investor_id]['investments']
            ))
        
        # Convert to list and sort by total invested amount
        result = list(investor_data.values())
        result.sort(key=lambda x: x['total_invested_in_my_businesses'], reverse=True)
        
        return Response(result)
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investor_statistics(request):
    """Get comprehensive investment statistics for the current investor, including monthwise revenue/expense/profit."""
    try:
        user = request.user
        # Get all investments by the user
        investments = Investment.objects.filter(user=user).select_related('business')
        # All businesses the user has invested in
        business_ids = investments.values_list('business_id', flat=True)
        # Calculate total invested amount
        total_invested = investments.aggregate(total=models.Sum('amount'))['total'] or 0
        # Calculate total returns from profit distributions
        total_returns = ProfitDistribution.objects.filter(user=user).aggregate(
            total=models.Sum('amount_distributed')
        )['total'] or 0
        # Get current fund balance
        current_fund = user.fund
        # Calculate portfolio value (invested + returns + current fund)
        portfolio_value = float(total_invested) + float(total_returns) + float(current_fund)
        # Get active investments (businesses that are still active)
        active_investments = investments.filter(
            business__current_funding__lt=models.F('business__funding_goal')
        ).count()
        # Get completed investments (fully funded businesses)
        completed_investments = investments.filter(
            business__current_funding__gte=models.F('business__funding_goal')
        ).count()
        # Get profit distribution history
        profit_distributions = ProfitDistribution.objects.filter(user=user).select_related(
            'log', 'log__business'
        ).order_by('-distributed_at')[:10]
        profit_history = []
        for distribution in profit_distributions:
            log = distribution.log
            month_display = log.get_month_display() if log.month else "Unknown Month"
            year_display = log.year if log.year else "Unknown Year"
            profit_history.append({
                'id': distribution.id,
                'business_title': distribution.log.business.title,
                'business_id': distribution.log.business.id,
                'amount_received': float(distribution.amount_distributed),
                'distribution_percentage': float(distribution.distribution_percentage),
                'distributed_at': distribution.distributed_at.isoformat(),
                'log_month': month_display,
                'log_year': year_display
            })
        # Get monthly profit data for charts
        monthly_profit_data = ProfitDistribution.objects.filter(user=user).values(
            'log__month', 'log__year'
        ).annotate(
            total_profit=models.Sum('amount_distributed')
        ).order_by('log__year', 'log__month')
        chart_data = []
        for month_data in monthly_profit_data:
            chart_data.append({
                'month': f"{month_data['log__year']}-{month_data['log__month']:02d}",
                'profit': float(month_data['total_profit'])
            })
        # Get investment breakdown by business
        investment_breakdown = []
        for investment in investments.select_related('business'):
            business = investment.business
            total_business_investment = Investment.objects.filter(business=business).aggregate(
                total=models.Sum('amount')
            )['total'] or 0
            # Calculate share percentage
            share_percentage = (float(investment.amount) / float(total_business_investment)) * 100 if total_business_investment > 0 else 0
            # Calculate total returns from this business
            business_returns = ProfitDistribution.objects.filter(
                user=user,
                log__business=business
            ).aggregate(total=models.Sum('amount_distributed'))['total'] or 0
            investment_breakdown.append({
                'business_id': business.id,
                'business_title': business.title,
                'business_category': business.category,
                'amount_invested': float(investment.amount),
                'share_percentage': share_percentage,
                'total_returns': float(business_returns),
                'roi_percentage': (float(business_returns) / float(investment.amount)) * 100 if float(investment.amount) > 0 else 0,
                'invested_at': investment.invested_at.isoformat(),
                'is_active': business.current_funding < business.funding_goal
            })
        # Monthwise revenue/expense/profit for all businesses the user has invested in
        logs = Log.objects.filter(business_id__in=business_ids)
        monthwise = {}
        for log in logs:
            if log.month and log.year:
                key = f"{log.year}-{log.month:02d}"
                if key not in monthwise:
                    monthwise[key] = {'revenue': 0, 'expense': 0, 'profit': 0}
                monthwise[key]['revenue'] += float(log.total_revenue or 0)
                monthwise[key]['expense'] += float(log.total_expense or 0)
                monthwise[key]['profit'] += float(log.profit_generated or 0)
        monthwise_data = [
            {'month': k, 'revenue': v['revenue'], 'expense': v['expense'], 'profit': v['profit']}
            for k, v in sorted(monthwise.items())
        ]
        return Response({
            'summary': {
                'total_invested': float(total_invested),
                'total_returns': float(total_returns),
                'current_fund': float(current_fund),
                'portfolio_value': portfolio_value,
                'active_investments': active_investments,
                'completed_investments': completed_investments,
                'total_investments': investments.count(),
                'overall_roi_percentage': (float(total_returns) / float(total_invested)) * 100 if float(total_invested) > 0 else 0
            },
            'profit_history': profit_history,
            'investment_breakdown': investment_breakdown,
            'chart_data': chart_data,
            'monthwise_data': monthwise_data
        })
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
