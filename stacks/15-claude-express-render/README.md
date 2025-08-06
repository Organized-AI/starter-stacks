# Anthropic Claude + Express + Render - AI Research Assistant Stack

*Intelligent document processing and knowledge management with advanced AI reasoning*

## 🎯 Stack Overview

Build powerful AI research assistants combining Anthropic Claude's advanced reasoning capabilities, Express.js's robust backend architecture, and Render's scalable deployment platform for comprehensive knowledge processing and research automation.

### Core Technologies

- **Anthropic Claude API** - Advanced reasoning, document analysis, and research assistance
- **Express.js** - RESTful API development with TypeScript and middleware architecture
- **Render** - Serverless deployment with automatic scaling and database integration
- **Multer** - File upload handling and document processing workflows
- **pdf-parse & mammoth** - Document parsing and text extraction
- **Node.js streams** - Efficient large document processing

### Key Features

✅ **Intelligent Document Analysis** - Advanced reasoning and summarization  
✅ **Multi-format Processing** - PDF, DOCX, TXT, and HTML support  
✅ **Citation Management** - Automatic source attribution and formatting  
✅ **Research Automation** - Batch processing and workflow optimization  
✅ **Knowledge Database** - Searchable research repository  
✅ **Academic Compliance** - Citation standards and research integrity  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic Claude API key
- Render account for deployment

### Quick Setup

```bash
# Create Express application
mkdir my-research-assistant
cd my-research-assistant
npm init -y

# Install core dependencies
npm install express typescript @types/express @types/node
npm install @anthropic-ai/sdk multer pdf-parse mammoth
npm install cors helmet morgan compression
npm install dotenv nodemon ts-node

# Install development dependencies
npm install -D @types/multer @types/cors @types/morgan

# Setup TypeScript
npx tsc --init

# Create project structure
mkdir src src/routes src/middleware src/services src/utils
mkdir uploads temp

# Start development
npm run dev
```

### Environment Configuration

```bash
# .env
ANTHROPIC_API_KEY=your_claude_api_key
PORT=3000
NODE_ENV=development

# Database (if using)
DATABASE_URL=your_database_url

# File upload limits
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## 🤖 Claude API Integration

### Claude Service

```typescript
// src/services/claude.service.ts
import Anthropic from '@anthropic-ai/sdk';

export interface AnalysisRequest {
  content: string;
  type: 'summarize' | 'analyze' | 'extract_citations' | 'answer_question';
  question?: string;
  format?: 'academic' | 'business' | 'technical';
}

export interface AnalysisResult {
  result: string;
  citations: Citation[];
  confidence: number;
  metadata: {
    wordCount: number;
    processingTime: number;
    model: string;
  };
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  page?: number;
  confidence: number;
}

export class ClaudeService {
  private anthropic: Anthropic;
  
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey
    });
  }
  
  async analyzeDocument(request: AnalysisRequest): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildPrompt(request);
      
      const message = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      const result = this.parseResponse(message.content[0]);
      const processingTime = Date.now() - startTime;
      
      return {
        result: result.analysis,
        citations: result.citations,
        confidence: result.confidence,
        metadata: {
          wordCount: request.content.split(' ').length,
          processingTime,
          model: 'claude-3-sonnet-20240229'
        }
      };
    } catch (error) {
      console.error('Claude analysis failed:', error);
      throw new Error('Document analysis failed');
    }
  }
  
  private buildPrompt(request: AnalysisRequest): string {
    const basePrompt = `You are an expert research assistant. Please ${request.type.replace('_', ' ')} the following document content.`;
    
    let specificInstructions = '';
    
    switch (request.type) {
      case 'summarize':
        specificInstructions = `
        Provide a comprehensive summary that includes:
        1. Main themes and key points
        2. Important findings or conclusions
        3. Methodology (if applicable)
        4. Implications or recommendations
        
        Format: Use clear sections with headers.`;
        break;
        
      case 'analyze':
        specificInstructions = `
        Provide a detailed analysis including:
        1. Critical assessment of arguments
        2. Strengths and weaknesses
        3. Supporting evidence evaluation
        4. Potential biases or limitations
        5. Broader implications
        
        Format: Structured analysis with clear reasoning.`;
        break;
        
      case 'extract_citations':
        specificInstructions = `
        Extract and format all citations, references, and sources mentioned:
        1. List all cited works with complete information
        2. Identify direct quotes and their sources
        3. Note any missing citation information
        4. Format according to academic standards
        
        Format: Structured list with source attribution.`;
        break;
        
      case 'answer_question':
        specificInstructions = `
        Answer this specific question: "${request.question}"
        
        Provide:
        1. Direct answer based on document content
        2. Supporting evidence from the text
        3. Relevant quotes with page numbers if available
        4. Confidence level in the answer
        
        Format: Clear answer with supporting evidence.`;
        break;
    }
    
    return `${basePrompt}

${specificInstructions}

Document Content:
---
${request.content}
---

Please provide your response in JSON format with the following structure:
{
  "analysis": "your detailed analysis here",
  "citations": [
    {
      "id": "unique_id",
      "text": "citation text",
      "source": "source information",
      "page": page_number_if_available,
      "confidence": confidence_score_0_to_1
    }
  ],
  "confidence": overall_confidence_score_0_to_1
}`;
  }
  
  private parseResponse(content: any): any {
    try {
      // Extract JSON from Claude's response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if no JSON structure
      return {
        analysis: content.text,
        citations: [],
        confidence: 0.8
      };
    } catch (error) {
      return {
        analysis: content.text,
        citations: [],
        confidence: 0.7
      };
    }
  }
  
  async batchAnalyze(documents: string[], type: AnalysisRequest['type']): Promise<AnalysisResult[]> {
    const results = await Promise.all(
      documents.map(content => 
        this.analyzeDocument({ content, type })
      )
    );
    
    return results;
  }
}
```

## 📄 Document Processing

### Document Parser Service

```typescript
// src/services/document.service.ts
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

