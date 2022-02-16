#!/bin/sh

# Check operating system
if [[ "$OSTYPE" != "linux-gnu" && "$OSTYPE" != "darwin" ]]; then
    echo "[ERROR] Please use Linux/MacOS"
    exit
fi

# Change working directory to script location
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR" || exit

# Check python version
PYTHON_VERSION="3.8.5"
version=$(python -V 2>&1 | grep -Po '(?<=Python )(.+)')
if [[ -z "$version" ]]; then
    echo "[ERROR] No Python installation found"
    exit
elif [[ "$version" != "$PYTHON_VERSION" ]]; then
    echo "[ERROR] Detected Python version $version, please use Python 3.8.5"
    exit
fi

# Check if virtual enviroment exists
if [[ !(-e "venv") ]]; then
    echo "[MESSAGE] Creating virtual enviroment 'venv' "
    python -m venv venv
    if [[ !(-e "requirements.txt") ]]; then
        echo "[ERROR] Whoops could not find requirements.txt. Please get from the repository"
        exit
    else
        if [[ -e "venv/bin/activate" ]]; then
            echo "[MESSAGE] Installing packages in requirements.txt"
            source "venv/bin/activate"
            pip install -r requirements.txt
            deactivate
        fi
    fi
else
    echo "[MESSAGE] Virtual enviroment found"
    if [ -z "$(ls -A /path/to/dir)" ]; then
        echo "[ERROR] Whoops venv is empty. Please re-run script"
        rm -rf venv
        exit
    fi
    if [[ !(-e "requirements.txt") ]]; then
        echo "[ERROR] Whoops could not find requirements.txt. Please get from the repository"
        exit
    fi
    source "venv/bin/activate"
    REQ=$(cat requirements.txt)
    PIP_REQ=$(pip freeze)
    if [[ "$REQ" == "$PIP_REQ" ]]; then
        echo "[MESSAGE] Packages are up to date"
    else
        echo "[MESSAGE] Packages need updating"
        pip install -r requirements.txt
    fi
    deactivate
fi

# Check if Flask Dot Enviroment exists
if [[ !(-e ".flaskenv") ]]; then
    echo "[MESSAGE] Adding .flaskenv"
    echo -e "FLASK_APP=run.py\nFLASK_ENV=development" > ".flaskenv"
fi
