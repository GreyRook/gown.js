#!/bin/bash
# get themes from feathers git account and convert them to gown

if [ -d "feathers" ]; then
    cd feathers; git pull; cd ..
else
    git clone https://github.com/BowlerHatLLC/feathers.git
fi

python convert.py feathers ../assets
