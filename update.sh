#!/bin/bash
# Moonitor Kiosk Updater for Debian / Raspberry Pi OS
# Run from your source directory with: sudo ./update.sh

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo ./update.sh"
  exit 1
fi

INSTALL_DIR="/opt/moonitor-kiosk"

if [ ! -d "$INSTALL_DIR" ]; then
  echo "[-] Moonitor Kiosk is not installed at $INSTALL_DIR. Run install.sh first."
  exit 1
fi

echo "[+] Stopping moonitor-kiosk service..."
systemctl stop moonitor-kiosk

echo "[+] Copying latest application files to $INSTALL_DIR..."
# Sync current directory files to install dir, ignoring git metadata
rsync -av --exclude='.git' ./ "$INSTALL_DIR/"

echo "[+] Updating Node.js dependencies..."
cd "$INSTALL_DIR"
npm install

echo "[+] Restarting moonitor-kiosk service..."
systemctl start moonitor-kiosk

echo "[+] Update completed successfully!"