const API_BASE_URL = "http://localhost:5000";

const STREAM_URL = `${API_BASE_URL}/stream`;
const COMPLETE_TASK_URL = `${API_BASE_URL}/tasks/complete`;

const clientId = Date.now();
const eventSource = new EventSource(`${STREAM_URL}?clientId=${clientId}`);
eventSource.onmessage = function (event) {
  const data = event.data;
  const taskId = data.split(":")[1].trim();
  const taskElement = document.getElementById(`task${taskId}`);
  taskElement.querySelector("button").disabled = true;
  taskElement.classList.add("completed");

  addEventMsgToDocument(data);
};

function addEventMsgToDocument(data) {
  const eventsDiv = document.getElementById("events");

  const newEvent = document.createElement("div");
  newEvent.textContent = `New event: ${JSON.stringify(data)}`;

  const newEventContainer = document.createElement("div");
  newEventContainer.classList.add("event");
  newEventContainer.appendChild(newEvent);
  eventsDiv.appendChild(newEventContainer);
  // Remove the event message after 2 seconds
  setTimeout(() => {
    eventsDiv.removeChild(newEventContainer);
  }, 2000);
}

async function completeTask(taskId) {
  await fetch(`${COMPLETE_TASK_URL}/${taskId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
    },
    body: JSON.stringify({ taskId }),
  });
}

// Reset tasks to initial state
function resetTasks() {
  const tasks = document.querySelectorAll(".task-list li");
  tasks.forEach((task) => {
    task.querySelector("button").disabled = false;
    task.classList.remove("completed");
  });
}
