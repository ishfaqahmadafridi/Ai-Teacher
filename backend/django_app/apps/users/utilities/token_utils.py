def generate_user_tokens(user):
    """
    Generate JWT access and refresh tokens for authenticated user.
    """
    return {
        "access": f"mock_access_token_user_{user.id}",
        "refresh": f"mock_refresh_token_user_{user.id}",
    }
