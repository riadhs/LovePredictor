import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.pipeline import make_pipeline
import nltk
from nltk.corpus import stopwords
import sys
import json

# Automatically download stopwords if not available
try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')

# Sample data (Text and Love score)
data = {
    "text": [
        "I love you so much!", 
        "I care about you a little", 
        "I have feelings for you", 
        "You're amazing, I like you", 
        "I don't love you at all", 
        "You're the best, I adore you", 
        "I'm indifferent to you", 
        "You mean a lot to me", 
        "I have no strong feelings", 
        "I really like you"
    ],
    "love_score": [95, 45, 60, 70, 10, 90, 20, 80, 25, 85]
}

# Create a DataFrame
df = pd.DataFrame(data)

# Split the data into features (X) and target (y)
X_train = df['text']
y_train = df['love_score']

# Split into training and test set
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Use TfidfVectorizer to convert text to numeric features
vectorizer = TfidfVectorizer(stop_words=stopwords.words('english'))

# Create a model pipeline with TF-IDF Vectorizer and Random Forest Regressor
model = make_pipeline(vectorizer, RandomForestRegressor(n_estimators=100))

# Train the model
model.fit(X_train, y_train)

# Predictions on test set
#y_pred = model.predict(X_test)

# Evaluate model
# mse = mean_squared_error(y_test, y_pred)
#print(f"Mean Squared Error: {mse}")

# Read input data from command-line arguments
if len(sys.argv) > 1:
    input_data = sys.argv[1]
    data = json.loads(input_data)
    sample_text = [data['text']]
else:
    print("No input data provided.")
    sys.exit(1) 

predicted_love_score = model.predict(sample_text)
print(f"Predicted love score for the text '{sample_text[0]}': {predicted_love_score[0]}")
