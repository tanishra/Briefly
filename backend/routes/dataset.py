from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import json
import os

router = APIRouter(prefix="/dataset", tags=["dataset"])

# Paths to your actual data files
SALES_DATA_PATH = os.getenv("SALES_DATA_PATH", "backend/data/sales_data.json")
MARKETING_DATA_PATH = os.getenv("MARKETING_DATA_PATH", "backend/data/marketing_data.json")

def load_json_file(file_path: str) -> List[Dict[Any, Any]]:
    """Load JSON file and return data"""
    try:
        print(f"Attempting to load file: {file_path}") 
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                data = json.load(f)
                print(f"Loaded data: {data[:2]}...")  
                return data
        else:
            print(f"File does not exist: {file_path}") 
        return []
    except Exception as e:
        print(f"Error loading {file_path}: {e}")  
        return []



def calculate_sales_stats(sales_data: List[Dict]) -> Dict:
    """Calculate statistics from sales data"""
    if not sales_data:
        return {
            "total_revenue": 0,
            "total_units": 0,
            "total_records": 0,
            "avg_revenue": 0
        }
    
    total_revenue = sum(item.get('revenue', 0) for item in sales_data)
    total_units = sum(item.get('units_sold', 0) for item in sales_data)
    
    return {
        "total_revenue": total_revenue,
        "total_units": total_units,
        "total_records": len(sales_data),
        "avg_revenue": round(total_revenue / len(sales_data), 2) if sales_data else 0
    }


def calculate_marketing_stats(marketing_data: List[Dict]) -> Dict:
    """Calculate statistics from marketing data"""
    if not marketing_data:
        return {
            "total_budget": 0,
            "total_impressions": 0,
            "total_clicks": 0,
            "total_conversions": 0,
            "total_campaigns": 0
        }
    
    return {
        "total_budget": sum(item.get('budget', 0) for item in marketing_data),
        "total_impressions": sum(item.get('impressions', 0) for item in marketing_data),
        "total_clicks": sum(item.get('clicks', 0) for item in marketing_data),
        "total_conversions": sum(item.get('conversions', 0) for item in marketing_data),
        "total_campaigns": len(marketing_data)
    }


@router.get("/overview")
async def get_dataset_overview():
    """
    GET /dataset/overview
    Returns overview of both datasets with statistics
    """
    try:
        sales_data = load_json_file(SALES_DATA_PATH)
        marketing_data = load_json_file(MARKETING_DATA_PATH)
        
        sales_stats = calculate_sales_stats(sales_data)
        marketing_stats = calculate_marketing_stats(marketing_data)
        
        # Get file sizes
        sales_size = os.path.getsize(SALES_DATA_PATH) if os.path.exists(SALES_DATA_PATH) else 0
        marketing_size = os.path.getsize(MARKETING_DATA_PATH) if os.path.exists(MARKETING_DATA_PATH) else 0
        
        # Get last modified dates
        sales_modified = os.path.getmtime(SALES_DATA_PATH) if os.path.exists(SALES_DATA_PATH) else None
        marketing_modified = os.path.getmtime(MARKETING_DATA_PATH) if os.path.exists(MARKETING_DATA_PATH) else None
        
        from datetime import datetime
        
        return {
            "ok": True,
            "sales_dataset": {
                "name": "Sales Data",
                "file": "sales_data.json",
                "total_records": sales_stats["total_records"],
                "file_size": f"{sales_size / 1024:.2f} KB",
                "last_updated": datetime.fromtimestamp(sales_modified).strftime("%Y-%m-%d") if sales_modified else "N/A",
                "status": "active" if sales_data else "empty",
                "statistics": sales_stats
            },
            "marketing_dataset": {
                "name": "Marketing Data",
                "file": "marketing_data.json",
                "total_records": marketing_stats["total_campaigns"],
                "file_size": f"{marketing_size / 1024:.2f} KB",
                "last_updated": datetime.fromtimestamp(marketing_modified).strftime("%Y-%m-%d") if marketing_modified else "N/A",
                "status": "active" if marketing_data else "empty",
                "statistics": marketing_stats
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sales")
async def get_sales_data(limit: int = 10):
    """
    GET /dataset/sales?limit=10
    Returns sales data (limited to specified number of records)
    """
    try:
        sales_data = load_json_file(SALES_DATA_PATH)
        
        return {
            "ok": True,
            "total_records": len(sales_data),
            "showing": min(limit, len(sales_data)),
            "data": sales_data[:limit]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/marketing")
async def get_marketing_data(limit: int = 10):
    """
    GET /dataset/marketing?limit=10
    Returns marketing data (limited to specified number of records)
    """
    try:
        marketing_data = load_json_file(MARKETING_DATA_PATH)
        
        return {
            "ok": True,
            "total_records": len(marketing_data),
            "showing": min(limit, len(marketing_data)),
            "data": marketing_data[:limit]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/columns")
async def get_dataset_columns():
    """
    GET /dataset/columns
    Returns column information for both datasets
    """
    try:
        sales_data = load_json_file(SALES_DATA_PATH)
        marketing_data = load_json_file(MARKETING_DATA_PATH)
        
        # Extract columns from first record
        sales_columns = []
        if sales_data:
            first_record = sales_data[0]
            for key, value in first_record.items():
                if key != 'description':  # Skip description field
                    sales_columns.append({
                        "name": key.replace('_', ' ').title(),
                        "field": key,
                        "type": type(value).__name__,
                        "sample": str(value)
                    })
        
        marketing_columns = []
        if marketing_data:
            first_record = marketing_data[0]
            for key, value in first_record.items():
                if key != 'description':  # Skip description field
                    marketing_columns.append({
                        "name": key.replace('_', ' ').title(),
                        "field": key,
                        "type": type(value).__name__,
                        "sample": str(value)
                    })
        
        return {
            "ok": True,
            "sales_columns": sales_columns,
            "marketing_columns": marketing_columns
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))