#!/bin/bash
# Moonitor Kiosk Updater
# Run with: sudo ./update.sh

if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run as root: sudo ./update.sh"
  exit 1
fi

TARGET_USER="${SUDO_USER:-moonitor}"
INSTALL_DIR="/opt/moonitor-kiosk"

if [ ! -d "$INSTALL_DIR" ]; then
  echo "[-] Moonitor Kiosk is not installed at $INSTALL_DIR. Run install.sh first."[cite: 12]
  exit 1
fi

echo "[+] Copying latest application files to $INSTALL_DIR..."
rsync -av ./ "$INSTALL_DIR/"[cite: 12]

echo "[+] Updating Node.js dependencies..."
cd "$INSTALL_DIR"
npm install[cite: 12]

echo "[+] Updating dynamic X11 launcher wrapper and permissions..."
cat << 'EOF' > "$INSTALL_DIR/launch.sh"
#!/bin/bash
export DISPLAY=:0
export XAUTHORITY=$(ls -t /tmp/serverauth* 2>/dev/null | head -n 1)
cd /opt/moonitor-kiosk
exec npm start
EOF
chmod +x "$INSTALL_DIR/launch.sh"

echo "[+] Updating systemd service configuration..."
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

echo "[+] Fixing ownership permissions..."
chown -R "$TARGET_USER:$TARGET_USER" "$INSTALL_DIR"[cite: 12]

echo "[+] Reloading systemd and restarting kiosk service..."
systemctl daemon-reload
systemctl restart moonitor-kiosk

echo "[+] Update completed successfully!"[cite: 12]