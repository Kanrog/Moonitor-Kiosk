#!/bin/bash
# Moonitor Kiosk Uninstaller for Debian / Raspberry Pi OS
# Run with: sudo ./uninstall.sh

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo ./uninstall.sh"
  exit 1
fi

INSTALL_DIR="/opt/moonitor-kiosk"

echo "[+] Stopping and disabling moonitor-kiosk service..."
systemctl stop moonitor-kiosk || true
systemctl disable moonitor-kiosk || true

echo "[+] Removing systemd service file..."
rm -f /etc/systemd/system/moonitor-kiosk.service
systemctl daemon-reload

echo "[+] Removing application files from $INSTALL_DIR..."
rm -rf "$INSTALL_DIR"

echo "[+] Cleaning up local user configuration..."
rm -f ~/.xinitrc

echo "[+] Moonitor-Kiosk has been completely uninstalled from the system."