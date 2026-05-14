#!/usr/bin/env python3
"""
CAPTION AGENT - Generates 42 platform-optimized captions using Claude API.
"""

import json
import os
from pathlib import Path
from anthropic import Anthropic
from datetime import datetime

client = Anthropic()

BRAND_CONTEXT = """
IDENTITY: Studex Group CEO Tumelo Ramaphosa.
BRAND DNA: Black & Gold. "Tip of the Spear." Credibility-First. Expansion-Obsessed.
PLATFORM: Studex Global Markets (Alibaba meets Bloomberg Terminal).
TARGET: HNW International Traders, Commodity Buyers, Government Procurement, Elite Athletes.
VERTICALS: Studex Meat (Ankole/Wagyu), Studex Coffee (Rwanda), Studex Wheat (Uvelka), Studex AI, Animal Exchange.
TONE: Strategic Predator. Zero Fluff. Clinical Luxury.
COMPETITOR ANCHORS: @wagyumafia, @wagyufilmz, @gugafoods
PRIMARY CTA: Apply for Private Account access (info@studex.dev)
"""

def load_calendar():
    """Load siege calendar."""
    calendar_path = Path(__file__).parent.parent / "content" / "siege_calendar.json"
    with open(calendar_path, 'r') as f:
        return json.load(f)

def generate_caption(post_data: dict, day_num: int) -> dict:
    """Generate a single caption using Claude."""
    time_slot = post_data["time_sast"]
    platform = post_data["platform"]
    angle = post_data["content_angle"]
    keywords = ", ".join(post_data.get("keywords", []))

    prompt = f"""
{BRAND_CONTEXT}

Generate caption for:
- Time: {time_slot} SAST
- Platform: {platform}
- Angle: {angle}
- Keywords: {keywords}

Output: ONLY the caption (no preamble).
Platform-optimized length. Brand voice: Strategic predator, clinical luxury.
"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "day": day_num,
        "slot": post_data.get("slot"),
        "time_sast": time_slot,
        "platform": platform,
        "generated_caption": message.content[0].text.strip()
    }

def main():
    """Generate all 42 captions."""
    print("🔄 Generating 42 captions...")
    calendar = load_calendar()
    all_captions = []

    for day_obj in calendar["days"]:
        for post in day_obj["posts"]:
            print(f"  Day {day_obj['day']} {post['time_sast']}...", end=" ", flush=True)
            caption_obj = generate_caption(post, day_obj["day"])
            all_captions.append(caption_obj)
            print("✅")

    output_path = Path(__file__).parent.parent / "content" / "captions_generated.json"
    with open(output_path, 'w') as f:
        json.dump({"generated_at": datetime.now().isoformat(), "captions": all_captions}, f, indent=2)

    print(f"✅ Generated {len(all_captions)} captions → {output_path}")

if __name__ == "__main__":
    main()
