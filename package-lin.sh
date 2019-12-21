set -e

jpackage --type deb --name Nightcode --app-version $1 --input target --main-jar Nightcode-$1-linux.jar --icon package/linux/Nightcode.png --copyright "Public Domain" --linux-shortcut --linux-app-category Development

jpackage --type app-image --name Nightcode --app-version $1 --input target --main-jar Nightcode-$1-linux.jar --icon package/linux/Nightcode.png --copyright "Public Domain"

echo "#!/bin/sh

cd \"\$(dirname \"\$0\")\"
./bin/Nightcode" >> Nightcode/AppRun

chmod +x Nightcode/AppRun

echo "[Desktop Entry]
Name=Nightcode
Exec=/bin/Nightcode
Icon=/lib/Nightcode
Terminal=false
Type=Application
Categories=Development;" >> Nightcode/nightcode.desktop

appimagetool Nightcode
