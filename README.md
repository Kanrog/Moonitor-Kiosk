## This is untested and not intended for use yet

# Moonitor 2.0
A high-performance, lightweight Klipper fleet monitoring kiosk application built for touchscreens and resource-constrained Linux systems (Raspberry Pi 4/5, older laptops). Powered by **Electron** and **Wayland (`cage`)**.

## Core Features

* **Fleet Dashboard:** Strict 3x3 grid layout optimized for single-screen view (`100vh`) with touch-swipe pagination and status indicators.
* **Adaptive Camera Previews:** Framed letterbox/pillarbox containers supporting mixed aspect ratios (**16:9**, **4:3**, and **1:1**) with snapshot throttling for low resource usage.
* **Persistent Tabbed Navigation:** Locked dashboard tab on the left, preloaded printer tabs across a scrollable middle section, and a locked settings tab on the right.
* **Interactive Controls:** Hover and touch-activated overlays featuring live nozzle/bed temperatures, progress bars, and quick actions (**Start**, **Pause**, **Stop**, and **Open Full UI**).
* **Network & Wi-Fi Management:** Automated Moonraker subnet discovery (Port 7125), active device IP/port display, and `nmcli`-backed Wi-Fi SSID selection.
* **Kiosk Architecture:** Zero-desktop Wayland session via `cage`, global virtual keyboard support for webviews, and an automated single-command installer.

## Installation & Quick Start

Clone the repository and run the automated Debian/Raspberry Pi OS installer:

```bash
sudo ./install.sh