cat << 'EOF' > /opt/moonitor-kiosk/launch.sh
#!/bin/bash
export DISPLAY=:0
export XAUTHORITY=$(ls -t /tmp/serverauth* 2>/dev/null | head -n 1)
cd /opt/moonitor-kiosk
exec npm start
EOF