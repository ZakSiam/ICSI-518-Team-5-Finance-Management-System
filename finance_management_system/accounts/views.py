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


@csrf_exempt
@api_view(['GET','POST'])
# @permission_classes([IsAuthenticated])
# def expense_list(request):
#     if request.method == 'GET':
#         expenses = Expense.objects.all()
#         serializer = ExpenseSerializer(expenses, many=True)
#         # return JsonResponse(serializer.data, safe=False)
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         # data = JSONParser().parse(request)
#         serializer = ExpenseSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


def expense_list(request):
    if request.method == 'GET':
        # Retrieve query parameters for filtering
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Retrieve all expenses initially
        expenses = Expense.objects.all()

        # Filter expenses if both dates are provided
        if start_date and end_date:
            try:
                # Parse dates to ensure valid format
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                end_date = datetime.strptime(end_date, '%Y-%m-%d')

                # Adjust end_date to include the entire day
                end_date = end_date + timedelta(days=1) - timedelta(seconds=1)

                expenses = expenses.filter(date__range=(start_date, end_date))
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the (potentially filtered) expenses
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle POST request to create new expense
        serializer = ExpenseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET','PUT','DELETE'])
def expense_details(request, pk):
    try:
        expense =  Expense.objects.get(pk=pk)
    
    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
  
        serializer = ExpenseSerializer(expense, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        expense.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
def recurring_expense_list(request):
    if request.method == 'GET':
        expenses = RecurringExpense.objects.all()
        serializer = RecuringExpenseSerializer(expenses, many=True)
        print("heererrerere")
        print(serializer.data)
        # return JsonResponse(serializer.data, safe=False)
        return Response(serializer.data)

    elif request.method == 'POST':
        # data = JSONParser().parse(request)
        serializer = RecuringExpenseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


# @csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def recurring_expense_details(request, pk):
    try:
        expense = RecurringExpense.objects.get(pk=pk)

    except Expense.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RecuringExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PUT':

        serializer = RecuringExpenseSerializer(expense, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        expense.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)
