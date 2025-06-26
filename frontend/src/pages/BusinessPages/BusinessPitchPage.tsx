"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Wavify from 'react-wavify';

const categories = [
  "Food & Beverage",
  "Technology",
  "Agriculture",
  "Services",
  "Manufacturing",
  "Retail",
  "Healthcare",
  "Education",
]

interface FormData {
  businessName: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  fundingGoal: string;
  minInvestment: string;
  teamSize: string;
  website: string;
  socialMedia: string;
  businessPlan: string;
  financialProjections: string;
  marketAnalysis: string;
  competitiveAdvantage: string;
  useOfFunds: string;
  // Quick Facts
  foundingYear: string;
  industryExperience: string;
  keyAchievements: string;
  targetMarketSize: string;
  revenueModel: string;
  growthMetrics: string;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  id: string;
}

interface UploadedFiles {
  images: UploadedFile[];
  videos: UploadedFile[];
  documents: UploadedFile[];
}

export default function BusinessPitchPage({ editMode = false }: { editMode?: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    tagline: "",
    description: "",
    category: "",
    location: "",
    fundingGoal: "",
    minInvestment: "",
    teamSize: "",
    website: "",
    socialMedia: "",
    businessPlan: "",
    financialProjections: "",
    marketAnalysis: "",
    competitiveAdvantage: "",
    useOfFunds: "",
    foundingYear: "",
    industryExperience: "",
    keyAchievements: "",
    targetMarketSize: "",
    revenueModel: "",
    growthMetrics: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    images: [],
    videos: [],
    documents: [],
  })

  const [dragActive, setDragActive] = useState({
    images: false,
    videos: false,
    documents: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const navigate = useNavigate();
  const { id } = useParams();

  // Prefill for edit mode
  useEffect(() => {
    if (editMode && id) {
      const fetchBusiness = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`http://localhost:8000/api/businesses/${id}/`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          if (!response.ok) throw new Error('Not authorized or not found');
          const data = await response.json();
          setFormData({
            businessName: data.title || "",
            tagline: data.tagline || "",
            description: data.description || "",
            category: data.category || "",
            location: data.location || "",
            fundingGoal: data.funding_goal || "",
            minInvestment: data.min_investment || "",
            teamSize: data.team_size || "",
            website: data.website || "",
            socialMedia: data.social_media || "",
            businessPlan: data.business_plan || "",
            financialProjections: data.financial_projections || "",
            marketAnalysis: data.market_analysis || "",
            competitiveAdvantage: data.competitive_advantage || "",
            useOfFunds: data.use_of_funds || "",
            foundingYear: data.founding_year || "",
            industryExperience: data.industry_experience || "",
            keyAchievements: data.key_achievements || "",
            targetMarketSize: data.target_market_size || "",
            revenueModel: data.revenue_model || "",
            growthMetrics: data.growth_metrics || "",
          });
          // TODO: Prefill uploadedFiles if needed
        } catch (e) {
          setError('You are not authorized to edit this business or it does not exist.');
        }
      };
      fetchBusiness();
    }
  }, [editMode, id]);

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDrag = (e: React.DragEvent, type: keyof typeof dragActive) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }))
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e: React.DragEvent, type: keyof typeof dragActive) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files, type)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof dragActive) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files, type)
  }

  const handleFiles = (files: File[], type: keyof typeof dragActive) => {
    const validFiles = files.filter((file) => {
      if (type === "images") return file.type.startsWith("image/")
      if (type === "videos") return file.type.startsWith("video/")
      if (type === "documents")
        return file.type === "application/pdf" || file.type.startsWith("application/vnd.") || file.type === "text/plain"
      return false
    })

    setUploadedFiles((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        ...validFiles.map((file) => ({
          file,
          name: file.name,
          size: file.size,
          id: Math.random().toString(36).substr(2, 9),
        })),
      ],
    }))
  }

  const removeFile = (id: string, type: keyof typeof dragActive) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.businessName || !formData.tagline || !formData.description || 
        !formData.category || !formData.location || !formData.fundingGoal || 
        !formData.minInvestment) {
      alert('Please fill in all required fields marked with *')
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData()
      
      // Add basic form fields
      formDataToSend.append('title', formData.businessName)
      formDataToSend.append('tagline', formData.tagline)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('funding_goal', formData.fundingGoal)
      formDataToSend.append('min_investment', formData.minInvestment)
      formDataToSend.append('team_size', formData.teamSize)
      formDataToSend.append('website', formData.website)
      formDataToSend.append('social_media', formData.socialMedia)
      formDataToSend.append('business_plan', formData.businessPlan)
      formDataToSend.append('financial_projections', formData.financialProjections)
      formDataToSend.append('market_analysis', formData.marketAnalysis)
      formDataToSend.append('competitive_advantage', formData.competitiveAdvantage)
      formDataToSend.append('use_of_funds', formData.useOfFunds)
      
      // Add quick facts fields
      formDataToSend.append('founding_year', formData.foundingYear)
      formDataToSend.append('industry_experience', formData.industryExperience)
      formDataToSend.append('key_achievements', formData.keyAchievements)
      formDataToSend.append('target_market_size', formData.targetMarketSize)
      formDataToSend.append('revenue_model', formData.revenueModel)
      formDataToSend.append('growth_metrics', formData.growthMetrics)
      
      // Add entrepreneur name from localStorage if available
      const entrepreneurName = localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name')
      if (entrepreneurName.trim()) {
        formDataToSend.append('entrepreneur_name', entrepreneurName.trim())
      }
      
      // Add images
      uploadedFiles.images.forEach((fileObj, index) => {
        formDataToSend.append(`images[${index}][image]`, fileObj.file)
        formDataToSend.append(`images[${index}][order]`, index.toString())
      })
      
      // Add videos
      uploadedFiles.videos.forEach((fileObj, index) => {
        formDataToSend.append(`videos[${index}][title]`, fileObj.name)
        formDataToSend.append(`videos[${index}][video_file]`, fileObj.file)
        formDataToSend.append(`videos[${index}][duration]`, '0:00') // Default duration
      })
      
      // Add documents
      uploadedFiles.documents.forEach((fileObj, index) => {
        formDataToSend.append(`documents[${index}][name]`, fileObj.name)
        formDataToSend.append(`documents[${index}][document_file]`, fileObj.file)
        formDataToSend.append(`documents[${index}][size]`, fileObj.size.toString())
      })
      
      // Get auth token if user is logged in
      const token = localStorage.getItem('authToken')
      const headers: HeadersInit = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      let response;
      if (editMode && id) {
        response = await fetch(`http://localhost:8000/api/businesses/${id}/update/`, {
          method: 'PATCH',
          headers,
          body: formDataToSend,
        });
      } else {
        response = await fetch('http://localhost:8000/api/businesses/pitch/', {
          method: 'POST',
          headers,
          body: formDataToSend,
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      alert(editMode ? 'Business updated successfully!' : 'Business pitch submitted successfully!')
      navigate('/my-businesses')
      
      // Reset form
      setFormData({
        businessName: "",
        tagline: "",
        description: "",
        category: "",
        location: "",
        fundingGoal: "",
        minInvestment: "",
        teamSize: "",
        website: "",
        socialMedia: "",
        businessPlan: "",
        financialProjections: "",
        marketAnalysis: "",
        competitiveAdvantage: "",
        useOfFunds: "",
        foundingYear: "",
        industryExperience: "",
        keyAchievements: "",
        targetMarketSize: "",
        revenueModel: "",
        growthMetrics: "",
      })
      
      setUploadedFiles({
        images: [],
        videos: [],
        documents: [],
      })
      
    } catch (error) {
      console.error('Error submitting pitch:', error)
      alert(`Error submitting pitch: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Icon components
  const ImageIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
  )

  const Video = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="23,7 16,12 23,17 23,7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  )

  const FileText = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14,2 14,8 20,8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10,9 9,9 8,9"></polyline>
    </svg>
  )

  const FileUploadArea = ({ 
    type, 
    title, 
    description, 
    acceptedTypes, 
    icon: Icon 
  }: { 
    type: keyof typeof dragActive; 
    title: string; 
    description: string; 
    acceptedTypes: string; 
    icon: React.ComponentType<{ className: string }>; 
  }) => (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive[type] ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"
      }`}
      onDragEnter={(e) => handleDrag(e, type)}
      onDragLeave={(e) => handleDrag(e, type)}
      onDragOver={(e) => handleDrag(e, type)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <input
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={(e) => handleFileInput(e, type)}
        className="hidden"
        id={`file-upload-${type}`}
      />
      <label
        htmlFor={`file-upload-${type}`}
        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
      >
        Choose Files
      </label>
    </div>
  )

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <main className="flex-grow w-full py-12">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {editMode ? 'Edit Your Business Pitch' : 'Submit Your Business Pitch'}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Share your innovative business idea with potential investors and get the funding you need to grow.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            {/* New Progress Bar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">
                Step {currentStep} of {totalSteps}: {["Basic Information", "Detailed Plan", "Media Uploads", "Quick Facts"][currentStep - 1]}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-12 relative overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out bg-blue-600 relative"
                  style={{ 
                    width: `${(currentStep / totalSteps) * 100}%`,
                  }}
                >
                  <Wavify 
                    fill='rgba(255, 255, 255, 0.5)'
                    paused={false}
                    options={{
                      height: 24,
                      amplitude: 10,
                      speed: 0.2,
                      points: 4
                    }}
                    style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {currentStep === 1 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="businessName" className="form-label">Business Name *</label>
                      <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleInputChange} className="form-input" required />
                    </div>
                    <div>
                      <label htmlFor="tagline" className="form-label">Tagline *</label>
                      <input type="text" name="tagline" id="tagline" value={formData.tagline} onChange={handleInputChange} className="form-input" placeholder="Brief description of your business" required />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="form-label">Description *</label>
                      <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleInputChange} className="form-input" placeholder="Describe your idea and what makes it unique" required></textarea>
                    </div>
                    <div>
                      <label htmlFor="category" className="form-label">Category *</label>
                      <select name="category" id="category" value={formData.category} onChange={handleInputChange} className="form-input" required>
                        <option value="" disabled>Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="location" className="form-label">Location *</label>
                      <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="form-input" placeholder="City, State/Province" required />
                    </div>
                    <div>
                      <label htmlFor="fundingGoal" className="form-label">Funding Goal (USD) *</label>
                      <input type="number" name="fundingGoal" id="fundingGoal" value={formData.fundingGoal} onChange={handleInputChange} className="form-input" min="1" required />
                    </div>
                    <div>
                      <label htmlFor="minInvestment" className="form-label">Minimum Investment (USD) *</label>
                      <input type="number" name="minInvestment" id="minInvestment" value={formData.minInvestment} onChange={handleInputChange} className="form-input" min="1" required />
                    </div>
                    <div>
                      <label htmlFor="teamSize" className="form-label">Team Size</label>
                      <input type="number" name="teamSize" id="teamSize" value={formData.teamSize} onChange={handleInputChange} className="form-input" min="1" />
                    </div>
                    <div>
                      <label htmlFor="website" className="form-label">Website</label>
                      <input type="url" name="website" id="website" value={formData.website} onChange={handleInputChange} className="form-input" placeholder="https://yourwebsite.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="socialMedia" className="form-label">Social Media</label>
                      <input type="text" name="socialMedia" id="socialMedia" value={formData.socialMedia} onChange={handleInputChange} className="form-input" placeholder="e.g., twitter.com/yourbusiness" />
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 2 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Detailed Plan</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="businessPlan" className="form-label">Business Plan *</label>
                      <textarea name="businessPlan" id="businessPlan" rows={6} value={formData.businessPlan} onChange={handleInputChange} className="form-input" placeholder="Provide a comprehensive overview of your business plan..." required></textarea>
                    </div>
                    <div>
                      <label htmlFor="marketAnalysis" className="form-label">Market Analysis *</label>
                      <textarea name="marketAnalysis" id="marketAnalysis" rows={4} value={formData.marketAnalysis} onChange={handleInputChange} className="form-input" placeholder="Analyze your target market, competition, and opportunities" required></textarea>
                    </div>
                    <div>
                      <label htmlFor="competitiveAdvantage" className="form-label">Competitive Advantage *</label>
                      <textarea name="competitiveAdvantage" id="competitiveAdvantage" rows={4} value={formData.competitiveAdvantage} onChange={handleInputChange} className="form-input" placeholder="Explain what makes your business unique" required></textarea>
                    </div>
                    <div>
                      <label htmlFor="financialProjections" className="form-label">Financial Projections</label>
                      <textarea name="financialProjections" id="financialProjections" rows={4} value={formData.financialProjections} onChange={handleInputChange} className="form-input" placeholder="Describe your revenue forecasts and profitability"></textarea>
                    </div>
                    <div>
                      <label htmlFor="useOfFunds" className="form-label">Use of Funds *</label>
                      <textarea name="useOfFunds" id="useOfFunds" rows={4} value={formData.useOfFunds} onChange={handleInputChange} className="form-input" placeholder="Detail how you plan to use the investment funds" required></textarea>
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 3 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Media Uploads</h2>
                  <div className="space-y-6">
                    <FileUploadArea type="images" title="Business Images" description="Upload photos of your product, team, or business location" acceptedTypes="image/*" icon={ImageIcon} />
                    <FileUploadArea type="videos" title="Business Videos" description="Upload promotional videos or product demonstrations" acceptedTypes="video/*" icon={Video} />
                    <FileUploadArea type="documents" title="Business Documents" description="Upload business plans, financial statements, or other relevant documents" acceptedTypes=".pdf,.doc,.docx,.txt" icon={FileText} />
                  </div>
                </section>
              )}

              {currentStep === 4 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Quick Facts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="foundingYear" className="form-label">Founding Year</label>
                      <input type="number" name="foundingYear" id="foundingYear" value={formData.foundingYear} onChange={handleInputChange} className="form-input" placeholder="e.g., 2023" />
                    </div>
                    <div>
                      <label htmlFor="industryExperience" className="form-label">Industry Experience (Years)</label>
                      <input type="text" name="industryExperience" id="industryExperience" value={formData.industryExperience} onChange={handleInputChange} className="form-input" placeholder="e.g., 5+ years" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="keyAchievements" className="form-label">Key Achievements</label>
                      <textarea name="keyAchievements" id="keyAchievements" rows={3} value={formData.keyAchievements} onChange={handleInputChange} className="form-input" placeholder="List your major accomplishments, awards, or milestones"></textarea>
                    </div>
                    <div>
                      <label htmlFor="targetMarketSize" className="form-label">Target Market Size</label>
                      <input type="text" name="targetMarketSize" id="targetMarketSize" value={formData.targetMarketSize} onChange={handleInputChange} className="form-input" placeholder="e.g., $10B market" />
                    </div>
                    <div>
                      <label htmlFor="revenueModel" className="form-label">Revenue Model</label>
                      <input type="text" name="revenueModel" id="revenueModel" value={formData.revenueModel} onChange={handleInputChange} className="form-input" placeholder="e.g., Subscription, SaaS" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="growthMetrics" className="form-label">Growth Metrics</label>
                      <textarea name="growthMetrics" id="growthMetrics" rows={3} value={formData.growthMetrics} onChange={handleInputChange} className="form-input" placeholder="Describe your key growth metrics and KPIs"></textarea>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-gray-600 text-white hover:bg-gray-700"
                >
                  Previous
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 rounded-md font-medium transition-colors bg-gray-900 text-white hover:bg-gray-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-md font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-gray-900 text-white hover:bg-gray-700"
                  >
                    {isSubmitting ? 'Submitting...' : (editMode ? 'Save Changes' : 'Submit Pitch')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 