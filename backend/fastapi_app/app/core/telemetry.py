"""
fastapi_app/app/core/telemetry.py
Lightweight execution telemetry and latency profiling for LangGraph workflows.
"""
import time
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class WorkflowTelemetry:
    """Tracks latency, step duration, and execution metrics for AI agent runs."""

    def __init__(self, session_id: str = "default"):
        self.session_id = session_id
        self.start_time = time.perf_counter()
        self.step_timings: Dict[str, float] = {}
        self._current_step: Optional[str] = None
        self._step_start: float = 0.0

    def start_step(self, step_name: str) -> None:
        self._current_step = step_name
        self._step_start = time.perf_counter()

    def end_step(self, step_name: str) -> float:
        duration_ms = (time.perf_counter() - self._step_start) * 1000.0
        self.step_timings[step_name] = round(duration_ms, 2)
        return self.step_timings[step_name]

    def total_duration_ms(self) -> float:
        return round((time.perf_counter() - self.start_time) * 1000.0, 2)

    def summary(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "total_duration_ms": self.total_duration_ms(),
            "step_timings": self.step_timings,
        }
