@ECHO OFF

REM net stop MONGODB
REM net start MONGODB



REM Standard, inline approach
REM START /B CMD /C CALL "foo.bat" [args [...]]

REM If you don't want the output:
REM START /B CMD /C CALL "foo.bat" [args [...]] >NUL 2>&1

REM If you want the other window to hang around afterwards:
REM START CMD /K CALL "foo.bat" [args [...]]

REM If you want the other window to PAUSE afterwards (i.e dismiss upon key press):
REM START CMD /C CALL "foo.bat" [args [...]] ^& PAUSE

REM TO start script minimized out of site use:
REM START /MIN /K CALL "script.bat"

start /MIN CMD /C  CALL "refreshmongodb.bat"
start /MIN CMD /C CALL "mongodsetup.bat"
rem START /B CMD /C CALL mongo