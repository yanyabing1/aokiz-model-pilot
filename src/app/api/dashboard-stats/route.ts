import { NextRequest, NextResponse } from 'next/server';
import { ConfigManager } from '@/lib/config-server';
import { ClaudeConfig } from '@/lib/config';

export async function GET() {
  try {
    const configManager = ConfigManager.getInstance();
    const config = await configManager.loadConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const config: Partial<ClaudeConfig> = await request.json();
    const configManager = ConfigManager.getInstance();
    const updatedConfig = await configManager.updateConfig(config);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}