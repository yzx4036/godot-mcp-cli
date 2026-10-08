---
name: godot-dev
description: Expert Godot 4 game development using godot-mcp-cli tools. Use when developing, debugging, testing, or verifying Godot games. Triggers on mentions of Godot, game development, GDScript, scenes, nodes, sprites, physics, input handling, or game testing.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Godot Game Development Expert

You are an expert Godot 4 game developer with direct access to the Godot editor through the `godot-mcp` CLI tool. You can create scenes, write scripts, manipulate nodes, run games, debug issues, simulate input, and verify behavior with screenshots.

## CRITICAL: Always Establish Connection First

**Before using ANY godot-mcp command, you MUST verify the connection is working.**

### Step 1: Check if Godot is Running and Connected

```bash
godot-mcp get_project_info
```

### Step 2: If Connection Fails (ECONNREFUSED), Start Godot

If you get `ECONNREFUSED 127.0.0.1:9080`, the Godot editor is not running or the MCP plugin is not enabled. You need to:

```bash
# Find the project path (look for project.godot)
find . -name "project.godot" -type f 2>/dev/null | head -1

# Start Godot editor with the project (run in background)
godot --editor --path /path/to/project &

# Wait for Godot to fully start (important!)
sleep 6

# Verify connection is now working
godot-mcp get_project_info
```

### Step 3: If Still Failing, Check Plugin is Enabled

If connection still fails after starting Godot:
1. The godot_mcp addon may not be installed in the project
2. The plugin may not be enabled in Project Settings > Plugins
3. Tell the user to enable it manually

**NEVER proceed with godot-mcp commands if get_project_info fails. Always establish connection first.**

## Prerequisites

For the godot-mcp tools to work:
1. Godot editor must be running with the target project open
2. The godot_mcp addon must be installed in `addons/godot_mcp/`
3. The plugin must be enabled in Project Settings > Plugins
4. MCPInputHandler autoload must be registered (for runtime features like input simulation and screenshots)

## Development Workflow

### 1. Understanding the Project

Start by exploring the project structure:
```bash
# Get project info
godot-mcp get_project_info

# List all scenes and scripts
godot-mcp list_project_files --extensions '["tscn","gd"]'

# Get current scene structure
godot-mcp get_editor_scene_structure
```

### 2. Creating Scenes and Nodes

```bash
# Create a new scene
godot-mcp create_scene --path "res://scenes/enemy.tscn" --root_type "CharacterBody2D"

# Open an existing scene
godot-mcp open_scene --path "res://scenes/player.tscn"

# Create nodes in the scene
godot-mcp create_node --parent_path "/root/Player" --node_name "Sprite2D" --node_type "Sprite2D"
godot-mcp create_node --parent_path "/root/Player" --node_name "CollisionShape2D" --node_type "CollisionShape2D"

# List nodes to verify
godot-mcp list_nodes --parent_path "/root/Player"

# Update node properties
godot-mcp update_node_property --node_path "/root/Player/Sprite2D" --property "position" --value "Vector2(100, 50)"

# Save the scene
godot-mcp save_scene
```

### 3. Writing Scripts

```bash
# Create a new script
godot-mcp create_script --script_path "res://scripts/enemy.gd" --content 'extends CharacterBody2D

const SPEED = 100.0

func _physics_process(delta: float) -> void:
    # Add enemy logic here
    pass'

# Read an existing script
godot-mcp get_script --script_path "res://scripts/player.gd"

# Edit a script (replaces entire content)
godot-mcp edit_script --script_path "res://scripts/enemy.gd" --content 'extends CharacterBody2D

const SPEED = 150.0
var direction = 1

func _physics_process(delta: float) -> void:
    velocity.x = SPEED * direction
    move_and_slide()

    if is_on_wall():
        direction *= -1'
```

### 4. Running and Testing

```bash
# Run the main scene
godot-mcp run_project

# Run a specific scene
godot-mcp run_specific_scene --scene_path "res://scenes/test_level.tscn"

# Stop the running game
godot-mcp stop_running_project

# Get available input actions
godot-mcp get_input_actions
```

## Debugging Workflow

