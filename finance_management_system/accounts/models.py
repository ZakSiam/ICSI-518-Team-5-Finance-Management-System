from django.db import models

# Create your models here.

class Expense(models.Model):
    # id= models.BigIntegerField(max=100)
    category =  models.CharField(max_length=150)
    amount = models.FloatField()
    description= models.CharField(max_length=250)
    date= models.CharField(max_length=100)

class RecurringExpense(models.Model):
    id = models.BigAutoField(primary_key=True)
    # id= models.BigIntegerField(primary_key=True)
    description= models.CharField(max_length=250)
    amount = models.FloatField()
    category = models.CharField(max_length=150)
    # frequency = models.CharField(max_length=250)
    date= models.CharField(max_length=100)


