cd "$(dirname "$0")"
python3 gen.py LIGHT dashboard board detail mobile-board
python3 gen.py DARK dashboard
python3 /workspace/stitch/download.py $(cat project_id.txt) . gen_log_light.json gen_log_dark.json
echo ALL_DONE
