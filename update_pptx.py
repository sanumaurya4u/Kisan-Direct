from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

prs = Presentation('src/assets/PPT1_SIH26033.pptx')

def format_shape(shape, title, bullets):
    tf = shape.text_frame
    tf.clear()
    
    first = True
    if title:
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(16)
        p.font.color.rgb = RGBColor(0, 51, 153)
        first = False
        
    for bullet in bullets:
        p = tf.add_paragraph() if not first else tf.paragraphs[0]
        first = False
        
        # Check if there is a colon for bolding the prefix
        if ": " in bullet:
            bold_part, rest = bullet.split(": ", 1)
            run1 = p.add_run()
            run1.text = bold_part + ": "
            run1.font.bold = True
            run1.font.size = Pt(14)
            
            run2 = p.add_run()
            run2.text = rest
            run2.font.size = Pt(14)
        else:
            p.text = bullet
            p.font.size = Pt(14)
            
        if title:
            p.level = 1
        else:
            p.level = 0
            
# --- SLIDE 2: PROPOSED SOLUTION ---
slide2 = prs.slides[1]
for shape in slide2.shapes:
    if shape.shape_id == 3: # Main Description
        format_shape(shape, None, [
            "Value Proposition: An AI-driven marketplace eliminating opaque intermediaries, connecting farmers/FPOs directly with verified institutional buyers.",
            "Key Mechanism: Uses Explainable AI (XAI) to match buyers and sellers based on crop, quality, logistics, and real-time market prices.",
            "Goal: Maximize net margins for farmers and minimize procurement costs for buyers."
        ])
    elif shape.shape_id == 12: # How it addresses PS 33
        format_shape(shape, None, [
            "Direct Connect: Bypasses multiple layers, ensuring direct farmer-to-buyer trade.",
            "Price Intelligence: Shows market context & trends before negotiation starts.",
            "Logistics Integration: Estimates delivery costs & ETA upfront to avoid hidden losses.",
            "Farmer Control: AI recommends the best matches, but the farmer retains full control."
        ])
    elif shape.shape_id == 26: # Innovation & Uniqueness
        format_shape(shape, None, [
            "Explainable AI (XAI): No black-box algorithms. Every match shows sub-scores, reasons, and warnings.",
            "Net-Gain Optimization: Prioritizes nearer buyers if logistics costs outweigh price gains.",
            "Modular Architecture: AI modules (pricing, matching, forecasting) are plug-and-play.",
            "Transparent Service Layer: Logistics are visible services, not hidden costs."
        ])

# --- SLIDE 3: TECHNICAL APPROACH ---
slide3 = prs.slides[2]
for shape in slide3.shapes:
    if shape.shape_id == 14: # Technologies
        format_shape(shape, "TECHNOLOGIES TO BE USED", [
            "Frontend: React.js, Tailwind CSS (Responsive PWA)",
            "Backend: FastAPI (Python), Node.js (Microservices)",
            "Database: PostgreSQL with PostGIS (for spatial queries)",
            "AI/ML: Scikit-learn (Match scoring, price prediction)",
            "Logistics/Routing: Google OR-Tools, OpenStreetMap",
            "Infrastructure: Docker, JWT Authentication"
        ])
        
    elif shape.shape_id == 17: # Workflow / Register
        format_shape(shape, None, [
            "1. Onboard & Auth: Secure JWT-backed login for Farmers, FPOs, and Buyers.",
            "2. Create Listing: Farmer enters crop, quantity, quality, and location.",
            "3. Discover & Offer: Buyers search and submit offers for suitable batches.",
            "4. AI Match Computation: System scores based on price, distance, delivery, and reliability.",
            "5. Review & Accept: Farmer reviews the explainable match score and accepts the best net-gain offer.",
            "6. Plan Delivery: Logistics service estimates distance, vehicle type, and cost."
        ])
    # hide the other shape if any
    elif shape.shape_id == 16:
        shape.text_frame.clear()

