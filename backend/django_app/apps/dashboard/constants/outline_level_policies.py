"""Teaching-depth policies for the education stages supported by onboarding."""
OUTLINE_LEVEL_POLICIES = {
    'primary': ('Primary school', 'Use very simple words, familiar everyday examples, short chapters and concrete activities. Assume no prior subject knowledge. Avoid abstract theory, advanced tools and specialist terminology.'),
    'middle': ('Middle school', 'Build basic concepts gradually using simple explanations, demonstrations and short guided exercises. Introduce and explain new vocabulary. Do not use university-level theory or professional tooling.'),
    'high_school': ('High school', 'Use school-level foundations and the supplied grade/year. Include accessible worked examples and progressively harder practice. Explain prerequisites before applications; exclude specialist university content.'),
    'undergraduate': ('College / undergraduate', 'Use introductory degree-level concepts before intermediate applications. Respect the supplied year, state prerequisites through topic order, and include practical assignments. Do not assume graduate research knowledge.'),
    'postgraduate': ('University / postgraduate', 'Use graduate-level depth only after checking course prerequisites. Start with a concise foundation review and progress to analysis, critical comparison and research-informed exercises. A general introductory course must still start with its foundations.'),
    'professional': ('Professional learning', 'Build practical workplace skills from stated prerequisites, with realistic tasks. Do not assume expertise based only on this profile label.'),
    'self_learner': ('Independent learning', 'Start with beginner-friendly foundations and build gradually to practical applications. Explain terminology and provide guided practice; assume no formal qualifications.'),
}
