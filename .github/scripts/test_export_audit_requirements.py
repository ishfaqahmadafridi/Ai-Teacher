"""Regression checks for auditing CPU wheels without skipping Torch."""
import contextlib
import io
from pathlib import Path
import runpy
from types import SimpleNamespace
import unittest
from unittest.mock import patch


class ExportAuditRequirementsTests(unittest.TestCase):
    def test_cpu_build_is_audited_under_its_public_version(self):
        packages = [
            SimpleNamespace(metadata={"Name": "torch"}, version="2.14.1+cpu"),
            SimpleNamespace(metadata={"Name": "Django"}, version="6.0.6"),
        ]
        output = io.StringIO()
        with patch("importlib.metadata.distributions", return_value=packages):
            with contextlib.redirect_stdout(output):
                runpy.run_path(str(Path(__file__).with_name("export_audit_requirements.py")))
        self.assertEqual(output.getvalue().splitlines(), ["Django==6.0.6", "torch==2.14.1"])
