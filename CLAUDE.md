# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based mathematical game called "Hydra数游戏" (Hydra Number Game), not a Godot project despite the directory name. It's a single-page web application built with vanilla JavaScript, HTML5, and CSS3 that demonstrates mathematical Hydra numbers (Goodstein sequences).

## Development Workflow

### Running the Game
The project includes two development server scripts:

**Windows (Batch):**
```bash
start_game.bat
```
- Option 1: Python HTTP server (port 8000)
- Option 2: Node.js http-server (port 8080)
- Option 3: Check environment

**Cross-platform (Python):**
```bash
python start_game.py
```
- Same options as batch script
- Automatically opens browser
- More features and better error handling

**Direct file access:**
```bash
# No build step required - just open index.html in browser
# Note: Some browsers restrict ES6 module loading from file:// URLs
```

### No Build System
- Pure vanilla JavaScript with ES6 modules
- No transpilation, bundling, or compilation needed
- Changes are reflected immediately when served via HTTP
- No package.json or external dependencies

## Architecture

### Module Structure
The code follows a clean separation of concerns with ES6 modules:

1. **`script.js`** - Main orchestrator
   - Initializes all modules
   - Sets up game loop
   - Entry point for the application

2. **`gameState.js`** - Core game logic and state management
   - Implements Hydra game mathematical rules
   - Manages snake counts using `Map` data structure
   - Handles attack mechanics, weapon systems, and upgrades
   - Tracks game statistics and victory conditions

3. **`uiManager.js`** - User interface controller
   - Manages DOM elements and event listeners
   - Updates visual components based on game state
   - Handles user interactions (buttons, keyboard shortcuts)
   - Implements visual effects and animations

4. **`bigNumber.js`** - Utility module for handling extremely large numbers
   - Uses JavaScript `BigInt` for mathematical operations
   - Provides number formatting (scientific notation, Chinese units, etc.)
   - Exports functions like `formatNumber()`, `addBigInt()`, `multiplyBigInt()`

### Key Architectural Patterns

**State Management:**
- Centralized `GameState` class with immutable operations
- Performance optimization using counting scheme instead of individual snake objects
- All calculations use `BigInt` to avoid overflow

**Weapon System:**
- Two weapon types: 剑/sword and 锤/hammer with different mechanics
- Attack power can be upgraded using in-game currency (gold)
- Automatic attack mode available

**UI Patterns:**
- Virtual updates to minimize DOM operations
- Event delegation for better performance
- Responsive design with CSS Grid/Flexbox
- Real-time statistics and logs

## Technical Details

### Browser Requirements
- Modern browsers (Chrome 67+, Firefox 68+, Safari 14+, Edge 79+)
- Requires ES6 module and BigInt support
- Some browsers restrict ES6 module loading from `file://` URLs (use HTTP server)

### Language and Conventions
- **Primary language**: Chinese (UI text, comments, logs)
- **Code style**: ES6+ JavaScript with classes and modules
- **Number handling**: All large numbers use `BigInt` type
- **Performance**: Optimized for handling exponentially growing numbers

### Game Mechanics
1. **Initial state**: One N-headed snake (default N=5) with HP=1
2. **Attack**: Reduces current snake's HP by 1, drops 1 scale
3. **Death**: When HP reaches 0, snake dies
4. **Splitting**: N-headed snake death creates (N-1)-headed snakes equal to dropped scales
5. **Global effect**: Each attack increases HP cap of all snakes (including future ones)
6. **Attack order**: After current snake dies, attack snake with fewest heads
7. **Victory**: All snakes dead

### Keyboard Shortcuts
- **Space**: Quick attack
- **Ctrl+R**: Reset game
- **Ctrl+A**: Toggle auto-attack

## Development Notes

### Testing
- No formal test framework
- Test by running the game and observing behavior
- Use browser developer tools for debugging
- Console logs provide game state information

### Common Development Tasks

**Adding new features:**
1. Modify `gameState.js` for game logic changes
2. Update `uiManager.js` for UI changes
3. Add new functions to `bigNumber.js` for number handling
4. Import modules in `script.js` if needed

**Debugging:**
- Check browser console for errors
- Game state is logged to console
- Use `gameState.addLog()` for in-game debugging messages

**Performance optimization:**
- Snake counting algorithm in `gameState.js` is critical
- Minimize DOM updates in `uiManager.js`
- Use `BigInt` for all mathematical operations

### File Dependencies
```
index.html → script.js → gameState.js
                          uiManager.js
                          bigNumber.js
```

All JavaScript files use ES6 module imports/exports. The `index.html` loads `script.js` with `type="module"`.

## Important Considerations

1. **This is NOT a Godot project** despite the directory name
2. **No build step** - development is edit-and-refresh
3. **Chinese language** used throughout (preserve in UI text)
4. **BigInt required** - all number operations use BigInt to avoid overflow
5. **Exponential growth** - numbers can become extremely large quickly
6. **Performance critical** - algorithm efficiency matters for large numbers

## Recent Development Focus

Based on git history, recent work includes:
- Weapon system implementation and fixes
- Snake death text display improvements
- Snake status and HP display updates
- Attack visual effects
- Weapon upgrade functionality
- Snake animation optimizations