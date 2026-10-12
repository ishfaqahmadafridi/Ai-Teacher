"""Public session identifiers cannot address private internal history namespaces."""
from rest_framework import serializers
from apps.classroom.constants.notes import ACCOUNT_SESSION_PREFIX


class PublicSessionIdField(serializers.CharField):
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        if value.startswith(ACCOUNT_SESSION_PREFIX):
            raise serializers.ValidationError('This session namespace is reserved.')
        return value
