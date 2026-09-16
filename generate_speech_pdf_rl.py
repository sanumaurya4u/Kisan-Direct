from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

speech_text = """
Kisan Direct: Smart India Hackathon 2026 Presentation Speech

Estimated Time: 5 Minutes
Team Name: Team Allied

[Slide 1: Title Page]
Good morning respected judges and everyone present. We are Team Allied. Today, we are proud to present our solution for the Smart India Hackathon 2026. We are tackling the problem statement: "Multiple intermediaries reduce farmers' earnings and increase consumer prices." To solve this, we have built our platform, "Kisan Direct".

[Slide 2: Proposed Solution & Innovation]
The core problem in our agriculture supply chain is the presence of opaque, unnecessary layers of middlemen. 
Kisan Direct is an AI-assisted digital agricultural marketplace that connects farmers and Farmer Producer Organizations (FPOs) directly with verified retailers, restaurants, and institutional buyers. 

Our workflow is simple: A farmer lists their crop, our AI matches them with the right buyer, calculates a fair price, handles logistics, and ensures smooth delivery and payment.

What makes us truly unique is our "Explainable Match Score". We don't just use a black-box AI. Every buyer recommendation comes with reasons and warnings. For example, our AI understands that a nearer buyer with a fair offer is often better than a distant buyer with a higher price, because logistics costs will eat up the profits. The farmer remains in full control. The AI recommends and explains, but the farmer always makes the final decision.

[Slide 3: Technical Approach]
To make this a reality, we have built a robust and modern technical platform. 
Our frontend is built using React 18 and Tailwind CSS for a seamless user experience. 
Our backend is powered by Python FastAPI and a PostgreSQL database with geographic support. 
For our AI and Machine Learning models, we utilize Pandas and scikit-learn for demand forecasting and price intelligence. Everything is secured with role-based access and deployed smoothly using Docker.

[Slide 4: Feasibility and Viability]
We understand that building a nationwide platform on day one is challenging. That is why our market strategy is highly feasible. 
We will initially start with 1 to 3 FPO clusters and a few anchor buyers. This allows us to ensure operational feasibility before scaling up. Our core MVP already works on mature technologies, and our AI services are modular, meaning we can upgrade them easily without breaking the system.

[Slide 5: Impact and Benefits]
The impact of Kisan Direct is far-reaching. 
Socially, we are strengthening the farmer's agency, providing them with clear information on prices and delivery, and supporting women-led Self-Help Groups. 
Economically, farmers finally get to compare feasible offers transparently instead of being forced to sell to a single local middleman, increasing their net realization. 
Environmentally, by matching supply with local demand and providing route estimates, we significantly reduce failed deliveries, unnecessary travel, and food spoilage.

[Slide 6: Research and Conclusion]
Our solution is strongly backed by sector research, including data from the eNAM directory, FAO studies on reducing post-harvest losses, and ONDC's work on digital market access.

To conclude, Kisan Direct is not just an app; it is a transparent, farmer-controlled ecosystem that eliminates unnecessary intermediaries, reduces consumer prices, and empowers the people who feed our nation. 

Thank you for your time. We would now love to take any questions.
"""

doc = SimpleDocTemplate("c:/Team SIH 2026/Kisan Direct/Kisan_Direct_Presentation_Speech.pdf", pagesize=letter)
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleStyle",
    parent=styles["Heading1"],
    alignment=TA_CENTER,
    spaceAfter=14
)

heading_style = ParagraphStyle(
    "HeadingStyle",
    parent=styles["Heading2"],
    spaceBefore=14,
    spaceAfter=6
)

normal_style = styles["Normal"]
normal_style.fontSize = 12
normal_style.leading = 14

story = []
title = Paragraph("Kisan Direct - Pitch Speech", title_style)
story.append(title)
story.append(Spacer(1, 12))

for paragraph in speech_text.split('\n'):
    p = paragraph.strip()
    if p == "":
        story.append(Spacer(1, 6))
    elif p.startswith("[Slide"):
        story.append(Paragraph(p, heading_style))
    else:
        story.append(Paragraph(p, normal_style))

doc.build(story)
