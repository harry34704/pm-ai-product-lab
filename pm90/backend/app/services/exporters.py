import io
from typing import Dict

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def build_markdown_export(title: str, content: str, metadata: Dict) -> str:
    metadata_lines = "\n".join(f"- **{key}**: {value}" for key, value in metadata.items()) if metadata else ""
    return f"# {title}\n\n{metadata_lines}\n\n{content}".strip() + "\n"


def build_notion_export(title: str, content: str, metadata: Dict) -> str:
    metadata_lines = "\n".join(f"- {key}: {value}" for key, value in metadata.items()) if metadata else ""
    return f"{title}\n\nProperties\n{metadata_lines}\n\nBody\n{content}".strip() + "\n"


def build_pdf_export(title: str, content: str, metadata: Dict) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y_position = height - 50

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(48, y_position, title)
    y_position -= 26

    pdf.setFont("Helvetica", 10)
    for key, value in metadata.items():
        pdf.drawString(48, y_position, f"{key}: {value}")
        y_position -= 16

    y_position -= 10
    for raw_line in content.splitlines():
        line = raw_line.strip() or " "
        if y_position < 50:
            pdf.showPage()
            pdf.setFont("Helvetica", 10)
            y_position = height - 50
        pdf.drawString(48, y_position, line[:105])
        y_position -= 14

    pdf.save()
    buffer.seek(0)
    return buffer.read()