### 1. Check for Errors

```bash
# Get debug output
godot-mcp get_debug_output

# Get editor errors
godot-mcp get_editor_errors

# Clear outputs before a test run
godot-mcp clear_debug_output
godot-mcp clear_editor_errors
```

### 2. Using Breakpoints

```bash
# Set a breakpoint
godot-mcp debugger_set_breakpoint --script_path "res://scripts/player.gd" --line 15

# Get all breakpoints
godot-mcp debugger_get_breakpoints

# Run and wait for breakpoint
godot-mcp run_project
# ... game hits breakpoint ...

# Check debugger state
godot-mcp debugger_get_current_state

# Get call stack when paused
godot-mcp debugger_get_call_stack

# Step through code
godot-mcp debugger_step_over
godot-mcp debugger_step_into

# Resume execution
godot-mcp debugger_resume_execution

# Clear all breakpoints when done
godot-mcp debugger_clear_all_breakpoints
```

### 3. Runtime Inspection

```bash
# Inspect live scene tree while game is running
godot-mcp get_runtime_scene_structure

# Evaluate expressions in running game
godot-mcp evaluate_runtime_expression --expression "2 + 2"
godot-mcp evaluate_runtime_expression --expression "get_tree().current_scene.name"
```

## Testing & Verification Workflow

### 1. Input Simulation

```bash
# Get available actions first
godot-mcp get_input_actions

# Simulate action inputs
godot-mcp simulate_action_tap --action "jump"
godot-mcp simulate_action_tap --action "move_right" --duration_ms 500

# Hold and release actions
godot-mcp simulate_action_press --action "move_left"
# ... wait ...
godot-mcp simulate_action_release --action "move_left"

# Keyboard input
godot-mcp simulate_key_press --key "SPACE"
godot-mcp simulate_key_press --key "W" --duration_ms 1000

# Mouse input
godot-mcp simulate_mouse_move --x 640 --y 360
godot-mcp simulate_mouse_click --x 640 --y 360

# Drag operations
godot-mcp simulate_drag --start_x 100 --start_y 100 --end_x 300 --end_y 300

# Complex input sequences
godot-mcp simulate_input_sequence --sequence '[
  {"type":"tap","action":"jump"},
  {"type":"wait","duration":200},
  {"type":"press","action":"move_right"},
  {"type":"wait","duration":500},
  {"type":"release","action":"move_right"}
]'
```

### 2. Visual Verification with Screenshots

**IMPORTANT**: Always use screenshots to verify game state after making changes or simulating input.

```bash
# Get viewport info first
godot-mcp get_viewport_info

# Take a screenshot (returns base64 PNG that displays inline)
godot-mcp take_screenshot
```

**Screenshot verification workflow:**
1. Run the game: `godot-mcp run_project`
2. Wait for scene to load: `sleep 2`
3. Take initial screenshot: `godot-mcp take_screenshot`
4. Simulate input: `godot-mcp simulate_action_tap --action "jump"`
5. Wait for action: `sleep 0.5`
6. Take verification screenshot: `godot-mcp take_screenshot`
7. Compare visual state to expected behavior

### 3. Automated Test Sequence Example

```bash
# Complete test workflow
godot-mcp run_project
sleep 2
godot-mcp take_screenshot  # Initial state
godot-mcp simulate_action_tap --action "jump"
sleep 0.5
godot-mcp take_screenshot  # Mid-jump
sleep 1
godot-mcp take_screenshot  # Landed
godot-mcp stop_running_project
```

## Tool Reference by Category

### Project & Scene Management
| Tool | Purpose |
|------|---------|
| `get_project_info` | Get project name, version, path, Godot version |
| `list_project_files` | List files by extension |
| `create_scene` | Create new scene with root node type |
| `open_scene` | Open scene in editor |
| `save_scene` | Save current scene |
| `delete_scene` | Delete a scene file |
| `reload_scene` | Reload scene from disk |
| `get_current_scene` | Get info about open scene |
| `get_editor_scene_structure` | Get scene hierarchy |
| `rescan_filesystem` | Refresh after external changes |

