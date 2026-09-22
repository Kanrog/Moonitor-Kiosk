#!/bin/bash
set -e

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run with sudo: sudo bash install.sh"
  exit 1
fi

TARGET_USER="${SUDO_USER:-root}"
if [ "$TARGET_USER" = "root" ]; then
    TARGET_HOME="/root"
else
    TARGET_HOME="/home/$TARGET_USER"
fi

echo "[+] Updating system package lists..."
apt update && apt upgrade -y

echo "[+] Installing core prerequisites..."
apt install -y curl git build-essential rsync

echo "[+] Installing Node.js LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt install -y nodejs
else
    echo "Node.js is already installed ($(node -v))."
fi

echo "[+] Installing Electron runtime libraries & GTK3..."
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

echo "[+] Installing raw X server packages..."
apt install -y xserver-xorg x11-xserver-utils xinit

echo "[+] Setting up installation directory at /opt/moonitor-kiosk..."
INSTALL_DIR="/opt/moonitor-kiosk"
mkdir -p "$INSTALL_DIR"
rsync -av ./ "$INSTALL_DIR/"

echo "[+] Installing project NPM dependencies in $INSTALL_DIR..."
cd "$INSTALL_DIR"
npm install

echo "[+] Configuring passwordless power controls for $TARGET_USER..."
echo "$TARGET_USER ALL=(ALL) NOPASSWD: /sbin/reboot, /usr/sbin/reboot, /sbin/poweroff, /usr/sbin/poweroff, /bin/systemctl reboot, /usr/bin/systemctl reboot, /bin/systemctl poweroff, /usr/bin/systemctl poweroff" > /etc/sudoers.d/moonitor-power
chmod 440 /etc/sudoers.d/moonitor-power

echo "[+] Creating dynamic X11 launcher wrapper..."
cat << 'EOF' > "$INSTALL_DIR/launch.sh"
#!/bin/bash
export DISPLAY=:0
export XAUTHORITY=$(ls -t /tmp/serverauth* 2>/dev/null | head -n 1)
cd /opt/moonitor-kiosk
exec npm start
EOF
chmod +x "$INSTALL_DIR/launch.sh"

echo "[+] Configuring systemd service for Moonitor Kiosk..."
cat << EOF > /etc/systemd/system/moonitor-kiosk.service
[Unit]
Description=Moonitor Kiosk
After=network.target graphical.target

[Service]
User=$TARGET_USER
Group=$TARGET_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/launch.sh
Restart=always
RestartSec=5

[Install]
WantedBy=graphical.target
EOF

systemctl daemon-reload
systemctl enable moonitor-kiosk

echo "[+] Fixing final ownership permissions for $TARGET_USER..."
chown -R "$TARGET_USER:$TARGET_USER" "$INSTALL_DIR"

echo "[+] Moonitor-Kiosk complete installation finished successfully!"[cite: 7]