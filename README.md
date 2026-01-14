# RSVP Reader

A modern browser extension that helps you read faster using Rapid Serial Visual Presentation (RSVP) technology. Display words one at a time to increase reading speed and comprehension.

## Features

- **Speed Reading**: Display words at custom speeds (10-1000 WPM)
- **Smart Word Display**: Optimized Recognition Point (ORP) highlighting for natural reading
- **Keyboard Controls**: Space to play/pause, arrows to adjust speed, R to reset
- **File Support**: Upload .txt files for extended reading sessions
- **Browser Integration**: Use the extension icon to capture text from any webpage
- **Light/Dark Mode**: Toggle between themes for comfortable reading
- **Progress Tracking**: Visual progress bar and time statistics

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rsvp-extension.git
cd rsvp-extension
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Build for production:
```bash
bun run build
```

### Browser Extension

1. Run `bun run build` to create the production build
2. Load the extension in your browser:
   - Chrome/Edge: Navigate to `chrome://extensions/` and enable "Developer mode"
   - Firefox: Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load unpacked" and select the `dist` folder

## Usage

### Basic Reading

1. **Paste Text**: Click "Settings" and paste your text into the input area
2. **Upload File**: Or upload a .txt file using the file input
3. **Start Reading**: Click the "Start" button or press Space
4. **Adjust Speed**: Use the speed slider or arrow keys (↑/↓)

### Browser Integration

1. Navigate to any webpage with text you want to read
2. Click the extension icon in your browser toolbar
3. The text will be captured and loaded into the reader
4. Start reading immediately!

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ↑ | Increase speed |
| ↓ | Decrease speed |
| R | Reset to beginning |

### Click to Toggle

Click anywhere on the word display area to quickly play/pause reading.

## Technical Details

### ORP (Optimized Recognition Point)

The reader calculates the optimal pivot point in each word to minimize eye movement:

- 1 letter: First character
- 2-5 letters: Second character
- 6-9 letters: Third character
- 10-13 letters: Fourth character
- 14+ letters: Fifth character

The pivot character is highlighted in red for easy recognition.

### Project Structure

```
rsvp-extension/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── public/
│   └── background.js    # Chrome extension background script
├── dist/                # Production build output
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Chrome Storage API** - For browser extension integration
- **Vanilla CSS** - Styling with CSS custom properties

## Development

### Available Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Run ESLint
```

### Building as Extension

The project is configured to build as both a web application and browser extension. When building as an extension:

1. Update the `manifest.json` in `public/` with your extension details
2. The background script in `public/background.js` handles text capture from webpages
3. Build output in `dist/` can be loaded as an unpacked extension

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
