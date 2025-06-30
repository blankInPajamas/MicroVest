from django.core.management.base import BaseCommand
from investments.models import Business, BusinessDocument
from django.contrib.auth import get_user_model
import os
from django.conf import settings
from django.core.files import File

User = get_user_model()

class Command(BaseCommand):
    help = 'Add a test PDF document to a business for AI chat testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--business-id',
            type=int,
            help='ID of the business to add document to',
        )
        parser.add_argument(
            '--document-path',
            type=str,
            help='Path to the PDF document to add',
        )

    def handle(self, *args, **options):
        business_id = options['business_id']
        document_path = options['document_path']

        try:
            # Get the business
            business = Business.objects.get(id=business_id)
            self.stdout.write(f"Found business: {business.title}")

            # Check if document path exists
            if not os.path.exists(document_path):
                self.stdout.write(
                    self.style.ERROR(f"Document path does not exist: {document_path}")
                )
                return

            # Check if it's a PDF
            if not document_path.lower().endswith('.pdf'):
                self.stdout.write(
                    self.style.ERROR("Document must be a PDF file")
                )
                return

            # Create document name from filename
            document_name = os.path.basename(document_path).replace('.pdf', '').replace('_', ' ').title()

            # Check if document already exists
            existing_doc = BusinessDocument.objects.filter(
                business=business,
                name=document_name
            ).first()

            if existing_doc:
                self.stdout.write(
                    self.style.WARNING(f"Document '{document_name}' already exists for this business")
                )
                return

            # Create the document with proper file handling
            with open(document_path, 'rb') as f:
                django_file = File(f, name=os.path.basename(document_path))
                document = BusinessDocument.objects.create(
                    business=business,
                    name=document_name,
                    document_file=django_file,
                    size=f"{os.path.getsize(document_path) / 1024 / 1024:.1f} MB"
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully added document '{document_name}' to business '{business.title}'"
                )
            )

        except Business.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"Business with ID {business_id} does not exist")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error adding document: {str(e)}")
            ) 