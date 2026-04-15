import pandas as pd
from pathlib import Path
from functools import lru_cache

DATA_PATH = Path(__file__).parent.parent / "data" / "crop_data.csv"

@lru_cache(maxsize=1)
def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    print(f"✅ Loaded {len(df)} rows from crop_data.csv")
    return df

@lru_cache(maxsize=1)
def build_summary() -> str:
    df = load_data()
    total = len(df)

    health   = df["crop_health"].value_counts().to_dict()
    pest     = df["pest_risk"].value_counts().to_dict()
    anomalies = int((df["anomaly_flag"] == 1).sum())
    irrigation = int((df["irrigation_needed"] == 1).sum())

    crop_stats = []
    for crop, grp in df.groupby("crop_type"):
        crop_stats.append(
            f"  - {crop}: {len(grp)} records | "
            f"avg yield: {grp['yield_estimate'].mean():.2f} | "
            f"avg soil moisture: {grp['soil_moisture'].mean():.2f}% | "
            f"avg temp: {grp['temperature'].mean():.2f}°C"
        )

    loc_stats = []
    for loc, grp in df.groupby("location"):
        healthy_pct = (grp["crop_health"] == "Healthy").mean() * 100
        irrig = int((grp["irrigation_needed"] == 1).sum())
        loc_stats.append(
            f"  - {loc}: {len(grp)} records | "
            f"{healthy_pct:.1f}% healthy | {irrig} need irrigation"
        )

    season_stats = [
        f"  - {s}: {len(g)} records"
        for s, g in df.groupby("season")
    ]

    return f"""
=== NURSERYPULSE SMART AGRICULTURE DATASET SUMMARY ===

OVERVIEW:
- Total sensor readings: {total}
- Time period: January–December 2024
- Locations: Mymensingh, Rajshahi, Chattogram, Dhaka, Khulna, Sylhet (Bangladesh)
- Crop types: Rice, Wheat, Tomato, Jute, Potato
- Seasons: Winter, Summer

CROP HEALTH STATUS:
- Healthy:  {health.get('Healthy',  0)} ({health.get('Healthy',  0)/total*100:.1f}%)
- Stressed: {health.get('Stressed', 0)} ({health.get('Stressed', 0)/total*100:.1f}%)
- Critical: {health.get('Critical', 0)} ({health.get('Critical', 0)/total*100:.1f}%)

PEST RISK:
- Low: {pest.get('Low',0)} | Medium: {pest.get('Medium',0)} | High: {pest.get('High',0)}

ANOMALIES DETECTED: {anomalies} records flagged
IRRIGATION NEEDED:  {irrigation} records require irrigation

STATS BY CROP TYPE:
{chr(10).join(crop_stats)}

STATS BY LOCATION:
{chr(10).join(loc_stats)}

STATS BY SEASON:
{chr(10).join(season_stats)}

COLUMN DEFINITIONS:
- temperature (°C), humidity (%), rainfall (mm), soil_moisture (%)
- soil_ph: optimal 6.0–7.5
- light_intensity (lux)
- irrigation_needed: 1=required, 0=not required
- crop_health: Healthy / Stressed / Critical
- yield_estimate: tons/hectare (Tomato/Potato), tons/acre (others)
- pest_risk: Low / Medium / High
- anomaly_flag: 1=anomaly detected, 0=normal
""".strip()


def get_filtered_context(query: str) -> dict:
    df = load_data().copy()
    q = query.lower()

    LOCATIONS = ["mymensingh", "rajshahi", "chattogram", "dhaka", "khulna", "sylhet"]
    CROPS     = ["rice", "wheat", "tomato", "jute", "potato"]
    HEALTH    = ["critical", "stressed", "healthy"]

    for loc in LOCATIONS:
        if loc in q:
            df = df[df["location"].str.lower() == loc]
            break

    for crop in CROPS:
        if crop in q:
            df = df[df["crop_type"].str.lower() == crop]
            break

    for h in HEALTH:
        if h in q:
            df = df[df["crop_health"].str.lower() == h]
            break

    if "anomal" in q:
        df = df[df["anomaly_flag"] == 1]
    if "irrigat" in q:
        df = df[df["irrigation_needed"] == 1]

    sample = df.head(50).to_dict(orient="records")
    health_counts = df["crop_health"].value_counts().to_dict()

    stats = {
        "total":            len(df),
        "avg_temp":         round(df["temperature"].mean(), 2)    if len(df) else 0,
        "avg_humidity":     round(df["humidity"].mean(), 2)       if len(df) else 0,
        "avg_soil_moisture":round(df["soil_moisture"].mean(), 2)  if len(df) else 0,
        "avg_yield":        round(df["yield_estimate"].mean(), 2) if len(df) else 0,
        "avg_ph":           round(df["soil_ph"].mean(), 2)        if len(df) else 0,
        "health_breakdown": health_counts,
    }

    return {"stats": stats, "sample": sample}
