from rest_framework import serializers
from .models import Investment

class InvestmentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    business_title = serializers.CharField(source='business.title', read_only=True)
    formatted_amount = serializers.CharField(source='formatted_amount', read_only=True)
    
    class Meta:
        model = Investment
        fields = ['id', 'user', 'user_name', 'business', 'business_title', 'amount', 'formatted_amount', 'invested_at']
        read_only_fields = ['user', 'invested_at']
    
    def create(self, validated_data):
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class InvestmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = ['business', 'amount']
    
    def validate(self, data):
        # Check if user has already invested in this business
        user = self.context['request'].user
        business = data['business']
        
        if Investment.objects.filter(user=user, business=business).exists():
            raise serializers.ValidationError("You have already invested in this business.")
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data) 