#!/bin/bash
# Robust dev server launcher for a memory-constrained k8s pod (~4GB RAM, no swap).
# - Caps the V8 heap so the next-server doesn't trip the cgroup OOM killer.
# - Auto-restarts next dev with a small backoff whenever it dies.
# - Traps signals and forwards them to children so the wrapper exits cleanly.
set -u
cd /home/z/my-project

LOG=/home/z/my-project/dev.log
PORT=3000
# Cap V8 heap at ~1.25GB so total RSS stays under the pod cgroup limit
# (next-server allocates ~2x its heap as RSS once file-rss/pgtables are included).
export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=1280 --max-semi-space-size=64"

trap 'pkill -TERM -P $$ 2>/dev/null; exit 0' TERM INT HUP

attempt=0
while true; do
  attempt=$((attempt + 1))
  echo "[$(date -u +%FT%TZ)] (attempt $attempt) starting next dev on $PORT with NODE_OPTIONS=$NODE_OPTIONS" >> "$LOG"
  ./node_modules/.bin/next dev -p "$PORT" </dev/null >>"$LOG" 2>&1
  EXIT=$?
  echo "[$(date -u +%FT%TZ)] next dev exited with $EXIT after attempt $attempt, restarting in 3s" >> "$LOG"
  sleep 3
done
