from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for public User profile representation.
    """
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',
            'username',
            'email',
            'country_code',
            'mobile',
            'auth_provider',
            'avatar_url',
            'is_verified',
            'created_at',
        ]
        read_only_fields = ['id', 'auth_provider', 'is_verified', 'created_at']
