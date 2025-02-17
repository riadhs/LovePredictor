import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
import sys
import json
import os
import nltk


# Replace 'your_file.xlsx' with the path to your Excel file
df = pd.read_excel('src/love_data.xlsx', sheet_name='Sheet1') 

# Split the data into features (X) and target (y)
X_train = df['text']
y_train = df['love_score']

# Convert ENGLISH_STOP_WORDS from frozenset to a list
stop_words_list = list(ENGLISH_STOP_WORDS)

# Use TfidfVectorizer to convert text to numeric features (using sklearn's ENGLISH_STOP_WORDS as a list)
vectorizer = TfidfVectorizer(stop_words=stop_words_list)

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
 