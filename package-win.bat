jpackage --type app-image --name Nightcode --app-version %1 --input target --main-jar Nightcode-%1-windows.jar --icon package/windows/Nightcode.ico --copyright "Public Domain"

jpackage --type exe --name Nightcode --app-version %1 --input target --main-jar Nightcode-%1-windows.jar --icon package/windows/Nightcode.ico --copyright "Public Domain" --win-menu --win-per-user-install
