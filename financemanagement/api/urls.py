from django.urls import path
from .views import expense_list, expense_details

urlpatterns = [
    path('expenses/', expense_list),
    path('expenses/<int:pk>/', expense_details),
]
