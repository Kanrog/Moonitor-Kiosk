#!/bin/bash
set -e

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo bash install.sh"
  exit 1
fi

echo "Updating system package lists..."
apt update && apt upgrade -y

echo "Installing core prerequisites..."
apt install -y curl git build-essential rsync

echo "Installing Node.js LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    apt install -y nodejs
else
    echo "Node.js is already installed ($(node -v))."
fi

echo "Installing Electron system runtime libraries & GTK3..."
apt install -y \
    libglib2.0-0t64 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgdk-pixbuf-2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libasound2 \
    libgtk-3-0t64

echo "Installing lightweight Kiosk X server packages..."
apt install -y xserver-xorg x11-xserver-utils openbox xinit

echo "Setting up installation directory at /opt/moonitor-kiosk..."
INSTALL_DIR="/opt/moonitor-kiosk"
mkdir -p "$INSTALL_DIR"
rsync -av --exclude='.git' ./ "$INSTALL_DIR/"

echo "Installing project NPM dependencies in $INSTALL_DIR..."
cd "$INSTALL_DIR"
npm install

echo "Creating systemd service..."
cat << 'EOF' > /etc/systemd/system/moonitor-kiosk.service
[Unit]
Description=Moonitor Kiosk
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/moonitor-kiosk
ExecStart=/usr/bin/npm start
Restart=always
Environment=DISPLAY=:0

[Install]
WantedBy=multi-user.target
EOF

echo "Enabling and starting systemd service..."
systemctl daemon-reload
systemctl enable moonitor-kiosk
systemctl start moonitor-kiosk

echo "Moonitor-Kiosk installation and systemd service deployment completed successfully!"