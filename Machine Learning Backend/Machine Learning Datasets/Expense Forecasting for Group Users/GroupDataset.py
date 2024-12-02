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

# Number of synthetic groups to simulate
num_groups = 30

# Define a range for group sizes (between 2 and 10 members per group)
group_size_range = (2, 10)

# List to hold dataset rows
data = []

# Generate synthetic data for multiple groups
for group_id in range(1, num_groups + 1):
    # Randomly assign a group size within the defined range, ensuring it includes 2 as minimum
    group_size = random.randint(2, 10)
    
    # Adjust baseline expenses based on group size
    adjusted_categories = {k: v * group_size for k, v in categories.items()}
    
    # Fixed expenses for each group, with slight random variation
    group_fixed_expenses = {
        "Housing": round(adjusted_categories["Housing"] + np.random.normal(0, adjusted_categories["Housing"] * 0.05), 2),
        "Recurring Payments": round(adjusted_categories["Recurring Payments"] + np.random.normal(0, adjusted_categories["Recurring Payments"] * 0.05), 2)
    }
    
    for date in dates:
        for category, base_amount in adjusted_categories.items():
            if category in group_fixed_expenses:
                # Use fixed amount for consistent monthly expenses
                total_expense = group_fixed_expenses[category]
            else:
                # Add seasonal variations for specific categories
                if category in ["Food", "Utilities", "Transportation", "Entertainment"]:
                    if date.month in [12, 1, 2]:  # Winter
                        season_adjustment = base_amount * random.uniform(0.1, 0.25)
                    elif date.month in [6, 7, 8]:  # Summer
                        season_adjustment = base_amount * random.uniform(0.05, 0.2)
                    else:
                        season_adjustment = 0
                else:
                    season_adjustment = 0

                # Add random noise around the base amount + seasonal adjustment
                noise = np.random.normal(0, base_amount * 0.1)  # 10% noise
                total_expense = round(base_amount + season_adjustment + noise, 2)
                
            # Ensure no negative expenses
            total_expense = max(total_expense, 0)

            # Calculate each member's share by equal splitting of total expense among group members
            member_expense_share = round(total_expense / group_size, 2)

            # Append data: each row represents a group's category expense per month
            data.append([group_id, date.strftime('%Y-%m'), category, total_expense, group_size, member_expense_share])

# Create DataFrame
group_expense_forecasting_df = pd.DataFrame(data, columns=["GroupID", "Date", "Category", "Total Expense", "Group Size", "Member Expense Share"])

# Save to CSV
group_expense_forecasting_df_path = "Machine Learning Datasets/Expense Forecasting for Group Users/Group_Expense_Forecasting_Synthetic_Data.csv"
group_expense_forecasting_df.to_csv(group_expense_forecasting_df_path, index=False)

group_expense_forecasting_df_path
