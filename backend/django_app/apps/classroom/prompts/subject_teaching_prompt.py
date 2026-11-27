"""
apps/classroom/prompts/subject_teaching_prompt.py

One teaching method per subject. Only the selected subject's text is sent with a lesson.

WHY SPLIT FROM TEACHING_DEPTH_PROMPT:
    Sending every subject's rules to every class wasted context and diluted the instructions
    (a maths class also read medicine rules). Code selects the rules (subject_resolution.py).
"""
SUBJECT_RULES_HEADER = '\nSUBJECT METHOD (teach as a specialist in this subject):\n'

SUBJECT_TEACHING_RULES = {
    'physics': '''- Physics: meaning, conditions/assumptions, variables and SI units, relationships,
  why the formula applies, worked reasoning/substitution/result and interpretation;
  derivation only when relevant to requested depth. No unrelated images.
''',
    'mathematics': '''- Mathematics: definitions, domain/conditions, why steps are valid, derivation/proof
  when appropriate, worked examples, special cases and common errors.
''',
    'chemistry': '''- Chemistry: substances and particles involved, bonding and structure, the mechanism
  or process step by step, balanced equations with states where relevant, worked
  stoichiometry or calculations with units, and safety/real applications. Do not
  invent reaction conditions, yields or data.
''',
    'medicine': '''- Medicine: relevant location, structure, function, connected mechanisms, regulation
  and physiological/clinical application; distinguish normal physiology from disease.
  State contextual limits of numerical norms. Do not invent diagnoses or treatment.
''',
    'biology': '''- Biology: relevant structures, functions, classifications, processes, relationships,
  comparisons and organism-level examples; explain causal steps and exceptions.
''',
    'computer_science': '''- Computing: prerequisites, algorithm/code reasoning, traced input-to-output example,
  edge cases and complexity when relevant; do not claim unexecuted code was tested.
''',
    'engineering': '''- Engineering: the problem, the system and its components, how each works, the governing
  forces/energy/signals with units, a worked calculation, and failure, safety or design
  trade-offs. Mark simplified models as conceptual, not engineering analysis.
''',
    'general': '''- Use the discipline's definitions, evidence, mechanisms, examples and limitations.
  Do not force calculations or every possible category into a topic.
''',
}
