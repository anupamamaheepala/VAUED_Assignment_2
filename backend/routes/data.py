print("🔥 data.py LOADED")
from fastapi import APIRouter
from utils.data_loader import (
    get_dashboard_data,
    get_health_data,
    get_alerts_data,
    get_trends_data,
)

router = APIRouter()


@router.get("/dashboard")
def dashboard_data():
    return get_dashboard_data()


@router.get("/health")
def health_data():
    return get_health_data()


@router.get("/alerts")
def alerts_data():
    return get_alerts_data()

@router.get("/trends")
def trends_data(location: str = None, crop: str = None, period: str = None):
    return get_trends_data(location, crop, period)