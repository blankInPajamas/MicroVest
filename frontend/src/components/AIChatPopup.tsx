import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, TrendingUp, DollarSign, Target, Users, Lightbulb, BarChart3, Shield, Zap, FileText } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface BusinessData {
  id: number;
  title: string;
  description: string;
  category: string;
  funding_goal: number;
  current_funding: number;
  backers: number;
  min_investment: number;
  team_size: number;
  founding_year: number;
  location: string;
  entrepreneur_name?: string;
  entrepreneur_full_name?: string;
  business_plan?: string;
  financial_projections?: string;
  market_analysis?: string;
  competitive_advantage?: string;
  use_of_funds?: string;
  industry_experience?: string;
  key_achievements?: string;
  target_market_size?: string;
  revenue_model?: string;
  growth_metrics?: string;
  deadline: string;
  documents?: Array<{ name: string; file_url: string; size: string }>;
}

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  businessData?: BusinessData;
}

interface DocumentContent {
  [key: string]: string;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: <BarChart3 className="h-4 w-4" />,
    text: "What's the business model and revenue strategy?",
    category: "Business Model"
  },
  {
    icon: <Target className="h-4 w-4" />,
    text: "What's the market opportunity and competition?",
    category: "Market Analysis"
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "What are the growth projections and metrics?",
    category: "Growth"
  },
  {
    icon: <Shield className="h-4 w-4" />,
    text: "What are the key risks and challenges?",
    category: "Risk Assessment"
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    text: "How will the funds be used and what's the ROI potential?",
    category: "Financial"
  },
  {
    icon: <Users className="h-4 w-4" />,
    text: "Tell me about the team and their experience",
    category: "Team"
  },
  {
    icon: <FileText className="h-4 w-4" />,
    text: "What information is available in the business documents?",
    category: "Documents"
  }
];

