import json, re

with open('prisma/seed.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const JERSEYS_SEED\s*=\s*(\[[\s\S]*?\]);\s*async function main', content)
if not m:
    print('Failed to find JERSEYS_SEED')
    exit(1)

raw_js = m.group(1)
cleaned = re.sub(r'(\b\w+\b)\s*:', r'"\1":', raw_js)
cleaned = re.sub(r',\s*\]', ']', cleaned)
cleaned = re.sub(r',\s*\}', '}', cleaned)

items = json.loads(cleaned)
jerseys = []
for j in items:
    code_parts = j['code'].replace('JV-', '').split('/')
    prefix = code_parts[0].lower()
    suffix = code_parts[1].lower() if len(code_parts) > 1 else 'kit'
    item_id = f'kit-{prefix}-{suffix}'

    jerseys.append({
        'id': item_id,
        'code': j['code'],
        'name': j['name'],
        'subtitle': j['subtitle'],
        'price': j['price'],
        'edition': 'In Stock — Limited Allocation' if j.get('isFeatured') else 'In Stock — Immediate Dispatch',
        'colorway': j['subtitle'],
        'dominantColor': j['dominantColor'],
        'accentColor': j['accentColor'],
        'image': j['image'],
        'fallbackGradient': 'from-zinc-950 via-zinc-900 to-amber-950/30',
        'weightGsm': j['weightGsm'],
        'fabric': j['fabric'],
        'badgeType': j['badgeType'],
        'story': j['story'],
        'specs': [
            {'label': 'Fabric Architecture', 'value': f"{j['weightGsm']} GSM Engineered Micro-Knit"},
            {'label': 'Seam Construction', 'value': 'Ultrasonic Bonded & Taped'},
            {'label': 'Crest Tech', 'value': j['badgeType'].split('with')[0].strip()},
            {'label': 'Thermal Regulation', 'value': 'Laser-cut Micro-venting Channels'},
            {'label': 'Fit Profile', 'value': 'Athletic Match-Day Tapered'}
        ],
        'availableSizes': ['S', 'M', 'L', 'XL', 'XXL']
    })

ts_content = f'''import {{ JerseyProduct, ActSection }} from "@/types";

export const ACTS_DATA: ActSection[] = [
  {{
    id: "act-origin",
    actNumber: "01",
    title: "ORIGIN",
    subtitle: "The Quiet Conviction",
  }},
  {{
    id: "act-struggle",
    actNumber: "02",
    title: "CRUCIBLE",
    subtitle: "The 5 AM Cold",
  }},
  {{
    id: "act-mantle",
    actNumber: "03",
    title: "THE MANTLE",
    subtitle: "The Emotional Peak",
  }},
  {{
    id: "act-collection",
    actNumber: "04",
    title: "IN STOCK",
    subtitle: "Available Matchday Kits",
  }},
];

export const JERSEYS_DATA: JerseyProduct[] = {json.dumps(jerseys, indent=2)};
'''

with open('src/data/jerseys.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f'Successfully updated src/data/jerseys.ts with {len(jerseys)} jerseys!')
