@echo off
REM get themes from feathers github page and convert them to gown

IF EXIST "feathers\NUL" (
    cd feathers; git pull; cd ..
) else (
    git clone https://github.com/BowlerHatLLC/feathers.git
)

python get_themes.py feathers ../../docs/themes/assets ../data
pause
