import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.impute import SimpleImputer
from sklearn.utils import resample

# Load dataset
data = pd.read_csv('Machine Learning Datasets/Forecast Loan Eligibility/loan-train.csv')

# Drop Loan_ID column
data = data.drop(columns=['Loan_ID'])

# Replace '3+' with 3 in the Dependents column
data['Dependents'] = data['Dependents'].replace('3+', 3)

# Impute missing values in Dependents
dependents_imputer = SimpleImputer(strategy='most_frequent')
data['Dependents'] = dependents_imputer.fit_transform(data[['Dependents']]).astype(int)

# Split data: 80% for training, 20% for validation
train_df, val_df = train_test_split(data, test_size=0.2, random_state=42, stratify=data['Loan_Status'])

# Target encoding for Loan_Status
y_train = train_df['Loan_Status'].apply(lambda x: 1 if x == 'Y' else 0)
y_val = val_df['Loan_Status'].apply(lambda x: 1 if x == 'Y' else 0)

# Drop Loan_Status column from both train and validation sets
train_df = train_df.drop(columns=['Loan_Status'])
val_df = val_df.drop(columns=['Loan_Status'])

# Categorical columns to encode
categorical_cols = ['Gender', 'Married', 'Education', 'Self_Employed', 'Property_Area']

# Apply LabelEncoder to categorical features for both train and validation sets
label_encoders = {}
for col in categorical_cols:
    label_encoders[col] = LabelEncoder()
    train_df[col] = label_encoders[col].fit_transform(train_df[col])
    val_df[col] = label_encoders[col].transform(val_df[col])

# Handle missing values in numerical columns
numerical_cols = train_df.select_dtypes(include=['float64', 'int64']).columns
imputer = SimpleImputer(strategy='median')
train_df[numerical_cols] = imputer.fit_transform(train_df[numerical_cols])
val_df[numerical_cols] = imputer.transform(val_df[numerical_cols])

# Oversample minority class
train_majority = train_df[y_train == 1]
train_minority = train_df[y_train == 0]
y_majority = y_train[y_train == 1]
y_minority = y_train[y_train == 0]

train_minority_upsampled, y_minority_upsampled = resample(train_minority, y_minority, replace=True, n_samples=len(train_majority), random_state=42)

# Combine majority and upsampled minority samples
train_df = pd.concat([train_majority, train_minority_upsampled])
y_train = pd.concat([y_majority, y_minority_upsampled])

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(train_df)
X_val = scaler.transform(val_df)

# Train Logistic Regression model
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train, y_train)

# Save the trained model and scaler
joblib.dump(model, 'finance_management_backend/ml_app/loan_eligibility_model.pkl')
joblib.dump(scaler, 'finance_management_backend/ml_app/scaler.pkl')
joblib.dump(label_encoders, 'finance_management_backend/ml_app/label_encoders.pkl')

# Evaluate model on validation set
y_pred = model.predict(X_val)
print("Validation Accuracy:", accuracy_score(y_val, y_pred))
print("Classification Report:\n", classification_report(y_val, y_pred))

print("Validation set size:", val_df.shape[0])

print("Training set size after augmentation:", train_df.shape[0])

