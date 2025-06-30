# MicroVest - AI-Powered Investment Platform

A comprehensive investment platform that connects entrepreneurs with investors, featuring an AI-powered investment assistant that can analyze business documents and provide investment advice.

## 🚀 Features

### Core Platform
- **Business Management**: Entrepreneurs can create and manage business listings
- **Investment Tracking**: Real-time investment tracking and analytics
- **User Management**: Separate interfaces for entrepreneurs and investors
- **Document Management**: Upload and manage business documents (PDFs)
- **Messaging System**: Direct communication between investors and entrepreneurs

### 🤖 AI Investment Assistant
- **Intelligent Analysis**: AI-powered investment analysis using local LLM (Llama 3.2 1B)
- **Document Integration**: Automatically extracts and analyzes PDF documents
- **Investment Guidance**: Professional investment advice with business context
- **Real-time Chat**: Interactive chat interface for investment questions
- **Business Context**: AI understands complete business model and financial data

## 🛠️ Technology Stack

### Backend
- **Django 4.2.13**: Python web framework
- **Django REST Framework**: API development
- **SQLite**: Database (can be configured for PostgreSQL/MySQL)
- **PyPDF2**: PDF text extraction for AI analysis

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons

### AI/ML
- **Ollama**: Local LLM server
- **Llama 3.2 1B**: Lightweight but powerful language model
- **Custom PDF Extractor**: Intelligent document analysis

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Ollama (for AI functionality)
- Git

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MicroVest
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirement.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### 4. AI Server Setup
```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai/download

# Pull the required model
ollama pull llama3.2:1b

# Start AI server (in a new terminal)
./start_ai_server.sh
```

## 🎯 Usage

### For Entrepreneurs
1. **Register/Login**: Create an entrepreneur account
2. **Create Business**: Add your business with detailed information
3. **Upload Documents**: Add PDF documents (business plans, financial projections, etc.)
4. **Manage Campaign**: Track funding progress and investor engagement

### For Investors
1. **Register/Login**: Create an investor account
2. **Browse Businesses**: Explore investment opportunities
3. **AI Analysis**: Use the AI chat to analyze businesses and documents
4. **Make Investments**: Invest in promising businesses
5. **Track Portfolio**: Monitor your investments

### 🤖 Using the AI Investment Assistant

#### Accessing AI Chat
1. Navigate to any business details page
2. Click the **"Talk with AI"** button in the Actions section
3. The AI will open with comprehensive business context

#### AI Capabilities
- **Business Model Analysis**: Understand revenue streams and business strategy
- **Financial Projections**: Analyze funding goals, current progress, and ROI potential
- **Market Analysis**: Evaluate market opportunity and competitive landscape
- **Risk Assessment**: Identify potential risks and mitigation strategies
- **Document Analysis**: Extract insights from uploaded PDF documents
- **Investment Advice**: Get personalized investment recommendations

#### Suggested Questions
The AI provides suggested questions to get started:
- "What's the business model and revenue strategy?"
- "What's the market opportunity and competition?"
- "What are the growth projections and metrics?"
- "What are the key risks and challenges?"
- "How will the funds be used and what's the ROI potential?"
- "Tell me about the team and their experience"
- "What information is available in the business documents?"

#### Document Integration
- **Automatic Extraction**: PDF documents are automatically processed
- **Context-Aware**: AI references document content in responses
- **Multi-Document Support**: Handles multiple documents per business
- **Smart Summaries**: Provides document summaries and key insights

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### AI Model Configuration
The AI uses Llama 3.2 1B by default. To use a different model:
1. Pull the desired model: `ollama pull <model-name>`
2. Update the model name in `frontend/src/components/AIChatPopup.tsx`

## 📁 Project Structure

```
MicroVest/
├── backend/                 # Django backend
│   ├── investments/        # Business and investment management
│   ├── users/             # User management
│   ├── messaging/         # Communication system
│   ├── notifications/     # Notification system
│   ├── logs/             # Business logs and updates
│   ├── entrepreneurs/    # Entrepreneur-specific features
│   ├── investors/        # Investor-specific features
│   └── pdf_extractor.py  # PDF text extraction for AI
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
└── start_ai_server.sh    # AI server startup script
```

## 🔍 API Endpoints

### Business Management
- `GET /api/businesses/` - List all businesses
- `GET /api/businesses/{id}/` - Get business details
- `POST /api/businesses/create/` - Create new business
- `PUT /api/businesses/{id}/update/` - Update business

### Investment
- `POST /api/invest/` - Make investment
- `GET /api/my-investments/` - Get user investments

### AI and Documents
- `GET /api/businesses/{id}/documents/extract/` - Extract document text for AI

### User Management
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/profile/` - Get user profile

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### AI Functionality Test
```bash
# Test AI response
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.2:1b", "prompt": "Hello", "stream": false}'
```

## 🚀 Deployment

### Production Setup
1. **Backend**: Deploy Django with Gunicorn
2. **Frontend**: Build and serve with Nginx
3. **AI Server**: Deploy Ollama on a separate server
4. **Database**: Use PostgreSQL for production

### Environment Variables
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:password@localhost/microvest
ALLOWED_HOSTS=your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Advanced AI Models**: Integration with larger, more sophisticated models
- **Real-time Analytics**: Live investment tracking and analytics
- **Mobile App**: Native mobile applications
- **Blockchain Integration**: Smart contracts for investments
- **Advanced Document Analysis**: Support for more document types
- **Predictive Analytics**: AI-powered investment predictions