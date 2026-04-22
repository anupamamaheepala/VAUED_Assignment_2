# data_loader.py
import json
import pandas as pd
from pathlib import Path
from functools import lru_cache

#DATA_PATH = Path(__file__).parent.parent / "data" / "crop_data.csv"
DATA_PATH = Path(__file__).parent.parent / "data" / "Cleaned_Smart_Agriculture_Data.csv"

@lru_cache(maxsize=1)
def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    #print(f"✅ Loaded {len(df)} rows from crop_data.csv")
    print(f"✅ Loaded {len(df)} rows from Cleaned_Smart_Agriculture_Data.csv")
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

    sample = json.loads(df.head(10).to_json(orient="records"))
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


# =========================
# NEW FUNCTIONS FOR WEBSITE
# =========================

def get_dashboard_data() -> dict:
    df = load_data().copy()
    total = len(df)

    healthy_count = int((df["crop_health"] == "Healthy").sum())
    stressed_count = int((df["crop_health"] == "Stressed").sum())
    critical_count = int((df["crop_health"] == "Critical").sum())

    overall_health_pct = round((healthy_count / total) * 100, 2) if total else 0
    critical_pct = round((critical_count / total) * 100, 2) if total else 0

    anomalies = int((df["anomaly_flag"] == 1).sum())
    irrigation_needed = int((df["irrigation_needed"] == 1).sum())
    season_yield = round(df["yield_estimate"].sum(), 2)

    by_crop = (
        df.groupby("crop_type")
        .agg(
            total_units=("crop_type", "count"),
            healthy=("crop_health", lambda x: int((x == "Healthy").sum())),
            stressed=("crop_health", lambda x: int((x == "Stressed").sum())),
            critical=("crop_health", lambda x: int((x == "Critical").sum())),
            yield_total=("yield_estimate", "sum"),
        )
        .reset_index()
    )

    crop_distribution = []
    season_yield_list = []

    for _, row in by_crop.iterrows():
        total_units = int(row["total_units"])
        healthy_pct = round((row["healthy"] / total_units) * 100, 2) if total_units else 0
        stressed_pct = round((row["stressed"] / total_units) * 100, 2) if total_units else 0
        critical_pct_crop = round((row["critical"] / total_units) * 100, 2) if total_units else 0

        crop_distribution.append({
            "label": f"{row['crop_type']} Sector",
            "total": total_units,
            "healthy": healthy_pct,
            "stressed": stressed_pct,
            "critical": critical_pct_crop,
        })

        season_yield_list.append({
            "label": row["crop_type"],
            "value": round(float(row["yield_total"]), 2)
        })

    sector_rows = df.head(10).copy()
    sector_rows = sector_rows[[
        "location",
        "crop_type",
        "soil_moisture",
        "soil_ph",
        "temperature",
        "crop_health"
    ]].rename(columns={
        "location": "sector_id",
        "crop_type": "primary_crop",
        "soil_ph": "ph_balance",
        "crop_health": "status"
    })

    table_rows = sector_rows.to_dict(orient="records")

    advice_location = None
    low_moisture_df = df.sort_values("soil_moisture", ascending=True)
    if len(low_moisture_df):
        advice_location = low_moisture_df.iloc[0]["location"]

    return {
        "summary": {
            "overall_health_pct": overall_health_pct,
            "healthy_pct": overall_health_pct,
            "critical_pct": critical_pct,
            "active_risks": anomalies,
            "irrigation_needed": irrigation_needed,
            "season_yield": season_yield,
            "healthy_count": healthy_count,
            "stressed_count": stressed_count,
            "critical_count": critical_count,
            "daily_advice": f"Your nursery is {overall_health_pct}% healthy. {advice_location} sector has low soil moisture; consider irrigation."
        },
        "season_yield_by_crop": season_yield_list,
        "crop_distribution": crop_distribution,
        "table_rows": table_rows,
    }


def get_health_data() -> dict:
    df = load_data().copy()

    avg_soil_moisture = round(df["soil_moisture"].mean(), 2) if len(df) else 0
    avg_soil_ph = round(df["soil_ph"].mean(), 2) if len(df) else 0
    avg_light = round(df["light_intensity"].mean(), 2) if len(df) else 0

    crop_rows = (
        df.groupby("crop_type")
        .agg(
            records=("crop_type", "count"),
            healthy=("crop_health", lambda x: int((x == "Healthy").sum())),
            stressed=("crop_health", lambda x: int((x == "Stressed").sum())),
            critical=("crop_health", lambda x: int((x == "Critical").sum())),
            high_pest=("pest_risk", lambda x: int((x == "High").sum())),
        )
        .reset_index()
    )

    crops = []
    for _, row in crop_rows.iterrows():
        if row["critical"] > 0:
            status = "Critical"
        elif row["stressed"] > 0:
            status = "Warning"
        else:
            status = "Stable"

        if row["high_pest"] > 0:
            risk = "High"
        elif row["stressed"] > 0:
            risk = "Medium"
        else:
            risk = "Low"

        crops.append({
            "name": row["crop_type"],
            "status": status,
            "risk": risk,
            "sync": "Live",
        })

    ai_message = "All monitored crops are within acceptable ranges."
    over_moisture = df[df["soil_moisture"] > 80]
    if len(over_moisture):
        sample = over_moisture.iloc[0]
        ai_message = (
            f"Detecting possible nutrient leaching in {sample['location']} "
            f"({sample['crop_type']}). Moisture levels exceed optimal range."
        )

    return {
        "gauges": {
            "soil_moisture": avg_soil_moisture,
            "soil_ph": avg_soil_ph,
            "light_intensity": avg_light,
        },
        "crops": crops,
        "ai_diagnosis": ai_message,
        "network_health": {
            "soil_sensors": "12 / 12",
            "light_nodes": "8 / 8"
        }
    }


