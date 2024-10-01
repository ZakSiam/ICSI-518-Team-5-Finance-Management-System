from rest_framework import serializers
from .models import Expense

# class ExpenseSerializer(serializers.Serializer):
#     id= serializers.BigIntegerField(max=100)
#     category =  serializers.CharField(max_length=150)
#     amount = serializers.FloatField()
#     description= serializers.CharField(max_length=250)

#     def create(self, validated_data):
#         return Expense.objects.create(validated_data)
    
#     def update(self, instance, validated_data):
#         instance.id= validated_data.get('id', instance.id)
#         instance.category= validated_data.get('category', instance.category)
#         instance.amount= validated_data.get('amount', instance.amount)
#         instance.description= validated_data.get('description', instance.description)


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields=['id','category','amount','description','date']
        # fields=['id','amount','description','date']

        
