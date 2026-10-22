cd "$(dirname "$0")"
python3 gen.py LIGHT onboarding chats conversation
python3 gen.py DARK chats conversation
python3 gen.py LIGHT group profile
echo ALL_DONE
