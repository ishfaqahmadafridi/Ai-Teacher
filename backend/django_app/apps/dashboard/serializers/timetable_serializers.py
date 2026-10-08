from calendar import day_name

from rest_framework import serializers
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

class TimetablePreferencesSerializer(serializers.Serializer):
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    days = serializers.ListField(child=serializers.ChoiceField(choices=list(day_name)), min_length=1, max_length=7)
    max_classes = serializers.IntegerField(min_value=1, max_value=8)
    session_minutes = serializers.IntegerField(min_value=15, max_value=180, default=90)
    break_minutes = serializers.IntegerField(min_value=0, max_value=120, default=30)
    timezone = serializers.CharField(max_length=100)
    def validate(self, data):
        try:
            ZoneInfo(data["timezone"])
        except (ZoneInfoNotFoundError, ValueError):
            raise serializers.ValidationError("Choose a valid timezone.")
        start, end = data["start_time"], data["end_time"]
        if any(value.second or value.microsecond for value in (start, end)):
            raise serializers.ValidationError("Study times must use whole minutes.")
        if end.hour * 60 + end.minute - start.hour * 60 - start.minute < data["session_minutes"]:
            raise serializers.ValidationError("Study hours must contain a complete session on the same day.")
        available_minutes = end.hour * 60 + end.minute - start.hour * 60 - start.minute
        required_minutes = data["max_classes"] * data["session_minutes"] + (data["max_classes"] - 1) * data["break_minutes"]
        if available_minutes < required_minutes:
            fits = (available_minutes + data["break_minutes"]) // (data["session_minutes"] + data["break_minutes"])
            raise serializers.ValidationError(
                f"You selected {data['max_classes']} classes per day, but these hours fit only {fits}. "
                f"Allow at least {required_minutes // 60} hours {required_minutes % 60} minutes, "
                "choose Custom study hours, or reduce the daily class count."
            )
        if len(set(data["days"])) != len(data["days"]):
            raise serializers.ValidationError("Study days must be unique.")
        return data

class ManualSlotSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField(max_length=255)
    subject = serializers.CharField(max_length=255)
    dayOfWeek = serializers.ChoiceField(choices=list(day_name))
    timeSlot = serializers.CharField(max_length=50)
    instructorName = serializers.CharField(max_length=100, allow_blank=True)
    roomOrLink = serializers.CharField(max_length=500, allow_blank=True)
    status = serializers.ChoiceField(choices=["upcoming", "live", "completed"])
