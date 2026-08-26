"""
fastapi_app/app/agents/graph.py
LangGraph StateGraph builder and startup compilation.
Compiles once at module initialization to eliminate per-request compilation overhead.
"""
import logging
from langgraph.graph import StateGraph, END
from app.agents.state import ClassroomState
from app.agents.router import route_intent, select_next_node
from app.agents.nodes import (
    safety_node,
    tutor_node,
    retrieval_node,
    solver_node,
    critic_node,
    grader_node,
    quiz_node,
    planner_node,
)

logger = logging.getLogger(__name__)


def build_and_compile_classroom_graph():
    """
    Builds & compiles the production LangGraph StateGraph once.
    """
    builder = StateGraph(ClassroomState)

    # 1. Register Nodes
    builder.add_node("safety_node", safety_node)
    builder.add_node("route_intent", route_intent)
    builder.add_node("tutor_node", tutor_node)
    builder.add_node("retrieval_node", retrieval_node)
    builder.add_node("solver_node", solver_node)
    builder.add_node("critic_node", critic_node)
    builder.add_node("grader_node", grader_node)
    builder.add_node("quiz_node", quiz_node)
    builder.add_node("planner_node", planner_node)

    # 2. Define Edges
    builder.set_entry_point("safety_node")
    builder.add_edge("safety_node", "route_intent")

    # Conditional Routing from Intent Router
    builder.add_conditional_edges(
        "route_intent",
        select_next_node,
        {
            "tutor_node": "tutor_node",
            "retrieval_node": "retrieval_node",
            "solver_node": "solver_node",
            "grader_node": "grader_node",
            "quiz_node": "quiz_node",
            "planner_node": "planner_node",
            "end": END,
        },
    )

    # Sub-workflow paths
    builder.add_edge("retrieval_node", "tutor_node")
    builder.add_edge("solver_node", "critic_node")

    # Final response edges to END
    builder.add_edge("tutor_node", END)
    builder.add_edge("critic_node", END)
    builder.add_edge("grader_node", END)
    builder.add_edge("quiz_node", END)
    builder.add_edge("planner_node", END)

    # Compile once
    compiled = builder.compile()
    logger.info("[LangGraph] Production StateGraph compiled successfully once at startup.")
    return compiled


# Singleton compiled graph instance
compiled_classroom_graph = build_and_compile_classroom_graph()
