javapackager -deploy -native rpm -outdir package -outfile Nightcode -srcdir target -appclass nightcode.core -name "Nightcode" -title "Nightcode" -Bicon=package/linux/Nightcode.png
javapackager -deploy -native deb -outdir package -outfile Nightcode -srcdir target -appclass nightcode.core -name "Nightcode" -title "Nightcode" -Bicon=package/linux/Nightcode.png
