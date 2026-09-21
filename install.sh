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

echo "[+] Ensuring system boots into multi-user text target..."
systemctl set-default multi-user.target

echo "[+] Setting up installation directory at /opt/moonitor-kiosk..."
INSTALL_DIR="/opt/moonitor-kiosk"
mkdir -p "$INSTALL_DIR"
rsync -av ./ "$INSTALL_DIR/"

echo "[+] Installing project NPM dependencies in $INSTALL_DIR..."
cd "$INSTALL_DIR"
npm install

echo "[+] Configuring automatic login on tty1 for user: $TARGET_USER..."
mkdir -p /etc/systemd/system/getty@tty1.service.d
cat << EOF > /etc/systemd/system/getty@tty1.service.d/autologin.conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin $TARGET_USER --noclear %I \$TERM
EOF

echo "[+] Configuring direct app launch for $TARGET_USER..."
cat << 'EOF' > "$TARGET_HOME/.xinitrc"
cd /opt/moonitor-kiosk
exec npm start
EOF
chown "$TARGET_USER:$TARGET_USER" "$TARGET_HOME/.xinitrc"
chmod +x "$TARGET_HOME/.xinitrc"

if ! grep -q "startx" "$TARGET_HOME/.bash_profile" 2>/dev/null; then
    cat << 'EOF' >> "$TARGET_HOME/.bash_profile"

# Auto-start X11 kiosk on login to tty1
if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
    exec startx
fi
EOF
    chown "$TARGET_USER:$TARGET_USER" "$TARGET_HOME/.bash_profile"
fi

systemctl daemon-reload
systemctl enable getty@tty1

echo "[+] Moonitor-Kiosk complete pure kiosk installation finished successfully!"