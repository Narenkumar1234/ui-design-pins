cd "$(dirname "$0")"
python3 gen.py LIGHT home
python3 gen.py ART
python3 gen.py LIGHT explore
python3 gen.py LIGHT course
python3 gen.py DARK home explore course
echo ALL_DONE
