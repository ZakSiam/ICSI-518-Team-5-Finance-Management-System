from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Expense, RecurringExpense

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Create a new user with hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields=['id','category','amount','description','date']
        # fields=['id','amount','description','date']

class RecuringExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringExpense
        # fields=['id','description','amount', 'category', 'frequency', 'date']
        fields=['id','description','amount', 'category', 'date']
