"""Bounded Commons image discovery with reusable licences and source metadata."""
import json
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen
from django.utils.html import strip_tags
from apps.classroom.constants.research import (
    WIKIMEDIA_API_URL, IMAGE_RESULT_LIMIT, IMAGE_WIDTH, IMAGE_MIME_TYPES,
    IMAGE_USER_AGENT, MAX_RESPONSE_BYTES, HTTP_TIMEOUT,
)


def _trusted_url(value, host):
    if not isinstance(value, str):
        return False
    url = urlsplit(value)
    return url.scheme == 'https' and url.hostname == host and not url.username and not url.password and url.port in (None, 443)


def normalize_image(page):
    """Reject non-images, missing attribution and unsupported licence grants."""
    if not isinstance(page, dict):
        return None
    infos = page.get('imageinfo', [])
    if not isinstance(infos, list) or not infos or not isinstance(infos[0], dict):
        return None
    info = infos[0]
    meta = info.get('extmetadata', {})
    if not isinstance(meta, dict):
        return None
    def text(key):
        record = meta.get(key, {})
        value = record.get('value', '') if isinstance(record, dict) else ''
        return strip_tags(value)[:1000] if isinstance(value, str) else ''
    licence = text('LicenseUrl')
    if licence.startswith('http://creativecommons.org/'):
        licence = 'https://' + licence.removeprefix('http://')
    author = text('Artist')
    target = info.get('thumburl') or info.get('url')
    source = info.get('descriptionurl')
    if info.get('mime') not in IMAGE_MIME_TYPES or not author:
        return None
    if not _trusted_url(target, 'upload.wikimedia.org') or not _trusted_url(source, 'commons.wikimedia.org'):
        return None
    if not isinstance(licence, str) or not licence.startswith(('https://creativecommons.org/licenses/by/', 'https://creativecommons.org/licenses/by-sa/', 'https://creativecommons.org/publicdomain/zero/')):
        return None
    return {'title': str(page.get('title', 'Illustration'))[:500], 'target': target,
            'source': source, 'author': author, 'license': licence,
            'description': text('ImageDescription')}


def search_lesson_images(question):
    query = urlencode({'action': 'query', 'format': 'json', 'generator': 'search',
                       'gsrsearch': question[:500] + ' diagram', 'gsrnamespace': 6,
                       'gsrlimit': IMAGE_RESULT_LIMIT, 'prop': 'imageinfo',
                       'iiprop': 'url|mime|extmetadata', 'iiurlwidth': IMAGE_WIDTH,
                       'iiextmetadatafilter': 'Artist|LicenseUrl|ImageDescription'})
    data = fetch_image_metadata(WIKIMEDIA_API_URL + '?' + query)
    pages = data.get('query', {}).get('pages', {})
    if not isinstance(pages, dict):
        raise ValueError('Invalid image response')
    return [image for page in list(pages.values())[:IMAGE_RESULT_LIMIT]
            if (image := normalize_image(page)) is not None]


def fetch_image_metadata(url):
    request = Request(url, headers={'User-Agent': IMAGE_USER_AGENT})
    with urlopen(request, timeout=HTTP_TIMEOUT) as response:
        raw = response.read(MAX_RESPONSE_BYTES + 1)
    if len(raw) > MAX_RESPONSE_BYTES:
        raise ValueError('Image metadata exceeds limit')
    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("Invalid image metadata")
    return data
