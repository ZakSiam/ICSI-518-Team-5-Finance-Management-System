# Generated by Django 5.1.1 on 2024-09-29 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_expense_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='date',
            field=models.CharField(max_length=10),
        ),
    ]