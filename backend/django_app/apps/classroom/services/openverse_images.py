"""Anonymous Openverse fallback; use attributed, reusable image records only."""
from urllib.parse import urlencode, urlsplit
from uuid import UUID
from apps.classroom.services.research_images import fetch_image_metadata
from apps.classroom.constants.research import IMAGE_RESULT_LIMIT, OPENVERSE_API_URL


def normalize_openverse_image(record):
    if not isinstance(record, dict):
        return None
    try:
        image_id = str(UUID(record['id']))
    except (KeyError, ValueError, TypeError, AttributeError):
        return None
    licence = record.get('license')
    version = record.get('license_version')
    source, author = record.get('foreign_landing_url'), record.get('creator')
    if licence not in ('by', 'by-sa', 'cc0') or not isinstance(source, str):
        return None
    try:
        url = urlsplit(source)
    except ValueError:
        return None
    if url.scheme != 'https' or not url.hostname or url.username or url.password:
        return None
    if not isinstance(author, str) or not author.strip():
        return None
    if licence == 'cc0':
        licence_url = 'https://creativecommons.org/publicdomain/zero/1.0/'
    elif version in ('1.0', '2.0', '2.5', '3.0', '4.0'):
        licence_url = f'https://creativecommons.org/licenses/{licence}/{version}/'
    else:
        return None
    return {'title': str(record.get('title', 'Illustration'))[:500],
            'target': f'{OPENVERSE_API_URL}/images/{image_id}/thumb/',
            'source': source, 'author': author[:1000], 'license': licence_url,
            'description': (str(record.get('description') or '') + ' ' + ' '.join(str(tag.get('name', '')) for tag in (record.get('tags') or []) if isinstance(tag, dict)))[:1000]}


def search_openverse_images(query):
    params = urlencode({'q': query[:150], 'page_size': IMAGE_RESULT_LIMIT,
                        'license': 'by,by-sa,cc0', 'mature': 'false'})
    data = fetch_image_metadata(f'{OPENVERSE_API_URL}/images/?{params}')
    results = data.get('results')
    if not isinstance(results, list):
        raise ValueError('Invalid Openverse response')
    return [image for record in results[:IMAGE_RESULT_LIMIT]
            if (image := normalize_openverse_image(record)) is not None]