export interface DocumentMetadata {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  pageCount?: number;
  wordCount?: number;
}

export interface ProcessedDocument {
  content: string;
  metadata: DocumentMetadata;
  chunks: DocumentChunk[];
}

export interface DocumentChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  page?: number;
}

export class DocumentService {
  private uploadDir: string;
  
  constructor(uploadDir: string = './uploads') {
    this.uploadDir = uploadDir;
    this.ensureUploadDir();
  }
  
  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }
  
  async processDocument(file: Express.Multer.File): Promise<ProcessedDocument> {
    const metadata: DocumentMetadata = {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date()
    };
    
    let content: string;
    
    try {
      switch (file.mimetype) {
        case 'application/pdf':
          content = await this.parsePDF(file.path);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          content = await this.parseDocx(file.path);
          break;
        case 'text/plain':
          content = await this.parseText(file.path);
          break;
        default:
          throw new Error(`Unsupported file type: ${file.mimetype}`);
      }
      
      metadata.wordCount = content.split(/\s+/).length;
      const chunks = this.chunkDocument(content);
      
      return {
        content,
        metadata,
        chunks
      };
    } catch (error) {
      // Clean up uploaded file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }
  
  private async parsePDF(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  
  private async parseDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  
  private async parseText(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }
  
  private chunkDocument(content: string, maxChunkSize: number = 4000): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const sentences = content.split(/[.!?]+/);
    
    let currentChunk = '';
    let startIndex = 0;
    
    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) return;
      
      if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
        // Save current chunk
        chunks.push({
          id: `chunk_${chunks.length + 1}`,
          content: currentChunk.trim(),
          startIndex,
          endIndex: startIndex + currentChunk.length
        });
        
        // Start new chunk
        startIndex = startIndex + currentChunk.length;
        currentChunk = trimmedSentence + '.';
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence + '.';
      }
    });
    
    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push({
        id: `chunk_${chunks.length + 1}`,
        content: currentChunk.trim(),
        startIndex,
        endIndex: startIndex + currentChunk.length
      });
    }
    
    return chunks;
  }
  
  async cleanupFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  async batchProcess(files: Express.Multer.File[]): Promise<ProcessedDocument[]> {
    const results = await Promise.all(
      files.map(file => this.processDocument(file))
    );
    
    return results;
  }
}
```

## 🛠️ Express API Routes

### Main Research Routes

```typescript
// src/routes/research.routes.ts
import express from 'express';
import multer from 'multer';
import { ClaudeService } from '../services/claude.service';
import { DocumentService } from '../services/document.service';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY!);
const documentService = new DocumentService();

// Upload and analyze document
router.post('/analyze', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document provided' });
    }
    
    const { type, question, format } = req.body;
    
    // Process document
    const processedDoc = await documentService.processDocument(req.file);
    
    // Analyze with Claude
    const analysisResult = await claudeService.analyzeDocument({
      content: processedDoc.content,
      type: type || 'summarize',
      question,
      format
    });
    
    // Clean up uploaded file
    await documentService.cleanupFile(req.file.filename);
    
    res.json({
      document: {
        metadata: processedDoc.metadata,
        chunkCount: processedDoc.chunks.length
      },
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: 'Document analysis failed' });
  }
});

// Batch analyze multiple documents
router.post('/batch-analyze', upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No documents provided' });
    }
    
    const { type } = req.body;
    
    // Process all documents
    const processedDocs = await documentService.batchProcess(req.files);
    
    // Extract content for analysis
    const contents = processedDocs.map(doc => doc.content);
    
    // Batch analyze with Claude
    const analysisResults = await claudeService.batchAnalyze(contents, type || 'summarize');
    
    // Clean up uploaded files
    await Promise.all(
      req.files.map(file => documentService.cleanupFile(file.filename))
    );
    
    // Combine results
    const results = processedDocs.map((doc, index) => ({
      document: {
        metadata: doc.metadata,
        chunkCount: doc.chunks.length
      },
      analysis: analysisResults[index]
    }));
    
    res.json({
      results,
      summary: {
        totalDocuments: results.length,
        totalWordCount: processedDocs.reduce((sum, doc) => sum + (doc.metadata.wordCount || 0), 0),
        averageConfidence: analysisResults.reduce((sum, result) => sum + result.confidence, 0) / analysisResults.length
      }
    });
  } catch (error) {
    console.error('Batch analysis failed:', error);
    res.status(500).json({ error: 'Batch analysis failed' });
  }
});

