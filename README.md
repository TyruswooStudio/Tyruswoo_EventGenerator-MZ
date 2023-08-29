# Tyruswoo Event Generator for RPG Maker MZ

Generate events at runtime (during gameplay)!

Generated events are modeled after events from other maps.

Event locations, quantity of events, and which events to generate defined by you, or randomized according to your preferences!

## Generating Events from Models

Generated events are modeled after events from other maps. Locations for
newly generated events can be determined by coordinates, by region(s), or by
area. The quantity of events generated can be determined by a quantity
formula, so that multiple events can generate simultaneously from one plugin
command.

If there are multiple designated models, one model is selected at random for
each event spawned. If there are multiple valid spawn locations, one of the
valid locations is selected at random for each spawned event.

## Plugin Commands

### Generate Event(s)
This plugin command allows you to spawn events!
Duplicates a model event from any other map, and places the new event in the
current map, at the desired location!

Generate Event(s) arguments:
- **Model Event(s)**: A list of event ID numbers and/or event names that may
  be generated. Each time an event generates, a random model is selected.
  Event models in this list all come from default map
  (as defined in the plugin parameters).
- **Model Event(s) from Maps**: Allows using event models from any map.
  Events from multiple different maps can all be used as models simultaneously.
  Combines with the Default Model Map's model event(s) list (see above).
    - Model Map ID: Map ID of any map, to use for model event.
      (If not entered, uses Default Model Map.)
    - Model Event: The event ID number and/or event name of this model event.
- **Loc**: Criteria for valid location(s) where event(s) may spawn.
    - X: X coordinate of origin (may be relative).
    - Y: Y coordinate of origin (may be relative).
    - Location Mode: Coordinates, Region, or Area
       * Region(s): If region mode, use region(s) listed here.
       * Area: If area mode, use the defined area.
          - X1: First X coord of area (may be relative).
          - Y1: First Y coord of area (may be relative).
          - X2: Second X coord of area (may be relative).
          - Y2: Second Y coord of area (may be relative).
    - Relativity: How to interpret the origin coordinates.
       * Relativity Mode: Absolutes, or relative to event or player.
          - Event ID: Loc relative to event of this event ID.
          - Party Member: Loc relative to selected party member.
          - Orientational Shift: Shift loc based on character's direction.
             * Forward Shift: Shift dir character is facing (- backward).
             * Rightward Shift: Shift toward right of character (- left).
    - Gen on Blocked Tiles: Whether to allow spawns on impassible tiles.
    - Gen on Walls: Whether to allow spawns on tops of walls.
    - Gen on Solid Events: Whether to allow spawns on other solid events.
    - Gen on Player: Whether to allow spawns on player/followers.
    - Min Player Distance: Only allows spawns at least this distance
      number of tiles away from player.
