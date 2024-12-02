import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping
import joblib

# Load dataset
expense_data_path = 'Machine Learning Datasets/Expense Forecasting for Group Users/Revised_Group_Expense_Forecasting_Synthetic_Data.csv'
expense_df = pd.read_csv(expense_data_path)

# Pivot data to have one row per user per month with each category as a column
pivot_df = expense_df.pivot_table(index=['UserID', 'Date'], columns='Category', values='Expense Amount').reset_index()

# Ensure the categories match
categories = ["Food", "Housing", "Utilities", "Transportation", "Entertainment",
              "Recurring Payments", "Miscellaneous", "Healthcare", "Savings", "Taxes"]

# Fill any missing values with 0 (or another strategy if preferred)
pivot_df[categories] = pivot_df[categories].fillna(0)

# Split data into training (UserID 1-27) and testing (UserID 28-30)
train_data = pivot_df[pivot_df['UserID'] <= 27]
test_data = pivot_df[pivot_df['UserID'] > 27]

# Separate features and target for the training and testing sets
scaler = MinMaxScaler()
train_scaled = scaler.fit_transform(train_data[categories])
test_scaled = scaler.transform(test_data[categories])

# Save the scaler for use in predict.py
joblib.dump(scaler, 'finance_management_backend/ml_app/group_expense_scaler.pkl')

# Reshape data for LSTM [samples, timesteps, features]
X_train, y_train = [], []
sequence_length = 3  # Define sequence length (e.g., 3 months for forecasting)

for i in range(sequence_length, len(train_scaled)):
    X_train.append(train_scaled[i-sequence_length:i])  # Previous `sequence_length` months
    y_train.append(train_scaled[i])                    # Next month

X_train, y_train = np.array(X_train), np.array(y_train)

X_test, y_test = [], []
for i in range(sequence_length, len(test_scaled)):
    X_test.append(test_scaled[i-sequence_length:i])
    y_test.append(test_scaled[i])

X_test, y_test = np.array(X_test), np.array(y_test)

# Define the LSTM model
model = Sequential([
    LSTM(64, activation='relu', return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
    LSTM(64, activation='relu'),
    Dense(len(categories))  # Output layer for each category
])

model.compile(optimizer='adam', loss='mse')
early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# Train the model
history = model.fit(X_train, y_train, epochs=30, batch_size=16, validation_data=(X_test, y_test), callbacks=[early_stop])

# Evaluate on the test set
test_loss = model.evaluate(X_test, y_test)
print(f'Test Loss: {test_loss}')

# Save the trained model
model.save('finance_management_backend/ml_app/group_expense_forecasting_model.h5')

# Function to forecast the next `n_months`
def forecast_expenses(model, input_data, n_months=3):
    predictions = []
    current_input = input_data.copy()

    for _ in range(n_months):
        pred = model.predict(np.expand_dims(current_input, axis=0))[0]
        predictions.append(pred)
        current_input = np.roll(current_input, -1, axis=0)  # Shift input by 1 month
        current_input[-1] = pred  # Append the new prediction to the sequence

    return scaler.inverse_transform(predictions)  # Transform predictions back to original scale

# Example forecast for the next 3 months based on last 3 months of the test set
last_sequence = X_test[-1]
predictions = forecast_expenses(model, last_sequence, n_months=3)
print(predictions)





