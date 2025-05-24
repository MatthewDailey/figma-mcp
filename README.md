# Figma MCP Server
[![smithery badge](https://smithery.ai/badge/@MatthewDailey/figma-mcp)](https://smithery.ai/server/@MatthewDailey/figma-mcp)

A [ModelContextProtocol](https://modelcontextprotocol.io) server that enables AI assistants to interact with Figma files. This server provides tools for viewing, commenting, and analyzing Figma designs directly through the ModelContextProtocol.

## Features

- Add a Figma file to your chat with Claude by providing the url
- Read and post comments on Figma files

## Setup with Claude

### Installing via Smithery

To install Figma MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@MatthewDailey/figma-mcp):

```bash
npx -y @smithery/cli install @MatthewDailey/figma-mcp --client claude
```

1. Download and install Claude desktop app from [claude.ai/download](https://claude.ai/download)

2. Get a Figma API Key (figma.com -> click your name top left -> settings -> Security). Grant `File content` and `Comments` scopes.

2. Configure Claude to use the Figma MCP server. If this is your first MCP server, run the following in terminal.

```bash
echo '{
  "mcpServers": {
    "figma-mcp": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}' > ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

If it's not, copy the `figma-mcp` block to your `claude_desktop_config.json`

3. Restart Claude Desktop.

4. Look for the hammer icon with the number of available tools in Claude's interface to confirm the server is running.

## Example usage

Start a new chat with claude desktop and paste the following

```
What's in this figma file?

https://www.figma.com/design/MLkM98c1s4A9o9CMnHEyEC
```

## Demo of a more realistic usage

https://www.loom.com/share/0e759622e05e4ab1819325bcf6128945?sid=bcf6125b-b5de-4098-bf81-baff157e3dc3

## Development Setup

### Running with Inspector

For development and debugging purposes, you can use the MCP Inspector tool. The Inspector provides a visual interface for testing and monitoring MCP server interactions.

Visit the [Inspector documentation](https://modelcontextprotocol.io/docs/tools/inspector) for detailed setup instructions and usage guidelines.

The command to test locally with Inspector is
```
npx @modelcontextprotocol/inspector npx figma-mcp
```

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Build the project:
```bash
npm run build
```
4. For development with auto-rebuilding:
```bash
npm run watch
```

## Available Tools

The server provides the following tools:

- `add_figma_file`: Add a Figma file to your context by providing its URL
- `view_node`: Get a thumbnail for a specific node in a Figma file
- `read_comments`: Get all comments on a Figma file
- `post_comment`: Post a comment on a node in a Figma file
- `reply_to_comment`: Reply to an existing comment in a Figma file

Each tool is designed to provide specific functionality for interacting with Figma files through the ModelContextProtocol interface.
