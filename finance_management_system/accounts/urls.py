from django.urls import path
from .views import register_user, login_user, logout_user, change_password, password_reset_request, expense_list, expense_details, recurring_expense_list, recurring_expense_details

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('change-password/', change_password, name='change_password'),
    path('password-reset/', password_reset_request, name='password_reset_request'), 
    path('expenses/', expense_list),
    path('expenses/<int:pk>/', expense_details),
    path('recurring_expense/', recurring_expense_list),
    path('recurring_expense/<int:pk>/', recurring_expense_details),
]
