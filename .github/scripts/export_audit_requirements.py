"""Export installed versions for advisory lookup, normalizing PEP 440 local labels.

CPU Torch wheels use versions such as 2.14.1+cpu. PyPI advisories index the
public version 2.14.1; removing the build label keeps Torch in the audit.
"""
from importlib.metadata import distributions
from packaging.version import Version

requirements = sorted({
    f"{distribution.metadata['Name']}=={Version(distribution.version).public}"
    for distribution in distributions()
})
print("\n".join(requirements))
