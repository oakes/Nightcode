javapackager -deploy -native rpm -outdir package -outfile Nightcode -srcdir target -appclass nightcode.core -name "Nightcode" -title "Nightcode" -Bicon=package/linux/Nightcode.png -BappVersion=$1
javapackager -deploy -native deb -outdir package -outfile Nightcode -srcdir target -appclass nightcode.core -name "Nightcode" -title "Nightcode" -Bicon=package/linux/Nightcode.png -BappVersion=$1
