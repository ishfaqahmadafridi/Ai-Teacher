"""Bounds and supported parts for conceptual, non-simulation lesson visuals."""
SCHEMATIC_MAX_NODES = 12
SCHEMATIC_MAX_EDGES = 24
VISUAL_ID_LENGTH = 40
VISUAL_LABEL_LENGTH = 80
VISUAL_NO_FOCUS = ('none', 'all')
ASSEMBLY_PARTS = {
    'bridge': ('deck', 'left_support', 'right_support', 'left_brace', 'right_brace'),
    'beam': ('beam', 'left_support', 'right_support', 'load'),
    'piston': ('cylinder', 'piston', 'rod'),
    'pulley': ('wheel', 'axle', 'rope', 'load'),
    'molecule': ('atom_0', 'atom_1', 'atom_2', 'atom_3', 'atom_4', 'bonds'),
}
MOLECULE_ATOM_COUNTS = {'water': 3, 'carbon_dioxide': 3, 'methane': 5}
DIAGRAM_ACTIONS = (
    'none', 'highlight', 'rotate', 'zoom', 'zoom_in', 'zoom_out', 'show_formula',
    'show_formula_stepwise', 'show_initial', 'add_arrow', 'add_label',
    'pause_and_highlight', 'pause_and_explain',
)
STRUCTURED_VISUAL_FIELDS = {
    'tree': ('kind', 'nodes'),
    'polynomial': ('kind', 'coefficients', 'x_min', 'x_max'),
    'schematic': ('kind', 'title', 'nodes', 'edges', 'focus'),
    'assembly': ('kind', 'model', 'molecule', 'phase', 'focus'),
}

DIAGRAM_TYPES = ('gravity', 'electric_field', 'projectile', 'wave', 'circuit', 'atom', 'image', 'default')
