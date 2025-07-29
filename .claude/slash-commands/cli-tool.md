# /cli-tool - CLI Tool Development

Build Node.js CLI tool with interactive evaluation and project generation.

## Usage
```
/cli-tool [component]
```

## Components
- `commands` - CLI command implementations
- `interface` - Interactive prompts and UX
- `generator` - Project generation from templates
- `github` - GitHub API integration for cloning
- `config` - Configuration management
- `installer` - npm package setup

## CLI Architecture
```
bin/
└── stack-eval.js           # Entry point

commands/
├── evaluate.js             # Interactive evaluation
├── generate.js             # Project generation  
├── compare.js              # Stack comparison
└── update.js               # Update templates

lib/
├── evaluation-engine.js    # Shared engine
├── cli-interface.js        # User interaction
├── project-generator.js    # Template processing
└── github-client.js        # GitHub integration
```

## Key Features
- Cross-platform support (Windows, macOS, Linux)
- Interactive prompts with validation
- Colorized output and progress indicators
- Offline capability after installation
- Scriptable for automation workflows

## User Experience
```bash
$ npm install -g @organized-ai/stack-evaluator
$ stack-eval evaluate
? What's your technical background? (Use arrow keys)
❯ Non-technical founder
  Beginner developer
  Experienced developer  
  AI/ML engineer

✨ Recommended: Next.js + Vercel AI SDK
⚡ Time: 1-3 days | 💰 Cost: $40-120/month

? Generate project now? (Y/n)
```

## Dependencies
- **Commander.js**: Command structure
- **Inquirer.js**: Interactive prompts
- **Chalk**: Terminal colors
- **Ora**: Loading spinners
- **Simple-git**: Git operations

## Integration Points
- Shared evaluation engine with web interface
- GitHub API for template cloning
- npm registry for distribution
- organized-codebase repository for templates

Use this for all CLI tool development work.
