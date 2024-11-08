import json
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from typing import List

router = APIRouter()

# Store connected WebSockets
connected_clients: List[WebSocket] = []

async def broadcast(message: str):
    """Send a message to all connected clients."""
    for client in connected_clients:
        await client.send_text(message)

@router.websocket("/ws/tasks")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            # Keep the connection alive
            data = await websocket.receive_text()
            message_data = json.loads(data)
            task_id = message_data.get("task_id")
            action = message_data.get("action")

            # Handle different actions
            if action == "update":
                # Notify all clients about the task update
                await broadcast(f"Task {task_id} has been updated.")
            elif action == "create":
                # Notify all clients about the new task creation
                await broadcast(f"A new task has been created: {task_id}.")
            # Add more actions as needed

    except WebSocketDisconnect:
        # Remove the client on disconnect
        connected_clients.remove(websocket)
        await broadcast("A client has disconnected.")
