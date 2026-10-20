"""Conversational replies must not wait on research or unbounded retrieval."""
import asyncio
import unittest
from unittest.mock import AsyncMock, patch
from app.services.stream_context import get_stream_context


class StreamContextTests(unittest.IsolatedAsyncioTestCase):
    @patch('app.services.stream_context.search', new_callable=AsyncMock)
    async def test_greetings_bypass_retrieval(self, search):
        for greeting in ('hi', ' Hello! ', 'Good evening', 'thanks!'):
            self.assertEqual(await get_stream_context(greeting), '')
        search.assert_not_called()

    @patch('app.services.stream_context.search', new_callable=AsyncMock)
    async def test_educational_questions_use_context(self, search):
        search.return_value = 'Relevant chapter'
        self.assertEqual(await get_stream_context('Explain momentum'), 'Relevant chapter')
        search.assert_awaited_once_with('Explain momentum', top_k=3)

    @patch('app.services.stream_context.search', new_callable=AsyncMock)
    async def test_failure_does_not_block_generation(self, search):
        search.side_effect = RuntimeError('unavailable')
        self.assertEqual(await get_stream_context('Explain momentum'), '')

    @patch('app.services.stream_context.RETRIEVAL_TIMEOUT_SECONDS', 0.01)
    @patch('app.services.stream_context.search', new_callable=AsyncMock)
    async def test_slow_retrieval_is_bounded(self, search):
        async def slow(*args, **kwargs):
            await asyncio.sleep(10)
            return 'too late'
        search.side_effect = slow
        self.assertEqual(await get_stream_context('Explain momentum'), '')
