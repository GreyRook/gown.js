#!/bin/bash
# get themes from feathers github page and convert them to gown

if [ -d "feathers" ]; then
    cd feathers; git pull; cd ..
else
    git clone https://github.com/BowlerHatLLC/feathers.git
fi

python get_themes.py feathers ../assets ../data
