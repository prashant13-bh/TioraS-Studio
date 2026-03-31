import { NextRequest, NextResponse } from 'next/server';

// Simulated AI-generated design URLs (high-quality placeholder images)
const DESIGN_PRESETS: Record<string, string[]> = {
  anime: [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1611457194403-d3f2cf9d90f4?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=512&h=512&fit=crop',
  ],
  minimal: [
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=512&h=512&fit=crop',
  ],
  streetwear: [
    'https://images.unsplash.com/photo-1561740038-5c7a5dce8d2a?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=512&h=512&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=512&h=512&fit=crop',
  ],
};

const LOADING_MESSAGES = [
  'Analyzing your creative vision...',
  'Threading the digital needle...',
  'Mixing pigments in AI color lab...',
  'Rendering fabric textures...',
  'Applying artistic filters...',
  'Perfecting the final details...',
];

function detectCategory(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('anime') || lower.includes('manga') || lower.includes('japan')) return 'anime';
  if (lower.includes('minimal') || lower.includes('clean') || lower.includes('simple')) return 'minimal';
  if (lower.includes('street') || lower.includes('urban') || lower.includes('graffiti')) return 'streetwear';
  return 'default';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A design prompt is required.' }, { status: 400 });
    }

    // Simulate AI generation delay (3-5 seconds)
    const delay = 3000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const category = style || detectCategory(prompt);
    const images = DESIGN_PRESETS[category] || DESIGN_PRESETS.default;

    // Pick 2-4 random results
    const count = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...images].sort(() => Math.random() - 0.5).slice(0, count);

    return NextResponse.json({
      success: true,
      prompt,
      style: category,
      results: shuffled.map((url, i) => ({
        id: `gen_${Date.now()}_${i}`,
        url,
        label: `Variation ${i + 1}`,
      })),
      loadingMessages: LOADING_MESSAGES,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed.' }, { status: 500 });
  }
}
