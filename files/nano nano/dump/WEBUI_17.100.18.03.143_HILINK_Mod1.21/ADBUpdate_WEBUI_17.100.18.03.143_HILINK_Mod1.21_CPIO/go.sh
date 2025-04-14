#!/bin/sh

pause() {
	echo "$PRESS_ENTER"
	read
}

quit() {
	echo
	pause
}

echo 'Choose your language:'
echo '1) English'
echo '2) Russian'
echo -n ': '
read lang
echo

case $lang in
	1)
		ENTER_MODEM_IP='Enter the modem IP'
		INCORRECT_INPUT='Incorrect input'
		PRESS_ENTER='Press Enter'
		PRESS_AND_REBOOT='After pressing Enter the device will be rebooted'
		;;
	2)
		ENTER_MODEM_IP='Введите IP модема'
		INCORRECT_INPUT='Неверный ввод'
		PRESS_ENTER='Нажмите Enter'
		PRESS_AND_REBOOT='После нажатия Enter устройство будет перезагружено'
		;;
esac

echo "$ENTER_MODEM_IP:"
echo -n ': '
read ip
echo

[ -n "$ip" ] || {
  echo
  echo "$INCORRECT_INPUT"
  quit
}

adb connect $ip:5555

adb push image.cpio /online

adb shell mount -o remount,rw /app/webroot /app/webroot

adb shell busybox rm -rf /app/webroot/*
adb shell "cd /app/webroot && busybox cpio -im -F /online/image.cpio"
adb shell busybox rm /online/image.cpio

echo
echo "$PRESS_AND_REBOOT"
pause > /dev/null

adb shell "if busybox [ -e /dev/appvcom1 ]; then echo -e 'AT^RESET\r' > /dev/appvcom1; elif busybox [ -e /dev/appvcom ]; then echo -e 'AT^RESET\r' > /dev/appvcom; fi"

adb kill-server

quit
