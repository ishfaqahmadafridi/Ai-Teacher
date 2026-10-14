"""Atomic rolling-minute admission using Redis server time."""
PROVIDER_ADMISSION_SCRIPT = """
local clock = redis.call('TIME')
local now = tonumber(clock[1]) + tonumber(clock[2]) / 1000000
local window = KEYS[1] .. ':window'
local sequence = KEYS[1] .. ':sequence'
redis.call('ZREMRANGEBYSCORE', window, '-inf', now - 60)
if redis.call('ZCARD', window) >= tonumber(ARGV[1]) then
    local oldest = redis.call('ZRANGE', window, 0, 0, 'WITHSCORES')
    return math.max(1, math.ceil(tonumber(oldest[2]) + 60 - now))
end
local member = redis.call('INCR', sequence)
redis.call('EXPIRE', sequence, 120)
redis.call('ZADD', window, now, member)
redis.call('EXPIRE', window, 120)
return 0
"""
