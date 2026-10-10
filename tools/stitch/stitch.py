#!/usr/bin/env python3
"""Minimal Stitch MCP client. Usage:
  python3 stitch.py list                      # tools/list
  python3 stitch.py call TOOL '{"json":"args"}'
  import stitch; stitch.call("list_projects", {})
Reads API key from env STITCH_API_KEY (never printed)."""
import os, sys, json, urllib.request, itertools
URL = "https://stitch.googleapis.com/mcp"
_id = itertools.count(1)

def rpc(method, params=None, timeout=600):
    key = os.environ.get("STITCH_API_KEY")
    if not key: raise SystemExit("STITCH_API_KEY not set")
    body = json.dumps({"jsonrpc": "2.0", "id": next(_id), "method": method, "params": params or {}}).encode()
    req = urllib.request.Request(URL, data=body, method="POST", headers={
        "X-Goog-Api-Key": key, "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode()
    except urllib.error.HTTPError as e:
        return {"error": {"http": e.code, "body": e.read().decode()[:2000]}}
    if raw.lstrip().startswith("{"):
        return json.loads(raw)
    msgs = [json.loads(l[5:]) for l in raw.splitlines() if l.startswith("data:") and l[5:].strip()]
    return msgs[-1] if msgs else {"raw": raw}

def tools():
    return rpc("tools/list")

def call(name, args=None, timeout=600):
    """Returns parsed result; tries to JSON-decode text content / structuredContent."""
    res = rpc("tools/call", {"name": name, "arguments": args or {}}, timeout)
    r = res.get("result", res)
    if isinstance(r, dict) and r.get("structuredContent") is not None:
        return r["structuredContent"]
    if isinstance(r, dict) and "content" in r:
        out = []
        for c in r["content"]:
            t = c.get("text")
            try: out.append(json.loads(t))
            except Exception: out.append(t if t is not None else c)
        if r.get("isError"): return {"isError": True, "content": out}
        return out[0] if len(out) == 1 else out
    return res

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "list":
        print(json.dumps(tools(), indent=1))
    elif sys.argv[1] == "call":
        print(json.dumps(call(sys.argv[2], json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}), indent=1))
