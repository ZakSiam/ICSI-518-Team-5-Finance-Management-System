from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


from .serializers import UserSerializer, ExpenseSerializer, RecuringExpenseSerializer
from .models import Expense, RecurringExpense

from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta

from rest_framework_simplejwt.tokens import RefreshToken  # Using SimpleJWT for token generation

from rest_framework.permissions import IsAuthenticated

# Home view
def home(request):
    return HttpResponse("Welcome to the Finance Management System!")


# Register User
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login User
# @api_view(['POST'])
# def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Authenticate the user
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Logout User
@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


# Change Password
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    # Check if the old password is correct
    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    # Set the new password
    user.set_password(new_password)
    user.save()
    return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

# Forgot Password
@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get('email')
    # Simulate success response 
    return Response({
        "message": "If your email is registered, a password reset link has been sent to your email."
    }, status=200)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access
def expense_list(request):
    if request.method == 'GET':
        # Retrieve expenses for the authenticated user only
        expenses = Expense.objects.filter(user=request.user)

        # Optionally filter by date range
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
                end_date = end_date + timedelta(days=1) - timedelta(seconds=1)

                expenses = expenses.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        print(request.user)
        # Remove 'user' from request data and automatically set it to the authenticated user
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Set the user to the authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def expense_details(request, pk):
    try:
        expense = Expense.objects.get(pk=pk, user=request.user)  # Ensure that only the user's own expense can be accessed

    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Ensure that the user field remains the same (set to request.user)
        data = request.data.copy()  # Create a mutable copy of the request data
        serializer = ExpenseSerializer(expense, data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # Ensure the user remains the authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        expense.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def recurring_expense_list(request):
    if request.method == 'GET':
        expenses = RecurringExpense.objects.filter(user=request.user)
        serializer = RecuringExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RecuringExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Ensure to save with the authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def recurring_expense_details(request, pk):
    try:
        expense = RecurringExpense.objects.get(pk=pk, user=request.user)  # Ensure the expense belongs to the user

    except RecurringExpense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RecuringExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = RecuringExpenseSerializer(expense, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        expense.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

