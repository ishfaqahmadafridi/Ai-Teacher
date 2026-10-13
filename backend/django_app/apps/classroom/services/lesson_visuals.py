"""Supply image choices and resolve model selections without invented URLs."""
from apps.classroom.constants.visual_assets import VISUAL_ASSETS, VISUAL_CREDIT


def visual_catalog_prompt():
    choices = '\n'.join(f"{key}: {asset['title']}" for key, asset in VISUAL_ASSETS.items())
    return "\n## AVAILABLE REVIEWED IMAGES\n" + choices + "\nWhen teaching these anatomical systems, select diagram.asset_id from this catalog on each relevant chunk. Use annotation to identify the organ and function being explained. Do not invent asset IDs. These are labelled static illustrations, not simulations."


def resolve_lesson_visuals(answer):
    previous = None
    for chunk in answer['chunks']:
        diagram = chunk['diagram']
        asset_id = diagram.get('asset_id')
        if asset_id:
            previous = VISUAL_ASSETS[asset_id]
        if previous:
            diagram['target'] = previous['target']
            diagram['annotation'] = '\n'.join(filter(None, [diagram.get('annotation'), VISUAL_CREDIT, previous['source']]))
            answer['diagram_type'] = 'image'
    return answer
