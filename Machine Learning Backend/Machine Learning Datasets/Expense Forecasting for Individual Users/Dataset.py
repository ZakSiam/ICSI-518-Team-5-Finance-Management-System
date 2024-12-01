import pandas as pd
import numpy as np
import random
from datetime import datetime

# Define date range from January 2022 to October 2024
dates = pd.date_range(start="2022-01-01", end="2024-10-01", freq='MS')

# Define categories and baseline amounts in USD for New York, USA context
categories = {
    "Food": 500,               # Groceries, dining out, etc.
    "Housing": 1500,           # Rent, mortgage, home maintenance (fixed per user)
    "Utilities": 200,          # Water, electricity, gas, internet, etc.
    "Transportation": 150,     # Fuel, public transit, vehicle maintenance
    "Entertainment": 100,      # Movies, subscriptions, events
    "Recurring Payments": 250, # Insurance, subscriptions, memberships (fixed per user)
    "Miscellaneous": 75,       # Other uncategorized expenses
    "Healthcare": 120,         # Medical expenses, insurance
    "Savings": 400,            # Contributions to savings, investments
    "Taxes": 300               # Income tax, property tax, etc.
}

# Number of synthetic individuals to simulate
num_individuals = 100

# List to hold dataset rows
data = []

# Generate synthetic data for multiple individuals
for user_id in range(1, num_individuals + 1):
    # Set fixed expenses for each user
    user_fixed_expenses = {
        "Housing": round(categories["Housing"] + np.random.normal(0, categories["Housing"] * 0.05), 2),
        "Recurring Payments": round(categories["Recurring Payments"] + np.random.normal(0, categories["Recurring Payments"] * 0.05), 2)
    }
    
    for date in dates:
        for category, base_amount in categories.items():
            if category in user_fixed_expenses:
                # Use the fixed amount for consistent monthly expenses
                expense_amount = user_fixed_expenses[category]
            else:
                # Add seasonal variations for specific categories
                if category in ["Food", "Utilities", "Transportation", "Entertainment"]:
                    if date.month in [12, 1, 2]:  # Winter
                        season_adjustment = base_amount * random.uniform(0.1, 0.2)
                    elif date.month in [6, 7, 8]:  # Summer
                        season_adjustment = base_amount * random.uniform(0.05, 0.15)
                    else:
                        season_adjustment = 0
                else:
                    season_adjustment = 0

                # Add random noise around the base amount + seasonal adjustment
                noise = np.random.normal(0, base_amount * 0.1)  # 10% noise
                expense_amount = round(base_amount + season_adjustment + noise, 2)
                
            # Ensure no negative expenses
            expense_amount = max(expense_amount, 0)

            # Append data
            data.append([user_id, date.strftime('%Y-%m'), category, expense_amount])

# Create DataFrame
expense_forecasting_df = pd.DataFrame(data, columns=["UserID", "Date", "Category", "Expense Amount"])

# Save to CSV
expense_forecasting_df_path = "Machine Learning Datasets/Expense Forecasting for Individual Users/Expense_Forecasting_Synthetic_Data.csv"
expense_forecasting_df.to_csv(expense_forecasting_df_path, index=False)

expense_forecasting_df_path
