"""
Report generation functions for sales and marketing analysis
"""
from AI_Agent_System.agent import generate_report_with_rag, generate_custom_report
from AI_Agent_System.rag_retrieval import retrieve_combined_data
import json
from datetime import datetime


def generate_sales_performance_report(region=None, quarter=None):
    """Generate a sales performance report"""
    query_parts = ["Analyze sales performance"]
    
    if region:
        query_parts.append(f"in {region}")
    if quarter:
        query_parts.append(f"for {quarter}")
    
    query = " ".join(query_parts)
    
    print(f"Generating sales performance report...")
    print(f"Query: {query}\n")
    
    report = generate_report_with_rag(query, report_type="sales", n_results=8)
    return report


def generate_marketing_campaign_report(channel=None, quarter=None):
    """Generate a marketing campaign analysis report"""
    query_parts = ["Analyze marketing campaign performance"]
    
    if channel:
        query_parts.append(f"for {channel} channel")
    if quarter:
        query_parts.append(f"in {quarter}")
    
    query = " ".join(query_parts)
    
    print(f"Generating marketing campaign report...")
    print(f"Query: {query}\n")
    
    report = generate_report_with_rag(query, report_type="marketing", n_results=8)
    return report


def generate_quarterly_summary_report(quarter):
    """Generate a comprehensive quarterly summary report"""
    query = f"Provide a comprehensive summary of sales and marketing performance for {quarter}"
    
    print(f"Generating quarterly summary report for {quarter}...")
    print(f"Query: {query}\n")
    
    report = generate_report_with_rag(query, report_type="combined", n_results=10)
    return report


def generate_product_analysis_report(product_name):
    """Generate a product-specific analysis report"""
    query = f"Analyze the performance and marketing of {product_name}"
    
    print(f"Generating product analysis report for {product_name}...")
    print(f"Query: {query}\n")
    
    report = generate_report_with_rag(query, report_type="combined", n_results=8)
    return report


def generate_regional_analysis_report(region):
    """Generate a regional analysis report"""
    query = f"Analyze sales and marketing performance in {region}"
    
    print(f"Generating regional analysis report for {region}...")
    print(f"Query: {query}\n")
    
    report = generate_report_with_rag(query, report_type="combined", n_results=8)
    return report


def generate_custom_analysis_report(custom_query):
    """Generate a custom analysis report based on user query"""
    print(f"Generating custom analysis report...")
    print(f"Query: {custom_query}\n")
    
    report = generate_report_with_rag(custom_query, report_type="combined", n_results=8)
    return report


def save_report_to_file(report, filename=None):
    """Save generated report to a text file"""
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"report_{timestamp}.txt"
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"\nReport saved to: {filename}")
    return filename


def get_available_report_types():
    """Return available report types"""
    return {
        "sales_performance": "Sales performance analysis by region/quarter",
        "marketing_campaign": "Marketing campaign performance analysis",
        "quarterly_summary": "Comprehensive quarterly summary",
        "product_analysis": "Product-specific performance analysis",
        "regional_analysis": "Regional sales and marketing analysis",
        "custom": "Custom analysis based on your query"
    }


if __name__ == "__main__":
    # Example usage
    print("Available report types:")
    report_types = get_available_report_types()
    for key, description in report_types.items():
        print(f"  - {key}: {description}")
    
    print("\n" + "="*80 + "\n")
    
    # Generate a sample report
    report = generate_sales_performance_report(region="North America", quarter="Q1 2024")
    print("\n" + "="*80 + "\n")
    print(report)

