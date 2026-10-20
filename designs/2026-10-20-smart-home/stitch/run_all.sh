cd "$(dirname "$0")"
python3 gen.py DARK onboarding home
python3 gen.py LIGHT home
python3 gen.py DARK room energy
python3 gen.py LIGHT room energy
echo ALL_DONE