def get_alerts_data() -> dict:
    df = load_data().copy()

    alerts_df = df[(df["anomaly_flag"] == 1) | (df["irrigation_needed"] == 1)].copy()

    rows = []
    for _, row in alerts_df.head(50).iterrows():
        if row["anomaly_flag"] == 1:
            issue = "Anomaly Detected"
            severity = "URGENT"
        else:
            issue = "Irrigation Required"
            severity = "MODERATE"

        rows.append({
            "timestamp": str(row["timestamp"]),
            "location": row["location"],
            "crop": row["crop_type"],
            "issue": issue,
            "severity": severity,
        })

    critical_alerts = int((alerts_df["anomaly_flag"] == 1).sum())
    irrigation_req = int((alerts_df["irrigation_needed"] == 1).sum())

    return {
        "critical_alerts": critical_alerts,
        "irrigation_required": irrigation_req,
        "alerts": rows,
        "total_active": len(rows),
    }


def get_trends_data(location=None, crop=None, period=None):
    df = load_data().copy()

    if location and location != "All Locations":
        df = df[df["location"].astype(str).str.strip().str.lower() == location.strip().lower()]

    if crop and crop != "All Crop Types":
        df = df[df["crop_type"].astype(str).str.strip().str.lower() == crop.strip().lower()]

    if period == "Q1 - 2024":
        df = df[df["month"].isin(["Jan", "Feb", "Mar"])]
    elif period == "Q2 - 2024":
        df = df[df["month"].isin(["Apr", "May", "Jun"])]
    elif period == "Q3 - 2024":
        df = df[df["month"].isin(["Jul", "Aug", "Sep"])]
    elif period == "Q4 - 2024":
        df = df[df["month"].isin(["Oct", "Nov", "Dec"])]

    has_fertilizer = "fertilizer_usage" in df.columns

    monthly = (
        df.groupby("month")
        .agg(
            actual_output=("yield_estimate", "sum"),
            avg_rainfall=("rainfall", "mean"),
            avg_fertilizer=("fertilizer_usage", "mean") if has_fertilizer else ("rainfall", "mean"),
        )
        .reset_index()
    )

    month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly["month"] = pd.Categorical(monthly["month"], categories=month_order, ordered=True)
    monthly = monthly.sort_values("month")

    bar_chart = [
        {
            "label": str(row["month"]),
            "fertilizer": round(float(row["avg_fertilizer"]), 2),
            "rainfall": round(float(row["avg_rainfall"]), 2),
        }
        for _, row in monthly.iterrows()
    ]

    avg_growth_rate = 0
    if len(monthly) > 1:
        first_val = float(monthly.iloc[0]["actual_output"])
        last_val = float(monthly.iloc[-1]["actual_output"])
        if first_val != 0:
            avg_growth_rate = round(((last_val - first_val) / first_val) * 100, 2)

    if len(monthly) > 0:
        peak_row = monthly.loc[monthly["actual_output"].idxmax()]
        peak_month = {
            "month": str(peak_row["month"]),
            "value": round(float(peak_row["actual_output"]), 2),
        }
    else:
        peak_month = {"month": "N/A", "value": 0}

    best_location_data = (
        df.groupby("location")["yield_estimate"]
        .mean()
        .sort_values(ascending=False)
        .head(1)
    )

    best_location = {
        "name": best_location_data.index[0] if len(best_location_data) else "N/A",
        "efficiency": round(float(best_location_data.iloc[0]), 2) if len(best_location_data) else 0,
    }

    return {
        "bar_chart": bar_chart,
        "avg_growth_rate": avg_growth_rate,
        "peak_month": peak_month,
        "best_location": best_location,
    }
        

    # line_chart = []
    # for _, row in monthly.iterrows():
    #     line_chart.append({
    #         "label": row["month"],
    #         "actual": round(float(row["actual_output"]), 2),
    #     })

    # bar_chart = []
    # for _, row in monthly.iterrows():
    #     bar_chart.append({
    #         "label": row["month"],
    #         "fertilizer": round(float(row["avg_fertilizer"]), 2),
    #         "rainfall": round(float(row["avg_rainfall"]), 2),
    #     })

    # avg_growth_rate = 0
    # if len(monthly) > 1:
    #     first_val = float(monthly.iloc[0]["actual_output"])
    #     last_val = float(monthly.iloc[-1]["actual_output"])
    #     if first_val != 0:
    #         avg_growth_rate = round(((last_val - first_val) / first_val) * 100, 2)

    # peak_row = monthly.loc[monthly["actual_output"].idxmax()] if len(monthly) else None

    # best_location = (
    #     df.groupby("location")["yield_estimate"]
    #     .mean()
    #     .sort_values(ascending=False)
    #     .head(1)
    # )

    # best_location_name = best_location.index[0] if len(best_location) else "N/A"
    # best_location_eff = round(float(best_location.iloc[0]), 2) if len(best_location) else 0

    # return {
    #     "line_chart": line_chart,
    #     "bar_chart": bar_chart,
    #     "avg_growth_rate": avg_growth_rate,
    #     "peak_month": {
    #         "month": peak_row["month"] if peak_row is not None else "N/A",
    #         "value": round(float(peak_row["actual_output"]), 2) if peak_row is not None else 0
    #     },
    #     "best_location": {
    #         "name": best_location_name,
    #         "efficiency": best_location_eff
    #     }
    # }