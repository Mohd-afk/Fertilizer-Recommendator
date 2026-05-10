from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np

class FertilizerModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False
        self.fertilizer_classes = [
            'Urea', 'DAP', 'MOP', 'NPK 14-35-14', 
            'NPK 10-26-26', 'NPK 12-32-16', 'Organic'
        ]

    def train_mock(self):
        """
        Trains the model on a small synthetic dataset to simulate real behavior.
        """
        # Synthetic features: N, P, K, pH, Moisture
        X = np.array([
            [20, 10, 10, 6.5, 40], # Urea Case
            [10, 50, 10, 7.0, 30], # DAP Case
            [10, 10, 50, 6.0, 50], # MOP Case
            [40, 40, 40, 6.5, 45], # NPK Case
            [5, 5, 5, 5.5, 60],    # Organic Case
        ])
        y = np.array(['Urea', 'DAP', 'MOP', 'NPK 14-35-14', 'Organic'])
        
        self.model.fit(X, y)
        self.is_trained = True

    def predict(self, features: dict):
        """
        Predicts fertilizer type based on soil features.
        """
        if not self.is_trained:
            self.train_mock()
            
        data = [[
            features.get('nitrogen', 50),
            features.get('phosphorus', 50),
            features.get('potassium', 50),
            features.get('ph', 7.0),
            features.get('moisture', 45)
        ]]
        
        prediction = self.model.predict(data)[0]
        probs = self.model.predict_proba(data)[0]
        confidence = float(np.max(probs))
        
        return prediction, confidence