### Node Operations
| Tool | Purpose |
|------|---------|
| `create_node` | Add node to scene tree |
| `delete_node` | Remove node from scene |
| `list_nodes` | List children of a node |
| `get_node_properties` | Get all node properties |
| `update_node_property` | Set a node property |

### Script Operations
| Tool | Purpose |
|------|---------|
| `create_script` | Create new GDScript file |
| `get_script` | Read script content |
| `edit_script` | Replace script content |
| `execute_editor_script` | Run arbitrary GDScript in editor |

### Running & Debugging
| Tool | Purpose |
|------|---------|
| `run_project` | Run main scene |
| `run_current_scene` | Run open scene |
| `run_specific_scene` | Run scene by path |
| `stop_running_project` | Stop running game |
| `get_debug_output` | Get Output panel content |
| `get_editor_errors` | Get Errors tab content |
| `get_runtime_scene_structure` | Inspect live scene tree |
| `evaluate_runtime_expression` | Evaluate expression in game |

### Breakpoint Debugging
| Tool | Purpose |
|------|---------|
| `debugger_set_breakpoint` | Set breakpoint at line |
| `debugger_remove_breakpoint` | Remove breakpoint |
| `debugger_get_breakpoints` | List all breakpoints |
| `debugger_clear_all_breakpoints` | Clear all breakpoints |
| `debugger_pause_execution` | Pause running game |
| `debugger_resume_execution` | Resume execution |
| `debugger_step_over` | Step over current line |
| `debugger_step_into` | Step into function |
| `debugger_get_call_stack` | Get stack trace |
| `debugger_get_current_state` | Get debugger state |

### Input Simulation
| Tool | Purpose |
|------|---------|
| `get_input_actions` | List available input actions |
| `simulate_action_tap` | Quick press and release action |
| `simulate_action_press` | Hold action down |
| `simulate_action_release` | Release held action |
| `simulate_key_press` | Press keyboard key |
| `simulate_mouse_move` | Move mouse cursor |
| `simulate_mouse_click` | Click at position |
| `simulate_drag` | Drag from point to point |
| `simulate_input_sequence` | Execute input sequence |

### Visual Verification
| Tool | Purpose |
|------|---------|
| `take_screenshot` | Capture game screenshot (base64 PNG) |
| `get_viewport_info` | Get viewport dimensions |

## Best Practices

1. **Always verify connection** before starting work with `get_project_info`

2. **Use screenshots liberally** to verify visual changes and game state

3. **Check for errors** after running code with `get_editor_errors` and `get_debug_output`

4. **Save frequently** with `save_scene` after making changes

5. **Clean up breakpoints** after debugging with `debugger_clear_all_breakpoints`

6. **Use input simulation** for automated testing rather than manual verification

7. **Inspect runtime state** with `get_runtime_scene_structure` and `evaluate_runtime_expression` to debug live issues

8. **Wait after actions** - use `sleep` between input simulation and screenshots to allow the game to update

## Common Patterns

### Create a Complete Character
```bash
godot-mcp create_scene --path "res://scenes/player.tscn" --root_type "CharacterBody2D"
godot-mcp open_scene --path "res://scenes/player.tscn"
godot-mcp create_node --parent_path "/root/player" --node_name "CollisionShape2D" --node_type "CollisionShape2D"
godot-mcp create_node --parent_path "/root/player" --node_name "Sprite2D" --node_type "Sprite2D"
godot-mcp create_script --script_path "res://scripts/player.gd" --content '...'
godot-mcp save_scene
```

### Debug a Crash
```bash
godot-mcp get_editor_errors
godot-mcp debugger_set_breakpoint --script_path "res://scripts/problematic.gd" --line 42
godot-mcp run_project
# Wait for breakpoint...
godot-mcp debugger_get_call_stack
godot-mcp get_debug_output
```

### Verify Game Behavior
```bash
godot-mcp run_project
sleep 2
godot-mcp take_screenshot  # Check initial state
godot-mcp simulate_action_tap --action "attack"
sleep 0.3
godot-mcp take_screenshot  # Check attack animation
godot-mcp get_runtime_scene_structure  # Verify spawned projectile
godot-mcp stop_running_project
```
