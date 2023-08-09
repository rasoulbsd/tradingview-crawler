@echo off
call git add . && git commit -m "update from local" && git push
pause
exit