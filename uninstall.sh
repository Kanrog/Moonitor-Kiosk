#!/bin/bash
# Moonitor Kiosk Uninstaller for Debian / Raspberry Pi OS
# Run with: sudo ./uninstall.sh

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo ./uninstall.sh"
  exit 1
fi

echo "[+] Stopping and disabling moonitor-kiosk service..."
systemctl stop moonitor-kiosk
systemctl disable moonitor-kiosk

echo "[+] Removing systemd service configuration..."
rm -f /etc/systemd/system/moonitor-kiosk.service
systemctl daemon-reload
systemctl reset-failed

echo "[+] Removing application files from /opt/moonitor-kiosk..."
rm -rf /opt/moonitor-kiosk

echo "[+] Moonitor Kiosk has been completely uninstalled from this machine."