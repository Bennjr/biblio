const { ipcRenderer } = require('electron');

const sidebar = document.querySelector(".sidebar");
let isResizing = false;

sidebar.addEventListener("mousemove", (e) => {
    if (sidebar.offsetWidth - e.offsetX < 5) {
        sidebar.style.cursor = "col-resize";
    } else {
        sidebar.style.cursor = "default";
    }
});

sidebar.addEventListener("mousedown", (e) => {
    if (sidebar.offsetWidth - e.offsetX < 5) {
        isResizing = true;
        document.body.style.cursor = "col-resize";
    }
});

document.addEventListener("mousemove", (e) => {
    if (isResizing) {
        const newWidth = e.clientX;
        sidebar.style.width = newWidth + "px";
        if (newWidth < 150) {
            sidebar.style.width = "150px";
        }else if (newWidth > window.innerWidth - 150) {
            sidebar.style.width = (window.innerWidth - 150) + "px";
        }

    }
});

document.addEventListener("mouseup", () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "default";
    }
});

document.getElementById('minimize-btn').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  ipcRenderer.send('maximize-window');
});

document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

const maximizeIcon = document.getElementById('maximize-icon');

ipcRenderer.on('window-state-changed', (event, state) => {
  if (state === 'maximized') {
    maximizeIcon.src = 'assets/icons/titlebar/maximize_fullscreen.svg';
  } else {
    maximizeIcon.src = 'assets/icons/titlebar/maximize_window.svg';
  }
});