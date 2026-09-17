#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "  ========================================"
echo "   MLG Advanced ERP - Meer Logistics"
echo "  ========================================"
echo ""
echo "  Starting local server on http://localhost:8765"
echo "  Browser will open automatically."
echo "  Press Ctrl+C to stop when done."
echo ""

# Open browser
if command -v xdg-open >/dev/null; then
  xdg-open "http://localhost:8765" >/dev/null 2>&1 &
elif command -v open >/dev/null; then
  open "http://localhost:8765" >/dev/null 2>&1 &
fi

# Start server
if command -v python3 >/dev/null; then
  python3 -m http.server 8765
elif command -v python >/dev/null; then
  python -m http.server 8765
else
  echo "Python not found. Opening index.html directly..."
  if command -v xdg-open >/dev/null; then xdg-open "index.html"; fi
  if command -v open >/dev/null; then open "index.html"; fi
fi