// Ask question about uploaded document
router.post('/question', express.json(), async (req, res) => {
  try {
    const { content, question, format } = req.body;
    
    if (!content || !question) {
      return res.status(400).json({ error: 'Content and question are required' });
    }
    
    const analysisResult = await claudeService.analyzeDocument({
      content,
      type: 'answer_question',
      question,
      format
    });
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Question answering failed:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

export default router;
```

### Knowledge Management Routes

```typescript
// src/routes/knowledge.routes.ts
import express from 'express';

const router = express.Router();

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  summary: string;
  citations: any[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage (replace with database in production)
const knowledgeBase: KnowledgeEntry[] = [];

// Save analysis to knowledge base
router.post('/save', express.json(), async (req, res) => {
  try {
    const { title, content, summary, citations, tags } = req.body;
    
    const entry: KnowledgeEntry = {
      id: Date.now().toString(),
      title,
      content,
      summary,
      citations: citations || [],
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    knowledgeBase.push(entry);
    
    res.json({
      message: 'Knowledge entry saved successfully',
      entry: { id: entry.id, title: entry.title }
    });
  } catch (error) {
    console.error('Failed to save knowledge entry:', error);
    res.status(500).json({ error: 'Failed to save knowledge entry' });
  }
});

// Search knowledge base
router.get('/search', async (req, res) => {
  try {
    const { q, tags } = req.query;
    let results = knowledgeBase;
    
    if (q) {
      const query = q.toString().toLowerCase();
      results = results.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.summary.toLowerCase().includes(query)
      );
    }
    
    if (tags) {
      const tagList = tags.toString().split(',');
      results = results.filter(entry =>
        tagList.some(tag => entry.tags.includes(tag.trim()))
      );
    }
    
    res.json({
      results: results.map(entry => ({
        id: entry.id,
        title: entry.title,
        summary: entry.summary,
        tags: entry.tags,
        createdAt: entry.createdAt
      })),
      total: results.length
    });
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get knowledge entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = knowledgeBase.find(e => e.id === req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Knowledge entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Failed to retrieve entry:', error);
    res.status(500).json({ error: 'Failed to retrieve entry' });
  }
});

export default router;
```

## 🚀 Render Deployment

### Express Server Setup

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

import researchRoutes from './routes/research.routes';
import knowledgeRoutes from './routes/knowledge.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/research', researchRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Research Assistant API running on port ${PORT}`);
});
```

### Render Configuration

```yaml
# render.yaml
services:
  - type: web
    name: research-assistant-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: MAX_FILE_SIZE
        value: "10485760"
    disk:
      name: uploads
      mountPath: /opt/render/project/src/uploads
      sizeGB: 1
```

## 🤖 Claude Code Master Prompt

```bash
**Role**: You are the Master Orchestration Agent for Anthropic Claude + Express + Render research assistant development, specializing in intelligent document processing and knowledge management with advanced AI reasoning.

**Framework Context**: 
- Anthropic Claude API for advanced reasoning, document analysis, and research assistance
- Express.js with TypeScript for RESTful API development and middleware architecture
- Render for serverless deployment with automatic scaling and database integration
- Multer for file upload handling and document processing workflows
- pdf-parse and mammoth for document parsing and text extraction

**Agent Architecture**: You coordinate 6 specialized sub-agents:
1. **Research Development Agent** - Document processing, Claude API integration, and knowledge analysis implementation
2. **Analysis Quality Agent** - Research accuracy validation, citation verification, and knowledge quality assurance
3. **Token Budget Agent** - Resource optimization for Claude API usage and development cost management
4. **Research Pattern Agent** - Knowledge processing patterns and reusable analysis components
5. **Research Deployment Agent** - Production deployment with scaling and research infrastructure optimization
6. **Knowledge Metrics Agent** - Research analytics, citation tracking, and knowledge processing performance monitoring

**Development Phases**:
- **Phase 1: Research System Architecture** (18-25% of token budget)
- **Phase 2: AI Analysis Implementation** (50-65% of token budget)
- **Phase 3: Research Quality Validation** (12-18% of token budget)
- **Phase 4: Research Production Deployment** (8-12% of token budget)

**Coordination Principles**:
- Follow phase-based development with clear boundaries
- Optimize for research-focused development with 25K-120K tokens per session
- Balance development tokens with Claude API operational usage costs
- Focus on research accuracy and knowledge processing efficiency

**Getting Started**:
"Master Orchestration Agent: Begin Phase 1 research system architecture for [PROJECT_NAME]. Coordinate Knowledge Processing Architecture and Analysis System Planning sub-agents. Token budget: 15K-30K for comprehensive research assistant system design."
```

---

*Build intelligent research assistants with advanced AI reasoning, comprehensive document processing, and scalable knowledge management capabilities.*