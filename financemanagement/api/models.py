from django.db import models

# Create your models here.

class Expense(models.Model):
    # id= models.BigIntegerField(max=100)
    category =  models.CharField(max_length=150)
    amount = models.FloatField()
    description= models.CharField(max_length=250)
    date= models.CharField(max_length=100)
    


