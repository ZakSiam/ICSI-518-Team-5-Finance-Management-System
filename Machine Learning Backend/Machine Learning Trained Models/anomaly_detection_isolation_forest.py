import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import joblib

# Function to preprocess data
def preprocess_data_revised(data):
    """
    Preprocess data by dropping redundant features, scaling numerical features,
    and one-hot encoding categorical features.
    """
    # Drop 'Member Expense Share' as it is redundant
    data = data.drop(columns=["Member Expense Share"])

    # Select features
    numerical_features = ["Total Expense", "Group Size"]
    categorical_features = ["Category"]

    # One-hot encode the categorical features and scale numerical features
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(), categorical_features)
        ]
    )

    # Apply the transformations
    processed_data = preprocessor.fit_transform(data)
    return processed_data, preprocessor

# Load the dataset
file_path = 'Machine Learning Datasets/Anomaly Detection in Group Expenses/Group_Expense_Forecasting_Synthetic_Data.csv' 
group_expense_data = pd.read_csv(file_path)

# Preprocess the data
processed_data_revised, preprocessor_revised = preprocess_data_revised(group_expense_data)

# Train the Isolation Forest model
isolation_forest_revised = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
isolation_forest_revised.fit(processed_data_revised)

# Save the revised model and preprocessor
revised_model_path = "finance_management_backend/ml_app/isolation_forest_model.joblib"
revised_preprocessor_path = "finance_management_backend/ml_app/isolation_forest_data_preprocessor.joblib"
joblib.dump(isolation_forest_revised, revised_model_path)
joblib.dump(preprocessor_revised, revised_preprocessor_path)

print(f"Model and preprocessor saved to {revised_model_path} and {revised_preprocessor_path}.")

# Function to predict anomalies in new test data
def predict_anomalies_for_api(test_data_path, model_path, preprocessor_path):
    """
    Predict anomalies for API input data using a trained Isolation Forest model.

    Parameters:
        test_data_path (str): Path to the CSV file containing test data.
        model_path (str): Path to the trained Isolation Forest model.
        preprocessor_path (str): Path to the preprocessor.

    Returns:
        list: A list of predictions (1 for normal, -1 for anomaly).
    """
    # Load test data
    test_data = pd.read_csv(test_data_path)

    # Drop 'Member Expense Share' if it exists
    if "Member Expense Share" in test_data.columns:
        test_data = test_data.drop(columns=["Member Expense Share"])

    # Ensure the test data contains only necessary columns
    required_columns = ["Category", "Total Expense", "Group Size"]
    test_data = test_data[required_columns]

    # Preprocess the test data
    preprocessor = joblib.load(preprocessor_path)
    processed_test_data = preprocessor.transform(test_data)

    # Load the model and make predictions
    model = joblib.load(model_path)
    predictions = model.predict(processed_test_data)
    return predictions.tolist()


