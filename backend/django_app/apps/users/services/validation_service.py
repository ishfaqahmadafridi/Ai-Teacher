"""Shared database checks for account identity validation."""
from django.contrib.auth import get_user_model

User = get_user_model()


def identity_exists(field, value, exclude_user=None):
    lookup = f'{field}__iexact' if field in ('email', 'username') else field
    users = User.objects.filter(**{lookup: value})
    if exclude_user is not None:
        users = users.exclude(pk=exclude_user.pk)
    return users.exists()
