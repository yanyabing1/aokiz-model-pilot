# Claude Configuration Manager

A Next.js application for managing Claude AI global configuration on your local machine.

## Features

- **Model Settings**: Configure model selection, temperature, max tokens, and top-p values
- **System Prompt**: Set custom system prompts for Claude
- **Appearance**: Choose between light, dark, or system theme
- **Editor Settings**: Configure tab size, word wrap, and line numbers
- **Auto-save**: Enable automatic saving of configurations
- **Real-time Updates**: Changes are saved to `~/.claude/claude-config.json`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration File

The application manages a configuration file located at `~/.claude/claude-config.json` with the following structure:

```json
{
  "model": "claude-3-sonnet-20240229",
  "temperature": 0.7,
  "max_tokens": 40960,
  "top_p": 1,
  "system_prompt": "",
  "auto_save": true,
  "theme": "system",
  "editor_settings": {
    "tab_size": 2,
    "word_wrap": true,
    "line_numbers": true
  }
}
```

## API Endpoints

- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint