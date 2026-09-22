## Be aware, this has only been tested on a virtual machine but with real printers ona local network.
I am also a little unclear that the install instructions actually work, please let me know!

# Moonitor-Kiosk

A high-performance, lightweight Klipper fleet monitoring kiosk application built for touchscreens and resource-constrained Linux systems. Powered by **Electron**, **Wayland**, and a built-in **Dual-Mode HTTP Server**.

## Core Features

* **Dual-Mode Architecture:** Runs as a local Electron kiosk application and serves as a fully accessible web dashboard for any browser on your local network (Port `3000`).
* **Fleet Dashboard:** Strict grid layout optimized for single-screen view with touch-swipe pagination and status indicators.
* **Interactive Printer Webviews:** Embedded tabs loading individual Mainsail or Fluidd web interfaces with animated loading overlays.
* **Touchscreen Virtual Keyboard:** Built-in on-screen virtual keyboard with a settings toggle to support touch-only interfaces. Currently not working in Mainsail/Fluidd, but it is being worked on.
* **Network & Wi-Fi Management:** Automated Moonraker subnet discovery (Port 7125), active device IP/port display, and `nmcli`-backed Wi-Fi SSID selection. Wi-Fi-interface is untested.
* **System Control & Updates:** Integrated power controls (reboot/shutdown) and automated GitHub update checks via the Settings tab.

## Installation, Update & Uninstallation Instructions

### 1. Installation
Clone the repository to `/opt/moonitor-kiosk` and run the automated installer with `sudo`:
```bash
git clone https://github.com/your-username/moonitor-kiosk.git /opt/moonitor-kiosk
cd /opt/moonitor-kiosk
sudo ./install.sh
```

### 2. Updating
To update the application, open the **Settings** tab inside the kiosk or network browser dashboard and click the **Update Kiosk** button. This automatically pulls the latest code from GitHub, installs dependencies, and reboots the system.

### 3. Uninstallation
To completely remove the application, service, and system files:
```bash
cd /opt/moonitor-kiosk
sudo ./uninstall.sh
```

## Network Access

* **Local Kiosk:** Automatically starts on boot on the primary display (`:0`).
* **Local Network Browser:** Access the dashboard from any device on your network via:
    ```text
    http://<kiosk-ip>:3000
    ```