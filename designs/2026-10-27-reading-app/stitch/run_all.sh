cd "$(dirname "$0")"
python3 mk.py
python3 gen.py LIGHT home detail profile reader
python3 gen.py DARK home detail
python3 /workspace/stitch/download.py $(cat project_id.txt) . gen_log_light.json gen_log_dark.json
echo ALL_DONE
