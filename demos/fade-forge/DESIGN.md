# FADE FORGE — Premium Barber Studio
## design.md

**Brand:** Fade Forge  
**Type:** Premium barbershop / men's grooming studio  
**Mood:** Dark, confident, tactile luxury meets street edge  
**Primary keywords:** precision, craft, confidence

---

### Color System
| Role | Hex | Use |
|------|-----|-----|
| Background | #0a0a0a | Canvas, sections |
| Surface | #141414 | Cards, panels |
| Surface Light | #1a1a1a | Hover states |
| Primary Accent | #c9a96e | Gold — CTAs, highlights, key text |
| Secondary Accent | #8b7355 | Warm bronze — secondary highlights |
| Text Primary | #f5f5f5 | Headings |
| Text Secondary | #a0a0a0 | Body, meta |
| Border | #2a2a2a | Dividers, subtle lines |

---

### Typography
| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| H1 (hero) | Inter | clamp(56px, 8vw, 104px) | 700 | -0.03em |
| H2 | Inter | clamp(32px, 4vw, 56px) | 600 | -0.02em |
| H3 | Inter | 24px | 600 | -0.01em |
| Body | Inter | 18px | 400 | 0 |
| Caption / labels | Inter | 12px | 500 | 0.15em, uppercase |
| Accent display | Satoshi* | clamp(64px, 10vw, 120px) | 700 | -0.04em |

*Satoshi via @font-face from fontshare.com, fallback Inter.

---

### Spacing
- Section vertical padding: `120px` desktop → `80px` mobile
- Content max-width: `1200px`
- Horizontal padding: `24px` mobile → `64px` desktop
- Card gap: `24px`

---

### Effects & Motion
- Smooth scroll: Lenis (or native `scroll-behavior: smooth`)
- Hero text reveal: Split text per character, stagger `0.05s`, `translateY(100%) → 0`, opacity `0 → 1`
- Image hover: Scale `1.04`, `duration 0.6s`, `ease: power2.out`
- Scroll-triggered fade-up: `translateY(40px) → 0`, opacity `0 → 1`, `duration 0.8s`, `ease: power3.out`
- Parallax: Hero image at `speed 0.5`
- Custom cursor: Small gold dot (8px) following mouse, scales to 40px on hover over links/buttons
- CTA buttons: Magnetic hover effect (GSAP)
- Section transitions: Subtle horizontal line that draws from center outward

---

### Sections
1. **Hero** — Full viewport, dark background image of barber at work, gold accent line top-left. Big text: "Where precision meets style." CTA: "Book Now" (gold outline button).
2. **Services** — Three cards: The Cut, The Shave, The Trim. Each with image + title + description + price. Fade-up on scroll.
3. **Atmosphere** — Full-width image gallery with parallax grid. Cinematic dark tones.
4. **About** — Two-column: image left (barber portrait), text right. Quote: "Every fade tells a story."
5. **Testimonials** — Clean carousel or stacked cards with client quotes.
6. **Contact / Footer** — Location, hours, booking CTA. Minimal, centered. Gold accent line.

---

### Technical Requirements
- Single HTML file (for local preview first)
- Tailwind CSS via CDN
- GSAP + ScrollTrigger via CDN
- Google Fonts: Inter
- Responsive: mobile-first
- No external image dependencies — use placeholder images with `src="data:image/svg+xml,..."` or unsplash source URLs if needed
