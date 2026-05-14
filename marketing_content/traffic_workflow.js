// traffic_workflow.js
// Simple Node.js script that leverages Anthropic Claude API to generate video captions
// and produce a posting schedule JSON for StudExMeat marketing.
// ---------------------------------------------------------------
// Prerequisites:
//   - Node.js >= 18 (for fetch support)
//   - ANTHROPIC_API_KEY environment variable set with your Claude API key
//   - Install dependencies: npm install dotenv
// ---------------------------------------------------------------
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Storyboard data (could be loaded from a JSON file in real use)
const videos = [
  {
    id: 'wagyu_gold',
    title: 'Wagyu Biltong Gold Reveal',
    description: 'Introducing the ultimate taste experience... Premium Wagyu Biltong Gold.',
    tags: ['#WagyuGold', '#PremiumBiltong', '#SouthAfrica', '#GoldStandard']
  },
  {
    id: 'gym_protein',
    title: 'Gym Protein Challenge',
    description: 'Fuel your post‑workout grind! 40g PROTEIN per pack.',
    tags: ['#ProteinPower', '#GymSnack', '#FitnessFuel']
  },
  {
    id: 'military',
    title: 'Military Essential',
    description: 'Taste of home for our heroes. 4‑6 mo shelf‑life, HALAL.',
    tags: ['#MilitaryReady', '#Halal', '#ShelfLife']
  },
  {
    id: 'executive',
    title: 'Executive Boardroom',
    description: 'Impress corporate wellness managers with luxury hampers.',
    tags: ['#CorporateGifting', '#ExecutiveTreat', '#LuxurySnack']
  }
];

// Helper to call Claude (Anthropic) Completion API
async function generateCaption(video) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set in environment');
  }
  const prompt = `Create a concise, engaging Instagram/TikTok caption for the following video.

Title: ${video.title}
Description: ${video.description}
Hashtags: ${video.tags.join(' ')}
CTA: Shop now at www.studexmeat.com

The caption should be <= 150 characters and end with the CTA.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 200,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await response.json();
  const content = data.content?.[0]?.text?.trim();
  return content || 'Caption generation failed';
}

// Build posting schedule (times are placeholders, adjust as needed)
const schedule = [
  { time: '09:30', platform: 'TikTok', videoId: 'wagyu_gold' },
  { time: '09:45', platform: 'Instagram Reels', videoId: 'wagyu_gold' },
  { time: '10:30', platform: 'TikTok', videoId: 'gym_protein' },
  { time: '10:45', platform: 'Instagram Reels', videoId: 'gym_protein' },
  { time: '11:30', platform: 'YouTube Shorts', videoId: 'gym_protein' },
  { time: '12:30', platform: 'TikTok', videoId: 'military' },
  { time: '12:45', platform: 'Instagram Reels', videoId: 'military' },
  { time: '13:30', platform: 'YouTube Shorts', videoId: 'military' },
  { time: '14:30', platform: 'TikTok', videoId: 'executive' },
  { time: '14:45', platform: 'Instagram Reels', videoId: 'executive' },
  { time: '15:30', platform: 'YouTube Shorts', videoId: 'executive' }
];

async function main() {
  console.log('Generating captions with Claude...');
  for (const video of videos) {
    const caption = await generateCaption(video);
    video.generatedCaption = caption;
    console.log(`\n[${video.id}] Caption:`);
    console.log(caption);
  }

  // Merge captions into schedule
  const enrichedSchedule = schedule.map(entry => {
    const vid = videos.find(v => v.id === entry.videoId);
    return { ...entry, caption: vid?.generatedCaption || '' };
  });

  console.log('\n--- Posting Schedule (JSON) ---');
  console.log(JSON.stringify(enrichedSchedule, null, 2));
  // In a real workflow you could write this JSON to a file or push to a scheduler.
}

main().catch(err => console.error('Error:', err));
