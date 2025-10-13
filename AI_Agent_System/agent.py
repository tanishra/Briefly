"""
Microsoft AutoGen Multi-Agent System with RAG for report generation
"""
import autogen
from config import EURI_API_KEY
from rag_retrieval import retrieve_combined_data, retrieve_sales_data, retrieve_marketing_data


def create_autogen_config():
    """Create AutoGen LLM configuration"""
    config_list = [
        {
            "model": "gpt-4.1-mini",
            "api_key": EURI_API_KEY,
            "base_url": "https://api.euron.one/api/v1/euri"
        }
    ]
    
    llm_config = {
        "config_list": config_list,
        "temperature": 0.7,
        "timeout": 120,
        "cache_seed": None,  # Disable caching
    }
    
    return llm_config


def create_data_analyst_agent():
    """Create a Data Analyst Agent that analyzes data"""
    
    system_message = """You are a Senior Data Analyst specializing in sales and marketing analytics.

Your responsibilities:
1. Analyze sales and marketing data provided to you
2. Identify trends, patterns, and anomalies
3. Calculate key metrics and KPIs
4. Provide data-driven insights
5. Be precise and analytical in your findings

You receive context from a RAG system containing real sales and marketing data.
Base all your analysis on this retrieved context."""
    
    analyst = autogen.AssistantAgent(
        name="data_analyst",
        system_message=system_message,
        llm_config=create_autogen_config(),
    )
    
    return analyst


def create_report_writer_agent():
    """Create a Report Writer Agent that creates professional reports"""
    
    system_message = """You are a Professional Report Writer specialized in business reporting.

Your responsibilities:
1. Take analytical findings and create comprehensive reports
2. Structure reports with clear sections (Executive Summary, Key Findings, etc.)
3. Write in a professional, clear, and engaging manner
4. Provide actionable recommendations
5. Format reports properly with bullet points and sections

Create reports that executives can easily understand and act upon."""
    
    writer = autogen.AssistantAgent(
        name="report_writer",
        system_message=system_message,
        llm_config=create_autogen_config(),
    )
    
    return writer


def create_user_proxy():
    """Create a User Proxy Agent"""
    
    user_proxy = autogen.UserProxyAgent(
        name="user_proxy",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=0,
        code_execution_config=False,
        default_auto_reply="",
    )
    
    return user_proxy


def generate_report_with_autogen_multiagent(query, report_type="combined", n_results=8):
    """Generate report using multi-agent AutoGen system with RAG"""
    
    print("\n[AutoGen] Starting Multi-Agent Analysis...")
    
    # Step 1: Retrieve relevant context using RAG
    if report_type == "sales":
        context = retrieve_sales_data(query, n_results=n_results)
    elif report_type == "marketing":
        context = retrieve_marketing_data(query, n_results=n_results)
    else:
        context = retrieve_combined_data(query, n_results=n_results)
    
    # Step 2: Create agents
    analyst = create_data_analyst_agent()
    writer = create_report_writer_agent()
    user_proxy = create_user_proxy()
    
    # Step 3: First, have analyst analyze the data
    analysis_prompt = f"""Based on the following data retrieved from our database, please analyze and identify key insights:

Query: {query}

{context}

Please provide:
1. Key metrics and numbers
2. Notable trends
3. Top performers
4. Areas of concern
5. Data-driven insights"""
    
    print("[AutoGen] Agent 1 (Data Analyst) - Analyzing data...")
    
    # Analyst analyzes the data
    user_proxy.initiate_chat(
        analyst,
        message=analysis_prompt,
        max_turns=1
    )
    
    # Get analyst's findings
    analyst_findings = user_proxy.last_message(analyst)["content"]
    
    # Step 4: Have writer create comprehensive report from analyst's findings
    report_prompt = f"""Based on the data analyst's findings, create a comprehensive professional report.

Original Query: {query}

Data Analyst's Findings:
{analyst_findings}

Create a detailed report with these sections:
1. Executive Summary
2. Key Findings  
3. Detailed Analysis
4. Insights and Trends
5. Recommendations

Make it professional, clear, and actionable."""
    
    print("[AutoGen] Agent 2 (Report Writer) - Creating report...")
    
    # Writer creates the report
    user_proxy.initiate_chat(
        writer,
        message=report_prompt,
        max_turns=1
    )
    
    # Get final report
    final_report = user_proxy.last_message(writer)["content"]
    
    print("[AutoGen] Multi-Agent Report Generation Complete!\n")
    
    return final_report


def generate_report_with_rag(query, report_type="combined", n_results=5):
    """Wrapper function for backward compatibility"""
    return generate_report_with_autogen_multiagent(query, report_type, n_results)


def generate_custom_report(prompt_with_context):
    """Generate custom report with pre-formatted prompt"""
    analyst = create_data_analyst_agent()
    user_proxy = create_user_proxy()
    
    user_proxy.initiate_chat(analyst, message=prompt_with_context, max_turns=1)
    return user_proxy.last_message()["content"]


if __name__ == "__main__":
    # Test the multi-agent system
    if EURI_API_KEY:
        print("="*80)
        print("Testing Microsoft AutoGen Multi-Agent System with RAG")
        print("="*80)
        
        query = "Analyze the top performing products and their sales trends"
        report = generate_report_with_autogen_multiagent(query, report_type="sales", n_results=5)
        
        print("\n" + "="*80)
        print("FINAL REPORT:")
        print("="*80)
        print(report)
    else:
        print("Please set OPENAI_API_KEY in your .env file")
