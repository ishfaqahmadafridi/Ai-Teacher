"""Country timezone lookup from the installed IANA tzdata package."""
from functools import lru_cache
from importlib.resources import files


@lru_cache(maxsize=1)
def country_timezones():
    root = files('tzdata.zoneinfo')
    countries = {}
    for line in root.joinpath('iso3166.tab').read_text().splitlines():
        if line and not line.startswith('#'):
            code, name = line.split('\t')[:2]
            countries[name.casefold()] = code
            countries[code.casefold()] = code
    zones = {}
    for line in root.joinpath('zone.tab').read_text().splitlines():
        if line and not line.startswith('#'):
            code, _, zone = line.split('\t')[:3]
            zones.setdefault(code, []).append(zone)
    return countries, zones


def country_default_timezone(country):
    countries, zones = country_timezones()
    candidates = zones.get(countries.get((country or '').casefold()), [])
    return candidates[0] if len(candidates) == 1 else None
