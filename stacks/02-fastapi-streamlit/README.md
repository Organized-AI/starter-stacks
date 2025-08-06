# Option 2: FastAPI + Streamlit

🐍 **Python AI Powerhouse** - Maximum AI flexibility with rapid UI development.

## What You Get

- **Frontend**: Streamlit for rapid AI tool UIs OR React for custom interfaces
- **Backend**: FastAPI with async support
- **AI Integration**: LangChain, Hugging Face, local models with Ollama
- **Database**: PostgreSQL + pgvector for embeddings
- **Tools**: Jupyter notebooks for experimentation

## Features

✅ **Python-first** - Access to entire AI ecosystem  
✅ **Streamlit magic** - Build UIs with just Python  
✅ **Custom model support** - Fine-tuned and local models  
✅ **Data processing** - Pandas, NumPy, scikit-learn built-in  
✅ **Research friendly** - Jupyter notebooks included  

## Quick Start

1. **Clone this template**
   ```bash
   git clone <repo> my-ai-tool
   cd my-ai-tool/02-fastapi-streamlit
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

4. **Run Streamlit app**
   ```bash
   streamlit run app.py
   ```

5. **Run FastAPI backend (separate terminal)**
   ```bash
   uvicorn api.main:app --reload
   ```

## Project Structure

```
02-fastapi-streamlit/
├── app.py                        # Main Streamlit app
├── api/
│   ├── main.py                   # FastAPI application
│   ├── models/                   # AI model integrations
│   ├── routers/                  # API route handlers
│   └── database.py               # Database connections
├── components/
│   ├── chat.py                   # Chat interface component
│   ├── data_viz.py               # Data visualization components
│   └── ai_tools.py               # AI tool components
├── notebooks/
│   ├── data_exploration.ipynb    # Data analysis
│   └── model_training.ipynb      # Model fine-tuning
├── requirements.txt              # Python dependencies
├── docker-compose.yml            # PostgreSQL + pgvector
└── README.md
```

## Example Streamlit AI Tool

```python
import streamlit as st
import openai
import pandas as pd
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

st.title("🤖 AI Content Analyzer")

# Sidebar for configuration
st.sidebar.title("Configuration")
api_key = st.sidebar.text_input("OpenAI API Key", type="password")
model_choice = st.sidebar.selectbox("Model", ["gpt-4", "gpt-3.5-turbo"])

if api_key:
    # Initialize AI
    llm = OpenAI(openai_api_key=api_key, model_name=model_choice)
    
    # Main interface
    uploaded_file = st.file_uploader("Upload a CSV file", type="csv")
    
    if uploaded_file:
        # Load and display data
        df = pd.read_csv(uploaded_file)
        st.subheader("Data Preview")
        st.dataframe(df.head())
        
        # AI Analysis
        if st.button("Analyze with AI"):
            with st.spinner("Analyzing..."):
                # Create analysis prompt
                prompt = PromptTemplate(
                    input_variables=["data_summary"],
                    template="Analyze this data and provide insights: {data_summary}"
                )
                
                chain = LLMChain(llm=llm, prompt=prompt)
                
                # Get data summary
                data_summary = df.describe().to_string()
                
                # Generate analysis
                analysis = chain.run(data_summary=data_summary)
                
                st.subheader("AI Analysis")
                st.write(analysis)
                
        # Chat interface
        st.subheader("Chat with your data")
        user_question = st.text_input("Ask a question about your data:")
        
        if user_question:
            # Process question with context
            context = f"Data columns: {list(df.columns)}\nData shape: {df.shape}"
            response = llm(f"Context: {context}\nQuestion: {user_question}")
            st.write("**Answer:**", response)
```

## FastAPI Backend Example

```python
# api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
from langchain.llms import OpenAI
import asyncio

app = FastAPI(title="AI Tool API")

class ChatMessage(BaseModel):
    message: str
    model: str = "gpt-3.5-turbo"

class AnalysisRequest(BaseModel):
    data: str
    analysis_type: str

@app.post("/chat")
async def chat_endpoint(chat: ChatMessage):
    try:
        llm = OpenAI(model_name=chat.model)
        response = await asyncio.to_thread(llm, chat.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_data(request: AnalysisRequest):
    try:
        llm = OpenAI()
        prompt = f"Perform {request.analysis_type} analysis on: {request.data}"
        analysis = await asyncio.to_thread(llm, prompt)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Best For

- 🔬 **Data scientists** and researchers
- 📊 **Data-heavy AI tools** and analytics
- 🎯 **Custom model integration** and fine-tuning
- 🧪 **Experimentation** and prototyping
- 🐍 **Python-first teams** and workflows

## Advanced Features

### Vector Database Integration
```python
# Database setup with pgvector
import psycopg2
from pgvector.psycopg2 import register_vector

conn = psycopg2.connect(database="ai_tool_db")
register_vector(conn)

# Store embeddings
cur = conn.cursor()
cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
cur.execute("CREATE TABLE IF NOT EXISTS embeddings (id serial PRIMARY KEY, content text, embedding vector(1536))")
```

### LangChain Integration
```python
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

# Create knowledge base
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(documents, embeddings)

# Build QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)
```

## Deployment Options

### Docker Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  streamlit:
    build: .
    ports:
      - "8501:8501"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
  
  api:
    build: ./api
    ports:
      - "8000:8000"
    
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: ai_tool_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

### Production Scaling
- **Frontend**: Deploy Streamlit to Streamlit Cloud or AWS ECS
- **Backend**: FastAPI on AWS Lambda or Google Cloud Run
- **Database**: Managed PostgreSQL with vector extensions

Start building your Python AI tool! 🐍✨

## 🤖 Claude Code Master Prompt

Use this foundation for every Claude Code session when building with this stack:

```bash
# Use this foundation for every Claude Code session

**Role**: You are the Master Orchestration Agent for data-driven application development using FastAPI for high-performance APIs and Streamlit for interactive data interfaces. You coordinate specialized sub-agents to deliver production-grade data applications.

**Framework Context**: 
- FastAPI backend with async/await patterns and automatic API documentation
- Streamlit frontend for rapid data visualization and user interfaces
- Pydantic models for data validation and serialization
- SQLAlchemy for database operations and ORM
- Python ecosystem for data processing and machine learning

**Agent Architecture**: You manage 6 specialized sub-agents for data-centric development:
1. **Development Workflow Agent** - API design, data processing, and interface creation
2. **Testing & Verification Agent** - API testing, data validation, and performance optimization
3. **Token Budget Agent** - Resource optimization for complex data processing workflows
4. **Pattern & Solution Agent** - Reusable data patterns and API architectures
5. **Deployment Agent** - Production deployment with scaling and monitoring
6. **Success Metrics Agent** - Performance monitoring and data pipeline analytics

**Coordination Principles**:
- Design API-first architecture with comprehensive documentation
- Optimize for data processing performance and scalability
- Implement comprehensive testing for data pipelines
- Focus on user experience in data visualization
- Ensure production reliability for data-driven applications
```

Copy this prompt into Claude Code to activate the full agent orchestration system for FastAPI + Streamlit development!
