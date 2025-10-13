"""
RAG (Retrieval Augmented Generation) functions for report generation
"""
from .vector_db import query_vectordb, initialize_chromadb


def retrieve_relevant_context(query, n_results=5, filter_type=None):
    """Retrieve relevant context from vector database based on query"""
    _, collection = initialize_chromadb()
    
    filter_dict = None
    if filter_type:
        filter_dict = {"type": filter_type}
    
    results = query_vectordb(collection, query, n_results=n_results, filter_dict=filter_dict)
    
    return results


def format_retrieval_results(results):
    """Format retrieval results into readable context"""
    if not results or not results.get("documents"):
        return "No relevant information found."
    
    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]
    
    formatted_context = []
    
    for i, (doc, metadata, distance) in enumerate(zip(documents, metadatas, distances)):
        context_item = {
            "rank": i + 1,
            "relevance_score": 1 - distance,  # Convert distance to similarity score
            "type": metadata.get("type", "unknown"),
            "content": doc,
            "metadata": metadata
        }
        formatted_context.append(context_item)
    
    return formatted_context


def create_context_string(formatted_context):
    """Create a formatted context string for the LLM"""
    if isinstance(formatted_context, str):
        return formatted_context
    
    context_parts = ["Retrieved relevant information:\n"]
    
    for item in formatted_context:
        context_parts.append(f"\n{item['rank']}. [{item['type'].upper()}] (Relevance: {item['relevance_score']:.2f})")
        context_parts.append(f"   {item['content']}")
        
        # Add key metadata
        metadata = item['metadata']
        if item['type'] == 'sales':
            context_parts.append(f"   Product: {metadata.get('product')}, Revenue: ${metadata.get('revenue')}, Region: {metadata.get('region')}, Quarter: {metadata.get('quarter')}")
        elif item['type'] == 'marketing':
            context_parts.append(f"   Campaign: {metadata.get('campaign_name')}, Channel: {metadata.get('channel')}, Budget: ${metadata.get('budget')}, Conversions: {metadata.get('conversions')}")
    
    return "\n".join(context_parts)


def retrieve_sales_data(query, n_results=5):
    """Retrieve sales-specific data"""
    results = retrieve_relevant_context(query, n_results=n_results, filter_type="sales")
    formatted = format_retrieval_results(results)
    return create_context_string(formatted)


def retrieve_marketing_data(query, n_results=5):
    """Retrieve marketing-specific data"""
    results = retrieve_relevant_context(query, n_results=n_results, filter_type="marketing")
    formatted = format_retrieval_results(results)
    return create_context_string(formatted)


def retrieve_combined_data(query, n_results=5):
    """Retrieve both sales and marketing data"""
    results = retrieve_relevant_context(query, n_results=n_results)
    formatted = format_retrieval_results(results)
    return create_context_string(formatted)


if __name__ == "__main__":
    # Test RAG retrieval
    print("Testing RAG retrieval...")
    query = "What are the top performing products in North America?"
    context = retrieve_combined_data(query, n_results=3)
    print(f"\nQuery: {query}")
    print(f"\nContext:\n{context}")

