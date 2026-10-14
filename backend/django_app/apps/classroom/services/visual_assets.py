"""Download and normalize public licensed images before publishing references."""
import hashlib
import ipaddress
import socket
import warnings
from io import BytesIO
from urllib.parse import urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener
from pathlib import Path

from PIL import Image
from django.conf import settings
from apps.classroom.constants.research import HTTP_TIMEOUT, IMAGE_USER_AGENT, MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS, VISUAL_MEDIA_HOSTS
from apps.classroom.services.research_images import fetch_image_metadata


class AssetValidationError(ValueError):
    def __init__(self, code):
        self.code = code
        super().__init__(code)


def safe_asset_url(url):
    parsed = urlsplit(url)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password or parsed.port not in (None, 443):
        raise AssetValidationError('UNSAFE_URL')
    if not any(parsed.hostname == host or parsed.hostname.endswith('.' + host)
               for host in VISUAL_MEDIA_HOSTS):
        raise AssetValidationError('UNAPPROVED_HOST')
    addresses = socket.getaddrinfo(parsed.hostname, 443, type=socket.SOCK_STREAM)
    if not addresses or any(not ipaddress.ip_address(item[4][0]).is_global for item in addresses):
        raise AssetValidationError('PRIVATE_DESTINATION')
    return url


class AssetRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        safe_asset_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def normalized_image(raw):
    if not raw or len(raw) > MAX_IMAGE_BYTES:
        raise AssetValidationError('IMAGE_SIZE_LIMIT')
    with warnings.catch_warnings():
        warnings.simplefilter('error', Image.DecompressionBombWarning)
        with Image.open(BytesIO(raw)) as image:
            if image.format not in ('JPEG', 'PNG', 'WEBP') or image.width < 200 or image.height < 150 or image.width * image.height > MAX_IMAGE_PIXELS:
                raise AssetValidationError('UNSUPPORTED_FORMAT_OR_DIMENSIONS')
            image.verify()
        with Image.open(BytesIO(raw)) as image:
            image.load()
            image.thumbnail((1600, 1600))
            output = BytesIO()
            image.convert('RGB').save(output, format='PNG')
            return output.getvalue()


def asset_path(digest):
    if len(digest) != 64 or any(c not in '0123456789abcdef' for c in digest):
        raise ValueError('Invalid asset identifier')
    return Path(settings.MEDIA_ROOT) / 'verified-visuals' / (digest + '.png')


def stored_note_asset_paths(note):
    paths = {}
    for index, chunk in enumerate(note.answer['chunks']):
        target = chunk.get('diagram', {}).get('target', '')
        if isinstance(target, str) and target.startswith('/api/visual-assets/'):
            try:
                path = asset_path(target.removeprefix('/api/visual-assets/').strip('/'))
                if path.is_file():
                    paths[index] = path
            except ValueError:
                pass
    return paths


def materialize_image(image):
    """Only provider records enter this service; failures never become ready URLs."""
    target = image['target']
    if target.startswith('/api/visual-assets/'):
        return image
    if target.startswith('https://api.openverse.org/v1/images/'):
        record = fetch_image_metadata(target.removesuffix('thumb/'))
        target = record.get('url')
    if not isinstance(target, str):
        raise AssetValidationError('MISSING_ORIGINAL_URL')
    request = Request(safe_asset_url(target), headers={'User-Agent': IMAGE_USER_AGENT})
    with build_opener(AssetRedirectHandler()).open(request, timeout=HTTP_TIMEOUT) as response:
        if response.headers.get_content_type() not in ('image/jpeg', 'image/png', 'image/webp'):
            raise AssetValidationError('UNSUPPORTED_CONTENT_TYPE')
        raw = response.read(MAX_IMAGE_BYTES + 1)
    data = normalized_image(raw)
    digest = hashlib.sha256(data).hexdigest()
    path = asset_path(digest)
    path.parent.mkdir(parents=True, exist_ok=True)
    from django.core.files.base import ContentFile
    from django.core.files.storage import FileSystemStorage
    storage = FileSystemStorage(location=path.parent)
    if not storage.exists(path.name):
        storage.save(path.name, ContentFile(data))
    return {**image, 'target': f'/api/visual-assets/{digest}'}
