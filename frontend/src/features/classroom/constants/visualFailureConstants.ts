export const VISUAL_FAILURE_MESSAGES: Record<string, string> = {
  budget_exceeded: 'This visual was skipped because the lesson search budget was reached.',
  no_unambiguous_match: 'Images were found, but none could be matched confidently to this concept.',
  no_usable_asset: 'A usable image could not be retrieved for this concept.',
  missing_visual_requirements: 'The lesson response did not include a supported visual. The explanation remains available.',
};