# --- SLIDE 4: FEASIBILITY AND VIABILITY ---
slide4 = prs.slides[3]
for shape in slide4.shapes:
    if shape.shape_id == 15: # Technical
        format_shape(shape, "TECHNICAL FEASIBILITY", [
            "MVP Ready: Core workflow operational using React, PostgreSQL, and Docker.",
            "Scalable: Modular ML services allow updates without breaking the main API contract."
        ])
    elif shape.shape_id == 22: # Market
        format_shape(shape, "MARKET FEASIBILITY", [
            "Targeted Launch: Starting with specific FPO clusters and anchor buyers to ensure liquidity.",
            "Clear Need: Farmers demand price context; buyers need verified, traceable batches."
        ])
    elif shape.shape_id == 32: # Operational
        format_shape(shape, "OPERATIONAL FEASIBILITY", [
            "FPO Partnerships: FPOs support onboarding, aggregation, and quality checks.",
            "Logistics Integration: Existing logistics providers partner as visible, priced services."
        ])
    elif shape.shape_id == 34: # Competitive Adv
        format_shape(shape, "COMPETITIVE ADVANTAGE", [
            "Integrated Workflow: Combines price intelligence, demand forecasting, and logistics.",
            "Farmer-Centric: Focuses on actual net realization rather than just highest gross price."
        ])
    elif shape.shape_id == 35: # Validation
        format_shape(shape, "VALIDATION STRATEGY", [
            "AI Validation: Compare match recommendations against actual accepted offers.",
            "Economic Validation: Measure farmer net realization and buyer procurement cost vs. baseline."
        ])

# --- SLIDE 5: IMPACT AND BENEFITS ---
slide5 = prs.slides[4]
for shape in slide5.shapes:
    if shape.shape_id == 4: # Target
        format_shape(shape, "TARGET AUDIENCE & REACH", [
            "Primary: Small/marginal farmers, FPOs, Women-led SHGs.",
            "Secondary: Retailers, restaurants, processors, institutional buyers, logistics providers."
        ])
    elif shape.shape_id == 8: # Social
        format_shape(shape, "SOCIAL IMPACT", [
            "Empowerment: Strengthens farmer agency with clear offer, price, and delivery data.",
            "Inclusivity: Supports structured buyer discovery for Women-led SHGs and local FPOs."
        ])
    elif shape.shape_id == 13: # Economic
        format_shape(shape, "ECONOMIC IMPACT", [
            "For Farmers: Transparent price and logistics info leads to higher net margins.",
            "For Buyers: Structured sourcing reduces procurement costs and ensures quality."
        ])
    elif shape.shape_id == 15: # Environmental
        format_shape(shape, "ENVIRONMENTAL IMPACT", [
            "Reduced Spoilage: Demand-aware matching lowers failed deliveries and food waste.",
            "Carbon Footprint: Future multi-stop routing optimizations reduce avoidable travel."
        ])
    elif shape.shape_id == 17: # Scalability
        format_shape(shape, "SCALABILITY & SUSTAINABILITY (PHASED)", [
            "Phase 1: 1-3 FPO clusters, manual operations support.",
            "Phase 2: Standardized verification, buyer SLAs, route-partner networks.",
            "Phase 3: Multi-state expansion, localized demand models, ONDC integrations."
        ])

# --- SLIDE 6: RESEARCH AND REFERENCES ---
slide6 = prs.slides[5]
for shape in slide6.shapes:
    if shape.shape_id == 25: # Gov Ref
        format_shape(shape, "GOVERNMENT AND SECTOR REFERENCES", [
            "eNAM (National Agriculture Market): transparent price discovery (enam.gov.in)",
            "FAO Study on Food Loss in India: Reducing Post-Harvest Losses (fao.org)",
            "ONDC: Working with farmer communities for digital market access (ondc.org)"
        ])
    elif shape.shape_id == 54: # Tech Ref
        format_shape(shape, "TECHNOLOGY REFERENCES", [
            "FastAPI & PostgreSQL: High-performance backend and relational data.",
            "PostGIS: Spatial database extender for geographic object support.",
            "Scikit-learn: Machine Learning in Python.",
            "Google OR-Tools: Optimization for logistics routing."
        ])
        
    # Clear out the other scattered reference shapes to clean up the slide
    elif shape.shape_id in [46, 48, 50, 9, 11]:
        shape.text_frame.clear()


prs.save('src/assets/PPT1_SIH26033.pptx') # overwrite the original
print("Successfully generated updated PPTX!")
