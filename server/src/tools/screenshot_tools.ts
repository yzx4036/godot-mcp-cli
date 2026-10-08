// File: /server/src/tools/screenshot_tools.ts
import { z } from 'zod';
import { getGodotConnection } from '../utils/godot_connection.js';
import { MCPTool } from '../utils/types.js';

/**
 * Screenshot tools for capturing game visuals during testing.
 * These tools allow AI agents to take and view screenshots of running Godot games,
 * enabling visual verification and debugging during automated testing.
 */

interface ScreenshotResult {
  success?: boolean;
  error?: string;
  image_base64?: string;
  width?: number;
  height?: number;
  format?: string;
}

function formatScreenshotResult(result: ScreenshotResult): string {
  if (!result.success) {
    return `Screenshot failed: ${result.error || 'Unknown error'}`;
  }

  if (!result.image_base64) {
    return 'Screenshot captured but no image data returned.';
  }

  // Return the image as a data URL that can be rendered by AI assistants
  const dataUrl = `data:image/png;base64,${result.image_base64}`;

  const parts: string[] = [
    `Screenshot captured successfully.`,
    `Resolution: ${result.width}x${result.height}`,
    `Format: ${result.format || 'PNG'}`,
    ``,
    `![Game Screenshot](${dataUrl})`
  ];

  return parts.join('\n');
}

export const screenshotTools: MCPTool[] = [
  {
    name: 'take_screenshot',
    description: 'Capture a screenshot of the currently running Godot game. Returns the image as a base64-encoded PNG that can be viewed directly. Use this to verify visual state, debug rendering issues, or validate game behavior during testing.',
    parameters: z.object({}),
    execute: async (): Promise<string> => {
      const godot = getGodotConnection();

      try {
        const result = await godot.sendCommand('take_screenshot', {}) as ScreenshotResult;
        return formatScreenshotResult(result);
      } catch (error) {
        throw new Error(`Failed to take screenshot: ${(error as Error).message}`);
      }
    }
  },
  {
    name: 'get_viewport_info',
    description: 'Get information about the game viewport dimensions and configuration. Useful for understanding screen coordinates before interacting with the game.',
    parameters: z.object({}),
    execute: async (): Promise<string> => {
      const godot = getGodotConnection();

      try {
        const result = await godot.sendCommand('get_viewport_info', {}) as {
          success?: boolean;
          error?: string;
          width?: number;
          height?: number;
          content_scale_mode?: string;
          content_scale_aspect?: string;
          transparent_bg?: boolean;
        };

        if (!result.success) {
          return `Failed to get viewport info: ${result.error || 'Unknown error'}`;
        }

        const lines = [
          'Viewport Information:',
          `  Size: ${result.width}x${result.height}`,
          `  Scale Mode: ${result.content_scale_mode || 'unknown'}`,
          `  Aspect Ratio: ${result.content_scale_aspect || 'unknown'}`,
          `  Transparent Background: ${result.transparent_bg ?? false}`
        ];

        return lines.join('\n');
      } catch (error) {
        throw new Error(`Failed to get viewport info: ${(error as Error).message}`);
      }
    }
  }
];