- **Quantity**: Determines number of events to spawn.
    - Maximum: Maximum number of events to spawn.
    - Minimum: Minimum number of events to spawn.
    - Formula: Formula determines how many events spawn.
      (Note that Slain in formula by default is number of events ever slain
      in the map. If only one region is being used for this command's event
      generation, then map's regional slain count is used in formula.)
       * Slain Name: If using Slain in formula, then this name specifies 
         a single enemy name that is used for calculations.
         Slain of other names will be ignored for calculations.

### Add Slain
Add 1 to the map's current slain count. Always adds 1 to total slain of the
current save file.

This is useful in order to change the Slain count, if a Formula uses Slain
count for determining number of events to generate.

Add Slain arguments:
- **Map ID**: Map ID to which one slain is added. Defaults to the map ID of the
  event that is running the plugin command (which is always current map).
- **Event Name**: Event name to which one slain is added.
  Defaults to the name of the event that is running the plugin command.
- **Generation Region**: Region to which one slain is added (for the current map).
  Defaults to the region in which the current event was purposefully generated.
  (To be considered a purposeful regional generation, a generated event must be 
  spawned using a location mode of Region, and there must have been only 1 region
  in the Region(s) list.)

## Plugin parameters

| Parameter                | Description                                     |
|--------------------------|-------------------------------------------------|
| Default Model Map        |  When a model does not specify a model map ID, use this default model map ID. |
| Gen on Blocked Tiles     | Generated events may spawn on impassible tiles. |
| Gen on Walls             | Generated events may spawn on top of walls.     |
| Gen on Solid Events      | Generated events may spawn on other events.     |
| Gen on Player            | Generated events may spawn on player/followers. |
| Min Player Distance      | Generated events only can spawn if at least this many tiles away from player. |
| Default Quantity Formula | When the Generate Event(s) plugin command does not specify quantity formula, use this formula. |
| Default Maximum          | Default number of events to spawn each time a Generate Event(s) command runs. |
| Default Minimum          | Default minimum number of events to spawn each time a Generate Event(s) command runs. Even if formula determines a lesser quantity, at least the minimum quantity of events will be generated. |

## Script calls

This first script call can be used to generate an event without using the
plugin command Generate Event(s). However, the plugin command makes it much
easier to change the location and quantity of events created, and therefore
the plugin command is highly recommended. However, this script call is here
in case you would like to use it.

`$gameMap.generateEvent(modelMapId, modelEventId, x, y, genRegion)`
* Where modelMapId is the ID number of the model map; modelEventId is
   the ID number of the model event (from the model map); x and y are the
   absolute coordinates on the current map, at which to place the newly
   generated event; and genRegion is the ID number of the region that claims
   this generated event (region from 1 to 255; leave blank or 0 for no
   region). This plugin command generates/spawns an event at absolute
   coordinates (x, y) on the current map. The event generated is based on
   the model event. The model event is found on the map with ID number of
   modelMapId, with an eventId of modelEventId. The genRegion (Generation
   Region) is used in assigning the generated event to a Slain region, if
   it ever runs the Add Slain command.

Note that the following script calls are most useful within Conditional
Branches that make changes in what occurs based on number of slain events.

`$gameSystem.slain()`
* Returns the total number of Slain (in the current save file).

`$gameSystem.slain(mapId)`
* Where mapId is a number of the desired map. Returns the number of slain
  in the current map (for the current save file).

`$gameSystem.slain(mapId, regionId)`
* Where mapId is a number ID of a map and regionId is a region (1 to 255).
  Returns number of slain of the specified region of the specified map.
  (Only includes slain if generated events were purposefully generated
  into that single region, or if Add Slain command specified the region.)

`$gameSystem.slain(mapId, 0, "eventName")`
* Where mapId is a number of a map, regionId is 0 (to be ignored), and
  eventName is the name of the slain events. Returns number of slain in the
  map that had the specified name. (Ignores regions.)

`$gameSystem.slain(mapId, regionId, "eventName")`
* Where mapId is a number ID of a map, regionId is a region number (1 to
  255), and eventName is the name of the slain events. Returns number of
  slain in specified region of specified map, only if the slain events
  had the specified name. (Only includes slain if generated events were
  purposefully generated into that single region, or if Add Slain command
  specified the region.)

`$gameSystem.slain(0, 0, "eventName")`
* Where eventName is the name of the slain events. mapId is 0 (to be
  ignored), and regionId is 0 (to also be ignored). Returns number of slain
  from any map that had the specified name.

In some cases, you might only want the event to do something if the event
was generated by the Event Generator plugin. For example, you might only
want to add to the slain count if the event was generated. For this reason,
the following script calls are available. Use one of these scripts inside
a Conditional Branch to make it only happen when the event was generated.

`$gameMap.eventWasGenerated()`
* Checks if the map's currently active event was generated, and returns
  true or false.

`$gameMap.enemyWasGenerated()`
* Same as $gameMap.eventWasGenerated(). Checks if the map's currently
  active event was generated, and returns true or false.

If you are using the Troop Control plugin, you might want to vary your
troop's enemies depending on the name of the currently active event. For
this reason, the following script calls are available. You can put these
script calls within your troop's commands to check the current
on-map-event's name, in order to determine which enemies to add using
Troop Control.

`$gameMap.eventName()`
* Gets the name of the map's currently active event.

`$gameMap.enemyName()`
* This is the same as $gameMap.eventName(). It gets the name of the map's
  currently active event. This function exists to make the troop's script
  calls easier to understand for game designers.

## Basics of how to use this plugin
1. Install the plugin, and activate it using your project's Plugin Manager.
2. Define which map you want to be the Default Model Map where most of your
   model events will be found. You can define this in the plugin parameters.
3. Somewhere on your map, run the Generate Event(s) plugin command.
    * Be sure to select at least one model event. You can either use the
      model's event ID number, or the name of the event.
    * Be sure to define the location at which the event should spawn. The
      location may be Coordinates, Region, or Area. Keep in mind that by
      default, the events do not spawn on other solid events or other solid
      tiles, or on the player. So, make sure that there is at least one
      valid spawn location, so that the event can spawn.
    * The Quantity is by default 1. If you want to change the number of
      events to spawn, you can do so by changing the Quantity arguments.

## Advanced uses for this plugin

### Randomly generated on-map enemies!
1. When the player enters a new map, have an Autorun event that spawns in
   events, with each event representing a troop. (The Autorun event will
   need to use the Erase event command to disappear after done generating
   events.) Using location mode of Region can be useful for indicating
   numerous valid spawn locations, but Area also can be used.
2. Make sure the model events use the "Battle Processing..." event
   command. Now you have on-map enemies that are randomly generated each
   time the player enters the map!
3. Optional: If the player wins the battle, then use the Add Slain
   plugin command to keep track of how many enemies were slain in the
   current map where the player fought the battle. This allows you to
   use a formula incorporating the Slain count to determine the number of
   events to generate next time event generation occurs on the current
   map.
   
### Use the Slain feature to make the number of generated events change!
Use the Add Slain plugin command to increase the number of slain on
the current map. Then, make sure that your Generate Event(s) plugin
command uses a formula that incorporates the number of slain.
* For example, the "Maximum - Slain" formula will make 1 less event
  appear for each Add Slain plugin command that is run. This makes
  it seem like events can be cleared quickly.
* Another example: "Maximum - Slain / 2" makes the number of events
  generated decrease more gradually. So, when the player leaves a map
  and later returns, there may be fewer amounts, but the decrease is
  less drastic. This can be useful for making it seem like maps are
  slowly being cleared of events, but that the events still are
  increasing/generating while the player is gone from the map.

### Weighted event lists!
You can make a certain model be selected more often than other models!
Since models are selected randomly by the Generate Event(s) plugin,
simply duplicate the model by using Ctrl+C then Ctrl+V, and that model
will be weighted to be selected more often than other models in the
list. This is because each model entry is counted, even if it is the
same as another entry.

### Moving spawner!
Using a Generate Event(s) location mode of Area or Coordinates, you
can have an event spawner that moves!
* An event could move on its own, generating other events from itself
  while it moves.
   - A fire event could move around, with little spark events
     generating off of it!
* A spawner event could be pushed by the player, with enemies
  generating from it as it is moved. (Combine this with the Min
  Player Distance argument to make events generate slightly distant
  from the player while the player is pushing.)
   - This might be a quest to destroy a spawner by pushing it to
     a certain place on the map!
   - Imagine bandits that try to sneak up on the player whenever the
     player moves a pushable treasure!

### Script calls in Conditional Branches: Change story based on events slain!
Using script calls, you can check the number of slain in various ways.
You can use this to make any event happen differently, depending on
the number of slain! This could be total slain anywhere in the world,
number slain in a certain map, number slain of a certain region of
a map, or number slain of a certain event name!

This plugin could be used for keeping track of numbers of events slain
of various (any) names in various (any) maps or regions. Then, this
information could be used to determine story and quest components of
the game.

* For example, script calls with Conditional Branches can be used to
  make a story change happen if certain enemy names are slain
  sufficiently in a map. There may be a map full of wild beasts, but
  then if the player slays a sufficient quantity of wild beasts and
  leaves, the player may return to the map later to find a different
  enemy type (such as goblins) have made the map their home since the
  wild beasts were gone! Many such story elements can be accomplished
  by using script calls in conditional branches!

**Note:** The maximum number of events that can be placed using the 
RPG Maker MZ editor is 999 events. For this reason, events generated by
this plugin begin with eventId of 1000 and higher.

### For more help using the Event Generator plugin, see [Tyruswoo.com](https://www.tyruswoo.com).

## Version History

**v1.0**  9/28/2020
- Event Generator released for RPG Maker MZ!

**v2.0**  1/12/2023
- Events now generate 20+ times faster! Efficiency greatly improved!
- Script calls added, useful for conditional branches:
   * `$gameMap.eventWasGenerated()`
   * `$gameMap.enemyWasGenerated()`
   * `$gameMap.eventName()`
   * `$gameMap.enemyName()`
- New Feature: Shared slain count map groups. Maps in the same group
  share their slain counts.
- Bugfix: Fixed duplicative creation of sprites for events that
  already existed on the map at the time of the event generator
  function running. The bug resulted in many events (and party
  members) having decreased transparency of transparent pixels. Now,
  this bugfix results in the transparency of all sprites remaining as
  intended.
- Bugfix: Fixed a bug in which encounters belonging to a region did
  not correctly determine an eventNames index when creating a new
  slain record. This fix prevents a crash when looking up indices
  that were inadvertently created without a name or value.
- Bugfix: Fixed slain count crash that happened when player enters a
  map that didn't exist when the save file was first created.
- Code Improvement: Moderately reduced save bloat by overhauling save
  counting and replacing the array of arrays with a minimal object
  that takes multi-part keys (in a similar fashion to
  Game_SelfSwitches).

> **Remember, only you can build your dreams!**
>
> *Tyruswoo*
