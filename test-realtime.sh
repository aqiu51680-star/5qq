#!/bin/bash

# Test realtime propagation by updating app_content and checking if realtime event fires

SUPABASE_URL="https://sgihvgnjirmwkmlubygp.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnaWh2Z25qaXJtd2ttbHVieWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjYxMjEsImV4cCI6MjA3OTkwMjEyMX0.NKbdx94BxU02KV82uE3mZgdgTJSBK_9nwaOFx9xxkY4"

# Update app_content with a test timestamp
TIMESTAMP=$(date +%s)
echo "Sending realtime test update at $(date)"

curl -s -X PATCH \
  "${SUPABASE_URL}/rest/v1/app_content?id=eq.default" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{\"event_title\":\"Realtime Test - ${TIMESTAMP}\"}" \
  | jq .

echo ""
echo "Check browser console for realtime event logs"
echo "Admin page should show the updated event_title after a moment"
