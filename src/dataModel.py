import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline
from nltk.corpus import stopwords
import sys
import json
import os
import nltk

# # Automatically download stopwords if not available
# try:
#     stopwords.words('english')
# except LookupError:
#     nltk.download('stopwords')

nltk_data_dir = os.getenv('NLTK_DATA', '/opt/render/project/src/nltk_data')
if not os.path.exists(nltk_data_dir):
    os.makedirs(nltk_data_dir)
nltk.data.path.append(nltk_data_dir)

# Replace 'your_file.xlsx' with the path to your Excel file
df = pd.read_excel('src/love_data.xlsx', sheet_name='Sheet1') 

# Split the data into features (X) and target (y)
X_train = df['text']
y_train = df['love_score']

# Use TfidfVectorizer to convert text to numeric features
vectorizer = TfidfVectorizer(stop_words=stopwords.words('english'))

# Create a model pipeline with TF-IDF Vectorizer and Random Forest Regressor
model = make_pipeline(vectorizer, RandomForestRegressor(n_estimators=100))

# Train the model
model.fit(X_train, y_train)

# Read input data from command-line arguments
if len(sys.argv) > 1:
    input_data = sys.argv[1]
    data = json.loads(input_data)
    text = [data['text']]
else:
    print("No input data provided.")
    sys.exit(1)

# Make a prediction
predicted_love_score = model.predict(text)
print(f"{predicted_love_score[0]}")
