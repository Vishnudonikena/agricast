<div align="center">

# 🌾 AgriCast
### Crop Price Prediction System

*Helping farmers and agricultural stakeholders make smarter selling decisions using machine learning*

[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)](https://pandas.pydata.org)
![Status](https://img.shields.io/badge/Status-Active-22C55E?style=flat-square)

</div>

---

## What is AgriCast?

AgriCast is a machine learning system that forecasts agricultural commodity prices — starting with wheat — using historical market data. The goal is simple: give farmers a data-backed answer to *"should I sell now or wait?"*

Price volatility is one of the biggest risks in farming. Most farmers rely on guesswork or middlemen. AgriCast puts the data in their hands directly.

---

## Results

| Metric | Baseline | AgriCast Model | Improvement |
|--------|----------|----------------|-------------|
| MAE | ₹180/quintal | ₹42/quintal | **77% better** |
| Model | Moving average | Random Forest | — |
| Data | — | 3 years APMC wholesale prices | — |

> **Replace these numbers with your actual measured results before publishing.**

---

 Features

- Predicts future crop prices from historical APMC wholesale data
- Cleans and preprocesses raw market data automatically
- Interactive Flask web UI — farmers can enter inputs and get a price forecast instantly
- Visual charts comparing predicted vs actual prices and historical trend lines
- Feature engineering pipeline (seasonality, lag features, rolling averages)

---

 Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Python 3.x |
| ML Model | Random Forest (Scikit-learn) |
| Data Processing | Pandas, NumPy |
| Visualisation | Matplotlib, Seaborn |
| Web UI | Flask |
| Environment | Jupyter Notebook, VS Code |

---

 Project Structure

```
AgriCast/
├── data/
│   ├── raw/               # Original APMC price data
│   └── processed/         # Cleaned, feature-engineered data
├── model/
│   └── rf_model.pkl       # Trained Random Forest model
├── notebooks/
│   ├── 01_eda.ipynb       # Exploratory data analysis
│   ├── 02_preprocessing.ipynb
│   └── 03_model_training.ipynb
├── static/                # CSS, JS for Flask UI
├── templates/             # HTML templates
├── app.py                 # Flask application entry point
├── requirements.txt
└── README.md
```

---

 Getting Started

**Prerequisites:** Python 3.8+

```bash
# 1. Clone the repo
git clone https://github.com/Vishnudonikena/agricast.git
cd agricast

# 2. Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open `http://localhost:5000` in your browser.

---

 How It Works

```
Raw APMC Data → Cleaning & Feature Engineering → Random Forest Model → Price Forecast → Flask UI
```

1. **Data collection** — Historical wholesale prices sourced from APMC market records (Telangana)
2. **Preprocessing** — Handles missing values, encodes seasonality, creates lag and rolling-average features
3. **Model training** — Random Forest trained on 3 years of data; evaluated against a moving-average baseline
4. **Prediction** — User enters crop type and date range; model returns forecasted price with a confidence range
5. **Visualisation** — Charts show historical trend, predicted vs actual, and seasonal patterns

---

Roadmap

- [x] Random Forest baseline model
- [x] Flask web UI
- [ ] Deploy on Render (in progress)
- [ ] Real-time APMC data integration via API
- [ ] Expand to more crops (rice, maize, cotton)
- [ ] LSTM model for improved time-series accuracy
- [ ] Mobile-friendly interface

---

 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

 Contact

**Vishnu Sai Donikena**
📧 vishnusaidonikena@gmail.com
💼 [LinkedIn](https://www.linkedin.com/in/vishnusai-doniker)
🔍 Open to Data Analyst roles — remote & freelance

---

<div align="center">
  <i>If AgriCast helped you or you found it interesting, a ⭐ goes a long way.</i>
</div>
