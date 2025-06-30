import os
import requests
import PyPDF2
import io
import logging
from typing import List, Dict, Optional
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFExtractor:
    def __init__(self):
        self.supported_extensions = ['.pdf']
    
    def extract_text_from_url(self, url: str) -> Optional[str]:
        """
        Download PDF from URL and extract text content
        """
        try:
            logger.info(f"Downloading PDF from: {url}")
            
            # Download the PDF file
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Check if it's actually a PDF
            content_type = response.headers.get('content-type', '').lower()
            if 'pdf' not in content_type:
                logger.warning(f"URL does not point to a PDF file. Content-Type: {content_type}")
                return None
            
            # Extract text from PDF
            pdf_content = io.BytesIO(response.content)
            return self._extract_text_from_bytes(pdf_content)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to download PDF from {url}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error processing PDF from {url}: {str(e)}")
            return None
    
    def extract_text_from_file(self, file_path: str) -> Optional[str]:
        """
        Extract text from a local PDF file
        """
        try:
            if not os.path.exists(file_path):
                logger.error(f"File not found: {file_path}")
                return None
            
            if not file_path.lower().endswith('.pdf'):
                logger.warning(f"File is not a PDF: {file_path}")
                return None
            
            with open(file_path, 'rb') as file:
                return self._extract_text_from_bytes(file)
                
        except Exception as e:
            logger.error(f"Error processing PDF file {file_path}: {str(e)}")
            return None
    
    def _extract_text_from_bytes(self, pdf_bytes: io.BytesIO) -> Optional[str]:
        """
        Extract text from PDF bytes using PyPDF2
        """
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_bytes)
            text_content = []
            
            for page_num, page in enumerate(pdf_reader.pages):
                try:
                    page_text = page.extract_text()
                    if page_text.strip():
                        text_content.append(f"--- Page {page_num + 1} ---\n{page_text}")
                except Exception as e:
                    logger.warning(f"Failed to extract text from page {page_num + 1}: {str(e)}")
                    continue
            
            if not text_content:
                logger.warning("No text content extracted from PDF")
                return None
            
            return "\n\n".join(text_content)
            
        except Exception as e:
            logger.error(f"Error reading PDF: {str(e)}")
            return None
    
    def process_business_documents(self, documents: List[Dict]) -> Dict[str, str]:
        """
        Process multiple documents and return a dictionary of document names and their extracted text
        """
        extracted_documents = {}
        
        for doc in documents:
            try:
                doc_name = doc.get('name', 'Unknown Document')
                doc_url = doc.get('file_url', '')
                
                if not doc_url:
                    logger.warning(f"No file URL provided for document: {doc_name}")
                    continue
                
                # Check if it's a PDF
                if not doc_url.lower().endswith('.pdf'):
                    logger.info(f"Skipping non-PDF document: {doc_name} ({doc_url})")
                    continue
                
                logger.info(f"Processing document: {doc_name}")
                extracted_text = self.extract_text_from_url(doc_url)
                
                if extracted_text:
                    # Clean and truncate text if too long (to avoid token limits)
                    cleaned_text = self._clean_text(extracted_text)
                    extracted_documents[doc_name] = cleaned_text
                    logger.info(f"Successfully extracted text from: {doc_name} ({len(cleaned_text)} characters)")
                else:
                    logger.warning(f"Failed to extract text from: {doc_name}")
                    
            except Exception as e:
                logger.error(f"Error processing document {doc.get('name', 'Unknown')}: {str(e)}")
                continue
        
        return extracted_documents
    
    def _clean_text(self, text: str, max_length: int = 50000) -> str:
        """
        Clean and truncate extracted text
        """
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove common PDF artifacts
        text = text.replace('\x00', '')  # Remove null bytes
        text = text.replace('\r', '\n')  # Normalize line endings
        
        # Truncate if too long
        if len(text) > max_length:
            text = text[:max_length] + "\n\n[Document truncated due to length]"
        
        return text
    
    def get_document_summary(self, documents: List[Dict]) -> str:
        """
        Create a summary of available documents for the AI context
        """
        if not documents:
            return "No documents available for this business."
        
        summary_parts = ["Available Documents:"]
        
        for doc in documents:
            doc_name = doc.get('name', 'Unknown Document')
            doc_size = doc.get('size', 'Unknown size')
            doc_url = doc.get('file_url', '')
            
            if doc_url.lower().endswith('.pdf'):
                summary_parts.append(f"• {doc_name} (PDF, {doc_size})")
            else:
                summary_parts.append(f"• {doc_name} ({doc_size}) - [Not a PDF, content not available]")
        
        return "\n".join(summary_parts)

# Example usage and testing
if __name__ == "__main__":
    extractor = PDFExtractor()
    
    # Test with a sample document
    test_documents = [
        {
            "name": "Business Plan",
            "file_url": "http://localhost:8000/media/business_documents/Lecture_13.pdf",
            "size": "1.2 MB"
        }
    ]
    
    print("Testing PDF extraction...")
    extracted = extractor.process_business_documents(test_documents)
    
    for doc_name, content in extracted.items():
        print(f"\n=== {doc_name} ===")
        print(f"Content length: {len(content)} characters")
        print(f"Preview: {content[:200]}...") 