from django.urls import path
from .views import register_user, login_user, logout_user, change_password, password_reset_request

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('change-password/', change_password, name='change_password'),
    path('password-reset/', password_reset_request, name='password_reset_request'), 
]
