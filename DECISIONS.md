# DECISIONS.md

## Part 2 — Premium Home Page

For a product-focused landing page, the first few seconds matter the most. When a company promotes a specific product, the page needs to capture attention quickly, communicate its value, and create the feeling of *“Wow, I want to try this.”* With that in mind, I intentionally kept the experience **simple, elegant, lightweight, and focused on the product**.

### 1. Why did you choose this implementation pattern over the more obvious solution?

Instead of using a heavier frontend framework such as React, I chose **HTML, CSS, and Vanilla JavaScript**, supported by **Bootstrap 5** for responsive layout utilities.

This is a single, product-centric landing page without complex application state, authentication, or backend data. React would have added additional structure and dependencies without providing a significant benefit for this particular experience. A lightweight implementation also helps keep the page fast and straightforward, which is important for a marketing landing page where users should understand the product almost immediately.

This approach gave me direct control over the visual details. Custom CSS handles the typography, spacing, colors, product presentation, and responsive layout, while JavaScript handles product/size selection, dynamic pricing, navigation, scroll reveals, and other small interactions.

I treated **SKINN Silk Rose Eau de Parfum** as the center of the experience rather than building a generic e-commerce template. The page follows a simple journey: hero and value proposition → fragrance story → fragrance notes → product and size selection → how to wear → reservation CTA. This keeps the user's attention on the product and naturally guides them toward action.

### 2. One compromise made under time constraints

The main trade-off was prioritizing a **polished visual experience and clear product journey** over building a complete e-commerce system.

The page focuses on product discovery, exploration, selection, and the final reservation CTA. It does not include authentication, real inventory management, payment processing, order management, or a complete backend checkout.

I made this decision because those features would require significant development time while contributing relatively little to the main goal of the challenge: creating a premium, responsive homepage that makes the product immediately appealing.

With a full week, I would focus on accessibility and keyboard testing, image and loading optimization, wider device testing, and refining interactions based on usability feedback. I would then consider connecting the reservation CTA to a real commerce backend if required.

### 3. Where did you use AI tools, and what did you manually check and change afterward?

I used AI tools as a **brainstorming and development assistant** for exploring the product and landing-page direction, refining copy ideas, planning sections and UI concepts, and getting development suggestions.

I did not treat the generated output as final. I personally made the decisions about the page structure, typography, spacing, color palette, product presentation, CTA placement, and interaction behavior. I also reviewed and modified the generated code to fit the actual design.

After implementation, I checked the responsiveness across mobile and desktop layouts, tested the JavaScript interactions, removed effects that did not add value, and reviewed the HTML, CSS, and JavaScript so I can explain the final implementation during the follow-up discussion.

AI helped me move faster during exploration and development, but the final design, implementation, and decisions remain my responsibility.