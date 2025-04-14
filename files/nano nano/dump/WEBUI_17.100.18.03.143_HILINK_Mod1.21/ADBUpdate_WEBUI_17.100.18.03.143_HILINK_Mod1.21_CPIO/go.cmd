@prompt $G

@echo Choose your language:
@echo 1) English
@echo 2) Russian
@set /P lang=": "
@echo.

@^
if "%lang%" == "1" (
  set ENTER_MODEM_IP=Enter the modem IP
  set INCORRECT_INPUT=Incorrect input
  set PRESS_AND_REBOOT=After pressing a key the device will be rebooted
)

@^
if "%lang%" == "2" (
  set ENTER_MODEM_IP=Введите IP модема
  set INCORRECT_INPUT=Неверный ввод
  set PRESS_AND_REBOOT=После нажатия клавиши устройство будет перезагружено
)

@echo %ENTER_MODEM_IP%:
@set /P ip=": "

@^
if "%ip%" == "" (
  echo.
  echo %INCORRECT_INPUT%
  goto quit
)

adb connect %ip%:5555

adb push image.cpio /online

adb shell mount -o remount,rw /app/webroot /app/webroot

adb shell busybox rm -rf /app/webroot/*
adb shell "cd /app/webroot && busybox cpio -im -F /online/image.cpio"
adb shell busybox rm /online/image.cpio

@echo.
@echo %PRESS_AND_REBOOT%
@pause > nul

adb shell "if busybox [ -e /dev/appvcom1 ]; then echo -e 'AT^RESET\r' > /dev/appvcom1; elif busybox [ -e /dev/appvcom ]; then echo -e 'AT^RESET\r' > /dev/appvcom; fi"

adb kill-server

:quit
@echo.
@pause
