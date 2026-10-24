cd "$(dirname "$0")"
python3 gen.py LIGHT home forecast cities details
python3 gen.py DARK home forecast details
python3 /workspace/stitch/download.py $(cat project_id.txt) . gen_log_light.json gen_log_dark.json
echo ALL_DONE