export default function AIChatPopup({ isOpen, onClose, businessData }: AIChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiServiceStatus, setAiServiceStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [documentContent, setDocumentContent] = useState<DocumentContent>({});
  const [documentSummary, setDocumentSummary] = useState<string>('');
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check AI service status when component mounts
  useEffect(() => {
    const checkAiService = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setAiServiceStatus('available');
        } else {
          setAiServiceStatus('unavailable');
        }
      } catch (error) {
        setAiServiceStatus('unavailable');
      }
    };

    if (isOpen) {
      checkAiService();
    }
  }, [isOpen]);

  // Fetch document content when business data is available
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!businessData?.id) return;
      
      setIsLoadingDocuments(true);
      try {
        const response = await fetch(`http://localhost:8000/api/businesses/${businessData.id}/documents/extract/`);
        if (response.ok) {
          const data = await response.json();
          setDocumentContent(data.documents || {});
          setDocumentSummary(data.summary || 'No documents available.');
        } else {
          console.error('Failed to fetch documents');
          setDocumentSummary('Unable to load documents.');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocumentSummary('Error loading documents.');
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    if (isOpen && businessData) {
      fetchDocuments();
    }
  }, [isOpen, businessData]);

  useEffect(() => {
    if (isOpen && businessData) {
      // Add initial AI message as business investment assistant
      const progressPercentage = Math.round((businessData.current_funding / businessData.funding_goal) * 100);
      const daysLeft = Math.ceil((new Date(businessData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      const initialMessage: Message = {
        id: '1',
        content: `Hello! I'm ${businessData.entrepreneur_name || businessData.entrepreneur_full_name || 'the business team'}'s investment assistant. I'm here to help you understand "${businessData.title}" and make an informed investment decision.

📊 **Investment Overview:**
• Funding Goal: $${businessData.funding_goal.toLocaleString()}
• Currently Raised: $${businessData.current_funding.toLocaleString()} (${progressPercentage}%)
• Backers: ${businessData.backers}
• Minimum Investment: $${businessData.min_investment.toLocaleString()}
• Days Left: ${daysLeft > 0 ? daysLeft : 0}

I can help you with:
• Business model analysis
• Financial projections review
• Market opportunity assessment
• Risk evaluation
• Investment strategy advice
• Document analysis (if available)

${isLoadingDocuments ? '📄 Loading business documents...' : ''}

What would you like to know about this investment opportunity?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    } else if (!isOpen) {
      setMessages([]);
      setInputMessage('');
    }
  }, [isOpen, businessData, isLoadingDocuments]);

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare comprehensive business context for the AI
      const progressPercentage = Math.round((businessData!.current_funding / businessData!.funding_goal) * 100);
      const daysLeft = Math.ceil((new Date(businessData!.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      // Prepare document content for AI
      let documentContext = '';
      if (Object.keys(documentContent).length > 0) {
        documentContext = "\n\nBUSINESS DOCUMENTS:\n" + documentSummary + "\n\n"
        for (const [docName, content] of Object.entries(documentContent)) {
          documentContext += `=== ${docName} ===\n${content}\n\n`
        }
      } else {
        documentContext = "\n\nBUSINESS DOCUMENTS:\nNo documents available for this business.\n\n"
      }
      
      const businessContext = `
You are an investment assistant for "${businessData!.title}". Act as a professional, friendly business representative helping potential investors make informed decisions. Stay focused on investment-related topics and business analysis.

BUSINESS DETAILS:
- Business Name: ${businessData!.title}
- Category: ${businessData!.category}
- Description: ${businessData!.description}
- Entrepreneur: ${businessData!.entrepreneur_name || businessData!.entrepreneur_full_name || 'Not specified'}
- Founded: ${businessData!.founding_year}
- Location: ${businessData!.location}
- Team Size: ${businessData!.team_size} members

INVESTMENT DETAILS:
- Funding Goal: $${businessData!.funding_goal.toLocaleString()}
- Current Funding: $${businessData!.current_funding.toLocaleString()} (${progressPercentage}%)
- Backers: ${businessData!.backers}
- Minimum Investment: $${businessData!.min_investment.toLocaleString()}
- Days Left: ${daysLeft > 0 ? daysLeft : 0}

BUSINESS ANALYSIS:
- Business Plan: ${businessData!.business_plan || 'Not provided'}
- Financial Projections: ${businessData!.financial_projections || 'Not provided'}
- Market Analysis: ${businessData!.market_analysis || 'Not provided'}
- Competitive Advantage: ${businessData!.competitive_advantage || 'Not provided'}
- Use of Funds: ${businessData!.use_of_funds || 'Not provided'}
- Industry Experience: ${businessData!.industry_experience || 'Not provided'}
- Key Achievements: ${businessData!.key_achievements || 'Not provided'}
- Target Market Size: ${businessData!.target_market_size || 'Not provided'}
- Revenue Model: ${businessData!.revenue_model || 'Not provided'}
- Growth Metrics: ${businessData!.growth_metrics || 'Not provided'}

${documentContext}

INSTRUCTIONS:
1. Act as a professional investment assistant representing this business
2. Help investors understand the business model, risks, and opportunities
3. Provide investment advice based on the business data and documents
4. If the user asks about unrelated topics, politely redirect them back to investment discussion
5. Be friendly but professional and knowledgeable
6. Use emojis sparingly to maintain professionalism
7. Focus on helping them make an informed investment decision
8. Provide specific, actionable insights based on the business data and documents
9. When discussing risks, also mention mitigation strategies
10. Always consider the investor's perspective and provide balanced analysis
11. If the user asks about specific documents, reference the content from the documents provided
12. If no documents are available, mention this limitation but still provide analysis based on other business data

User Question: ${inputMessage}

Please respond as the business investment assistant, helping the user understand this investment opportunity and make a decision. Provide specific insights based on the business data and documents provided.
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2:1b',
          prompt: businessContext,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I apologize, but I couldn\'t generate a response at the moment. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again in a moment, or feel free to ask me about the investment opportunity when the connection is restored.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[800px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Investment Assistant</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-blue-100">
                  {businessData ? `Helping you evaluate ${businessData.title}` : 'Business Analysis'}
                </p>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    aiServiceStatus === 'available' ? 'bg-green-400' : 
                    aiServiceStatus === 'unavailable' ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-xs text-blue-100">
                    {aiServiceStatus === 'available' ? 'AI Ready' : 
                     aiServiceStatus === 'unavailable' ? 'AI Offline' : 'Checking...'}
                  </span>
                </div>
                {Object.keys(documentContent).length > 0 && (
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">
                      {Object.keys(documentContent).length} doc{Object.keys(documentContent).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        {businessData && (
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Goal: ${businessData.funding_goal.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">Raised: ${businessData.current_funding.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-600">{businessData.backers} backers</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-gray-600">Min Investment: ${businessData.min_investment.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-3">💡 Suggested questions to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question.text)}
                  className="flex items-center space-x-2 p-2 text-left bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm"
                >
                  {question.icon}
                  <span className="text-gray-700">{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'ai' && (
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Analyzing investment opportunity...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the business model, financial projections, market analysis, or investment advice..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • I'm here to help you make an informed investment decision
          </p>
        </div>
      </div>
    </div>
  );
} 