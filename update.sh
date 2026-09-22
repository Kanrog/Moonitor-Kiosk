#!/bin/bash
# Moonitor Kiosk Updater
# Run with: sudo ./update.sh

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo ./update.sh"
  exit 1
fi

INSTALL_DIR="/opt/moonitor-kiosk"

if [ ! -d "$INSTALL_DIR" ]; then
  echo "[-] Moonitor Kiosk is not installed at $INSTALL_DIR. Run install.sh first."
  exit 1
fi

echo "[+] Copying latest application files to $INSTALL_DIR..."
rsync -av ./ "$INSTALL_DIR/"

echo "[+] Updating Node.js dependencies..."
cd "$INSTALL_DIR"
npm install

echo "[+] Fixing ownership permissions..."
chown -R moonitor:moonitor "$INSTALL_DIR"

echo "[+] Update completed successfully!"