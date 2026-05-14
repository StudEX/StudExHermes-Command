#!/usr/bin/env python3
"""
RUN SIEGE - Master Orchestrator for 7-day content campaign
Usage: python run_siege.py --dry-run
"""

import sys
import json
from pathlib import Path

def main():
    print("\n" + "="*80)
    print("🎬 STUDEX SIEGE ORCHESTRATOR")
    print("="*80)
    print("\nAvailable commands:")
    print("  --dry-run           Preview all 42 captions")
    print("  --generate-captions Generate captions from Claude API")
    print("  --schedule          Push posts to Blotato + Postiz")
    print("\nExample: python run_siege.py --generate-captions")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
