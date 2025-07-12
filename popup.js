document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const notesArea = document.getElementById("notes");
  const darkToggle = document.getElementById("darkModeToggle");

  // ------------------ To-Do List Logic ------------------
  function loadTasks() {
    chrome.storage.sync.get("tasks", (data) => {
      const tasks = data.tasks || [];
      taskList.innerHTML = "";

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.done) {
          li.style.textDecoration = "line-through";
        }

        // Toggle strike-through on click
        li.addEventListener("click", () => {
          task.done = !task.done;
          li.style.textDecoration = task.done ? "line-through" : "none";

          // Save updated task state
          chrome.storage.sync.set({ tasks });
        });

        taskList.appendChild(li);
      });
    });
  }

  function addTask() {
    const newTaskText = taskInput.value.trim();
    if (!newTaskText) return;

    chrome.storage.sync.get("tasks", (data) => {
      const tasks = data.tasks || [];
      tasks.push({ text: newTaskText, done: false });
      chrome.storage.sync.set({ tasks }, loadTasks);
      taskInput.value = "";
    });
  }

  addTaskBtn.addEventListener("click", addTask);
  loadTasks();

  
  const siteInput = document.getElementById("siteInput");
const openSiteBtn = document.getElementById("openSiteBtn");

if (siteInput && openSiteBtn) {
  openSiteBtn.addEventListener("click", () => {
    let url = siteInput.value.trim();
    if (!url) return;

    // Add "https://" if user didn't type it
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    chrome.tabs.create({ url: url }); // ✅ Open in new tab
    siteInput.value = ""; // Clear input
  });
}
const reminderTitle = document.getElementById("reminderTitle");
const reminderDate = document.getElementById("reminderDate");
const addReminderBtn = document.getElementById("addReminderBtn");
const reminderList = document.getElementById("reminderList");

// Load existing reminders
chrome.storage.sync.get("reminders", (data) => {
  const reminders = data.reminders || [];
  renderReminders(reminders);
});

function renderReminders(reminders) {
  reminderList.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  reminders.forEach((reminder, index) => {
    const li = document.createElement("li");
    const isToday = reminder.date === today;
    const isOverdue = reminder.date < today;

    li.innerHTML = `<strong>${reminder.title}</strong> – Due: ${reminder.date}`;

    if (isToday) {
      li.style.color = "orange";
      li.innerHTML += " (Due Today!)";
    } else if (isOverdue) {
      li.style.color = "red";
      li.innerHTML += " (Overdue!)";
    }

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener("click", () => {
      reminders.splice(index, 1);
      chrome.storage.sync.set({ reminders }, () => {
        renderReminders(reminders);
      });
    });

    li.appendChild(delBtn);
    reminderList.appendChild(li);
  });
}

addReminderBtn.addEventListener("click", () => {
  const title = reminderTitle.value.trim();
  const date = reminderDate.value;

  if (!title || !date) return;

  chrome.storage.sync.get("reminders", (data) => {
    const reminders = data.reminders || [];
    reminders.push({ title, date });
    chrome.storage.sync.set({ reminders }, () => {
      renderReminders(reminders);
      reminderTitle.value = "";
      reminderDate.value = "";
    });
  });
});


});