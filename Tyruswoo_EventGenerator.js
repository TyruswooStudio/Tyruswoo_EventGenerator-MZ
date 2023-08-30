//=============================================================================
// Event Generator
// For RPG Maker MZ
// By Kathy "McKathlin" Bunn and Scott Tyrus "Tyruswoo" Washburn
//=============================================================================

/*
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var Imported = Imported || {};
Imported.Tyruswoo_EventGenerator = true;

var Tyruswoo = Tyruswoo || {};
Tyruswoo.EventGenerator = Tyruswoo.EventGenerator || {};

/*:
 * @target MZ
 * @plugindesc MZ v2.0.1 Generate events during gameplay! Model events from any map. Use formulas to determine quantity to generate.
 * @author McKathlin and Tyruswoo
 * @url https://www.tyruswoo.com
 *
 * @help Tyruswoo Event Generator for RPG Maker MZ
 * ============================================================================
 * This plugin makes it possible to generate events at runtime (during
 * gameplay).
 *
 * Generated events are modeled after events from other maps. Locations for
 * newly generated events can be determined by coordinates, by region(s), or by
 * area. The quantity of events generated can be determined by a quantity
 * formula, so that multiple events can generate simultaneously from one plugin
 * command.
 *
 * If there are multiple designated models, one model is selected at random for
 * each event spawned. If there are multiple valid spawn locations, one of the
 * valid locations is selected at random for each spawned event.
 * ============================================================================
 * Plugin commands, their arguments, and short explanations:
 * 
 * Generate Event(s)                This plugin command allows you to spawn
 *                                  events! Duplicates a model event from any
 *                                  other map, and places the new event in the
 *                                  current map, at the desired location!
 *  - Model Event(s)                A list of event ID numbers and/or event
 *                                  names that may be generated. Each time an
 *                                  event generates, a random model is
 *                                  selected. Event models in this list all
 *                                  come from default map (as defined in the
 *                                  plugin parameters).
 *  - Model Event(s) from Maps      Allows using event models from any map.
 *                                  Events from multiple different maps can all
 *                                  be used as models simultaneously. Combines
 *                                  with the Default Model Map's model event(s)
 *                                  list (see above).
 *     > Model Map ID               Map ID of any map, to use for model event.
 *                                  (If not entered, uses Default Model Map.)
 *     > Model Event                The event ID number and/or event name of
 *                                  this model event.
 *  - Loc                           Criteria for valid location(s) where
 *                                  event(s) may spawn.
 *     > X                          X coordinate of origin (may be relative).
 *     > Y                          Y coordinate of origin (may be relative).
 *     > Location Mode              Coordinates, Region, or Area
 *        * Region(s)               If region mode, use region(s) listed here.
 *        * Area                    If area mode, use this area.
 *           - X1                   First X coord of area (may be relative).
 *           - Y1                   First Y coord of area (may be relative).
 *           - X2                   Second X coord of area (may be relative).
 *           - Y2                   Second Y coord of area (may be relative).
 *     > Relativity                 How to interpret the origin coordinates.
 *        * Relativity Mode         Absolutes, or relative to event or player.
 *           - Event ID             Loc relative to event of this event ID.
 *           - Party Member         Loc relative to selected party member.
 *           - Orientational Shift  Shift loc based on character's direction.
 *              > Forward Shift     Shift dir character is facing (- backward).
 *              > Rightward Shift   Shift toward right of character (- left).
 *     > Gen on Blocked Tiles       True: Allow spawns on impassible tiles.
 *     > Gen on Walls               True: Allow spawns on tops of walls.
 *     > Gen on Solid Events        True: Allow spawns on other solid events.
 *     > Gen on Player              True: Allow spawns on player/followers.
 *     > Min Player Distance        Only allows spawns at least this distance
 *                                  number of tiles away from player.
 *  - Quantity                      Determines number of events to spawn.
 *     > Maximum                    Maximum number of events to spawn.
 *     > Minimum                    Minimum number of events to spawn.
 *     > Formula                    Formula determines how many events spawn.
 *                                  (Note that Slain in formula by default is
 *                                  number of events ever slain in the map. If
 *                                  only one region is being used for this
 *                                  command's event generation, then map's
 *                                  regional slain count is used in formula.)
 *        * Slain Name              If using Slain in formula, then this name
 *                                  specifies a single enemy name that is used
 *                                  for calculations. Slain of other names will
 *                                  be ignored for calculations.
 *
 * Add Slain                    Add 1 to the map's current slain count. Always
 *                              adds 1 to total slain of the current save file.
 *                              (This is useful in order to change the Slain
 *                              count, if a Formula uses Slain count for
 *                              determining number of events to generate.)
 *  - Map ID                    Map ID to which one slain is added. Defaults to
 *                              the map ID of the event that is running the
 *                              plugin command (which is always current map).
 *  - Event Name                Event name to which one slain is added.
 *                              Defaults to the name of the event that is
 *                              running the plugin command.
 *  - Generation Region         Region to which one slain is added (for the
 *                              current map). Defaults to the region in which
 *                              the current event was purposefully generated.
 *                              (To be considered a purposeful regional
 *                              generation, a generated event must be spawned
 *                              using a location mode of Region, and there must
 *                              have been only 1 region in the Region(s) list.)
 *
 * ============================================================================
 * Plugin parameters:
 *    Default Model Map         When a model does not specify a model map ID,
 *                              use this default model map ID.
 *    Gen on Blocked Tiles      Generated events may spawn on impassible tiles.
 *    Gen on Walls              Generated events may spawn on top of walls.
 *    Gen on Solid Events       Generated events may spawn on other events.
 *    Gen on Player             Generated events may spawn on player/followers.
 *    Min Player Distance       Generated events only can spawn if at least
 *                              this many tiles away from player.
 *    Default Quantity Formula  When the Generate Event(s) plugin command does
 *                              not specify quantity formula, use this formula.
 *    Default Maximum           Default number of events to spawn each time a
 *                              Generate Event(s) command runs.
 *    Default Minimum           Default minimum number of events to spawn each
 *                              time a Generate Event(s) command runs. Even if
 *                              formula determines a lesser quantity, at least
 *                              the minimum quantity of events will be
 *                              generated.
 * ============================================================================
 * Script calls:
 *
 * This first script call can be used to generate an event without using the
 * plugin command Generate Event(s). However, the plugin command makes it much
 * easier to change the location and quantity of events created, and therefore
 * the plugin command is highly recommended. However, this script call is here
 * in case you would like to use it.
 *
 * $gameMap.generateEvent(modelMapId, modelEventId, x, y, genRegion)
 *    Where modelMapId is the ID number of the model map; modelEventId is
 *    the ID number of the model event (from the model map); x and y are the
 *    absolute coordinates on the current map, at which to place the newly
 *    generated event; and genRegion is the ID number of the region that claims
 *    this generated event (region from 1 to 255; leave blank or 0 for no
 *    region). This plugin command generates/spawns an event at absolute
 *    coordinates (x, y) on the current map. The event generated is based on
 *    the model event. The model event is found on the map with ID number of
 *    modelMapId, with an eventId of modelEventId. The genRegion (Generation
 *    Region) is used in assigning the generated event to a Slain region, if
 *    it ever runs the Add Slain command.
 *
 * Note that the following script calls are most useful within Conditional
 * Branches that make changes in what occurs based on number of slain events.
 *
 * $gameSystem.slain()
 *    Returns the total number of Slain (in the current save file).
 *
 * $gameSystem.slain(mapId)
 *    Where mapId is a number of the desired map. Returns the number of slain
 *    in the current map (for the current save file).
 *
 * $gameSystem.slain(mapId, regionId)
 *    Where mapId is a number ID of a map and regionId is a region (1 to 255).
 *    Returns number of slain of the specified region of the specified map.
 *    (Only includes slain if generated events were purposefully generated
 *    into that single region, or if Add Slain command specified the region.)
 *
 * $gameSystem.slain(mapId, 0, "eventName")
 *    Where mapId is a number of a map, regionId is 0 (to be ignored), and
 *    eventName is the name of the slain events. Returns number of slain in the
 *    map that had the specified name. (Ignores regions.)
 *
 * $gameSystem.slain(mapId, regionId, "eventName")
 *    Where mapId is a number ID of a map, regionId is a region number (1 to
 *    255), and eventName is the name of the slain events. Returns number of
 *    slain in specified region of specified map, only if the slain events
 *    had the specified name. (Only includes slain if generated events were
 *    purposefully generated into that single region, or if Add Slain command
 *    specified the region.)
 *
 * $gameSystem.slain(0, 0, "eventName")
 *    Where eventName is the name of the slain events. mapId is 0 (to be
 *    ignored), and regionId is 0 (to also be ignored). Returns number of slain
 *    from any map that had the specified name.
 *
 * In some cases, you might only want the event to do something if the event
 * was generated by the Event Generator plugin. For example, you might only
 * want to add to the slain count if the event was generated. For this reason,
 * the following script calls are available. Use one of these scripts inside
 * a Conditional Branch to make it only happen when the event was generated.
 *
 * $gameMap.eventWasGenerated()
 *    Checks if the map's currently active event was generated, and returns
 *    true or false.
 *
 * $gameMap.enemyWasGenerated()
 *    Same as $gameMap.eventWasGenerated(). Checks if the map's currently
 *    active event was generated, and returns true or false.
 *
 * If you are using the Troop Control plugin, you might want to vary your
 * troop's enemies depending on the name of the currently active event. For
 * this reason, the following script calls are available. You can put these
 * script calls within your troop's commands to check the current
 * on-map-event's name, in order to determine which enemies to add using
 * Troop Control.
 *
 * $gameMap.eventName()
 *    Gets the name of the map's currently active event.
 *
 * $gameMap.enemyName()
 *    This is the same as $gameMap.eventName(). It gets the name of the map's
 *    currently active event. This function exists to make the troop's script
 *    calls easier to understand for game designers.
 * ============================================================================
 * Basics of how to use this plugin:
 * 1. Install the plugin, and activate it using your project's Plugin Manager.
 * 2. Define which map you want to be the Default Model Map where most of your
 *    model events will be found. You can define this in the plugin parameters.
 * 3. Somewhere on your map, run the Generate Event(s) plugin command.
 *     > Be sure to select at least one model event. You can either use the
 *       model's event ID number, or the name of the event.
 *     > Be sure to define the location at which the event should spawn. The
 *       location may be Coordinates, Region, or Area. Keep in mind that by
 *       default, the events do not spawn on other solid events or other solid
 *       tiles, or on the player. So, make sure that there is at least one
 *       valid spawn location, so that the event can spawn.
 *     > The Quantity is by default 1. If you want to change the number of
 *       events to spawn, you can do so by changing the Quantity arguments.
 * ============================================================================
 * Advanced uses for this plugin:
 *
 *  - Randomly generated on-map enemies!
 *    1. When the player enters a new map, have an Autorun event that spawns in
 *       events, with each event representing a troop. (The Autorun event will
 *       need to use the Erase event command to disappear after done generating
 *       events.) Using location mode of Region can be useful for indicating
 *       numerous valid spawn locations, but Area also can be used.
 *    2. Make sure the model events use the "Battle Processing..." event
 *       command. Now you have on-map enemies that are randomly generated each
 *       time the player enters the map!
 *    3. Optional: If the player wins the battle, then use the Add Slain
 *       plugin command to keep track of how many enemies were slain in the
 *       current map where the player fought the battle. This allows you to
 *       use a formula incorporating the Slain count to determine the number of
 *       events to generate next time event generation occurs on the current
 *       map.
 *       
 *  - Use the Slain feature to make the number of generated events change!
 *     > Use the Add Slain plugin command to increase the number of slain on
 *       the current map. Then, make sure that your Generate Event(s) plugin
 *       command uses a formula that incorporates the number of slain.
 *        * For example, the "Maximum - Slain" formula will make 1 less event
 *          appear for each Add Slain plugin command that is run. This makes
 *          it seem like events can be cleared quickly.
 *        * Another example: "Maximum - Slain / 2" makes the number of events
 *          generated decrease more gradually. So, when the player leaves a map
 *          and later returns, there may be fewer amounts, but the decrease is
 *          less drastic. This can be useful for making it seem like maps are
 *          slowly being cleared of events, but that the events still are
 *          increasing/generating while the player is gone from the map.
 *
 *  - Weighted event lists!
 *     > You can make a certain model be selected more often than other models!
 *       Since models are selected randomly by the Generate Event(s) plugin,
 *       simply duplicate the model by using Ctrl+C then Ctrl+V, and that model
 *       will be weighted to be selected more often than other models in the
 *       list. This is because each model entry is counted, even if it is the
 *       same as another entry.
 *
 *  - Moving spawner!
 *     > Using a Generate Event(s) location mode of Area or Coordinates, you
 *       can have an event spawner that moves!
 *        * An event could move on its own, generating other events from itself
 *          while it moves.
 *           - A fire event could move around, with little spark events
 *             generating off of it!
 *        * A spawner event could be pushed by the player, with enemies
 *          generating from it as it is moved. (Combine this with the Min
 *          Player Distance argument to make events generate slightly distant
 *          from the player while the player is pushing.)
 *           - This might be a quest to destroy a spawner by pushing it to
 *             a certain place on the map!
 *           - Imagine bandits that try to sneak up on the player whenever the
 *             player moves a pushable treasure!
 *
 *  - Script calls in Conditional Branches: Change story based on events slain!
 *     > Using script calls, you can check the number of slain in various ways.
 *       You can use this to make any event happen differently, depending on
 *       the number of slain! This could be total slain anywhere in the world,
 *       number slain in a certain map, number slain of a certain region of
 *       a map, or number slain of a certain event name!
 *     > This plugin could be used for keeping track of numbers of events slain
 *       of various (any) names in various (any) maps or regions. Then, this
 *       information could be used to determine story and quest components of
 *       the game.
 *        * For example, script calls with Conditional Branches can be used to
 *          make a story change happen if certain enemy names are slain
 *          sufficiently in a map. There may be a map full of wild beasts, but
 *          then if the player slays a sufficient quantity of wild beasts and
 *          leaves, the player may return to the map later to find a different
 *          enemy type (such as goblins) have made the map their home since the
 *          wild beasts were gone! Many such story elements can be accomplished
 *          by using script calls in conditional branches!
 * ============================================================================
 * Note: The maximum number of events that can be placed using the RPG Maker MZ
 *       editor is 999 events. For this reason, events generated by this plugin
 *       begin with eventId of 1000 and higher.
 * ============================================================================
 * For more help using the Event Generator plugin, see Tyruswoo.com.
 * ============================================================================
 * Version History:
 *
 * MZ v1.0  9/28/2020
 *  - Event Generator released for RPG Maker MZ!
 *
 * MZ v2.0  1/12/2023
 *  - Events now generate 20+ times faster! Efficiency greatly improved!
 *  - Script calls added, useful for conditional branches:
 *       $gameMap.eventWasGenerated()
 *       $gameMap.enemyWasGenerated()
 *       $gameMap.eventName()
 *       $gameMap.enemyName()
 *  - New Feature: Shared slain count map groups. Maps in the same group share
 *    their slain counts.
 *  - Bugfix: Fixed duplicative creation of sprites for events that already
 *    existed on the map at the time of the event generator function running.
 *    The bug resulted in many events (and party members) having decreased
 *    transparency of transparent pixels. Now, this bugfix results in the
 *    transparency of all sprites remaining as intended.
 *  - Bugfix: Fixed a bug in which encounters belonging to a region did not
 *    correctly determine an eventNames index when creating a new slain record.
 *    This fix prevents a crash when looking up indices that were inadvertently
 *    created without a name or value.
 *  - Bugfix: Fixed slain count crash that happened when player enters a map
 *    that didn't exist when the save file was first created.
 *  - Code Improvement: Moderately reduced save bloat by overhauling save
 *    counting and replacing the array of arrays with a minimal object that
 *    takes multi-part keys (in a similar fashion to Game_SelfSwitches).
 *
 * MZ v2.0.1  8/28/2023
 *  - This plugin is now free and open source under the MIT license.
 *
 * ============================================================================
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 * ============================================================================
 * Remember, only you can build your dreams!
 * -Scott Tyrus "Tyruswoo" Washburn and Kathy "McKathlin" Bunn
 *
 * @param Default Model Map
 * @type number
 * @min 1
 * @default 1
 * @desc Enter a valid map ID number. When a model event does not specify its model map, use this map ID as the model map.
 *
 * @param Gen on Blocked Tiles
 * @type boolean
 * @default false
 * @desc True: Events can generate on impassible tiles.
 *       False: Events cannot generate on impassible tiles.
 *
 * @param Gen on Walls
 * @parent Gen on Blocked Tiles
 * @type boolean
 * @default false
 * @desc True: Events can generate on walls (tileset's A4 tiles).
 *       False: Events cannot generate on walls (tileset's A4 tiles).
 * 
 * @param Gen on Solid Events
 * @parent Gen on Blocked Tiles
 * @type boolean
 * @default false
 * @desc True: Events can generate on solid/impassible events.
 *       False: Events cannot generate on solid/impassible events.
 *
 * @param Gen on Player
 * @parent Gen on Blocked Tiles
 * @type boolean
 * @default false
 * @desc True: Events can generate on party leader or followers.
 *       False: Events cannot generate on party leader/followers.
 *
 * @param Min Player Distance
 * @parent Gen on Blocked Tiles
 * @type number
 * @min 0
 * @desc Minimum distance away from player to be considered a valid spawn point for a generated event.
 *
 * @param Default Quantity Formula
 * @type select
 * @option Maximum
 * @option Random number between Minimum and Maximum
 * @option Average of 2 random numbers between Minimum and Maximum
 * @option Average of 3 random numbers between Minimum and Maximum
 * @option Max - Slain
 * @option Max - Slain / 2
 * @option Max - Slain / 3
 * @option Max - Slain / 4
 * @option Max - Slain / 5
 * @option Max - Slain / 6
 * @option Max - Slain / 7
 * @option Max - Slain / 8
 * @option Max - Slain / 9
 * @option Max - Slain / 10
 * @default Maximum
 * @desc Formula used to calculate number of events to generate. Slain uses map total, unless location is a single region.
 *
 * @param Default Maximum
 * @parent Default Quantity Formula
 * @type number
 * @min 1
 * @default 1
 * @desc Maximum number of events to be generated by commands, by default.
 *       If not defined, then defaults to 1.
 *
 * @param Default Minimum
 * @parent Default Quantity Formula
 * @type number
 * @min 0
 * @default 1
 * @desc Minimum number of events to be generated by commands, by default.
 *       If not defined, then Minimum is the same as Maximum.
 *
 * @param Slain Count Sharing Map Groups
 * @type text[][]
 * @default ["[]"]
 * @desc Each group is a set of maps, by map name or map ID,
 * that share slain count among them.
 * 
 * @command generate_event
 * @text Generate Event(s)
 * @desc Generate a new event, based on a model event. If multiple model events, selects a random model. Use default model map.
 *
 * @arg model_event_from_default_map
 * @type text[]
 * @text Model Event(s)
 * @desc Enter the ID number of the model event. Or, type the Name of the event. (If a letter is present, Name will be used.)
 *
 * @arg model_event_from_any_map
 * @type struct<modelEvent>[]
 * @text Model Event(s) from Maps
 * @desc Model event to use when generating an event. May be from any map. (Does not need to be from default model map.)
 *
 * @arg location
 * @type struct<location>
 * @default
 * @text Loc
 * @desc Location at which generated event will spawn. If Region or Area, then a random valid location will be selected.
 *
 * @arg quantity
 * @type struct<quantity>
 * @text Quantity
 * @desc Number of events to generate. Uses formula, if any.
 *       Default: 1.
 *
 * @command add_slain
 * @text Add Slain
 * @desc Add 1 to this map's slain count. For regionally generated events, adds 1 to slain for region where event was generated.
 *
 * @arg mapId
 * @type number
 * @min 0
 * @text Map ID
 * @desc Map ID to which 1 slain will be added. Blank or 0 to add to current map. Default: 0.
 *
 * @arg eventName
 * @type text
 * @text Event Name
 * @desc Name to which 1 slain will be added. Blank to use current event's name. Default: Current event's name.
 *
 * @arg genRegion
 * @type number
 * @min 0
 * @text Generation Region
 * @desc Region to which 1 slain will be added. Blank to use region in which current event was purposely generated (if any).
 */
 
/*~struct~modelEvent:
 * @desc Model event to use when creating the generated event.
 *
 * @param map
 * @type number
 * @min 1
 * @text Model Map ID
 * @desc Enter the ID number of the map that contains the model event. If blank or invalid, default map will be used.
 *
 * @param event
 * @text Model Event
 * @desc Enter the ID number of the model event. Or, type the Name of the event. (If a letter is present, Name will be used.)
 */

/*~struct~location:
 * @param x
 * @type number
 * @min -256
 * @max 256
 * @text X
 * @desc X coordinate value. Default: 0.
 *       +x for east. If relative: -x for west.
 *
 * @param y
 * @type number
 * @min -256
 * @max 256
 * @text Y
 * @desc Y coordinate value. Default: 0.
 *       +y for south. If relative: -y for north.
 *
 * @param mode
 * @type select
 * @option Coordinates
 * @option Region
 * @option Area
 * @default Coordinates
 * @text Location Mode
 * @desc Choose how a location will be determined for the generated event. By coordinates, region(s), or area.
 *
 * @param region
 * @parent mode
 * @type number[]
 * @text Region(s)
 * @desc Region (or regions) at which a generated event may be placed.
 *
 * @param area
 * @parent mode
 * @type struct<area>
 * @text Area
 * @desc An area in which the generated event may be placed.
 *       Uses coordinates as the origin, and uses relativity.
 *
 * @param relativity
 * @type struct<relativity>
 * @text Relativity
 * @desc Coordinates may be interpreted as absolute, or relative to an event or the player.
 *
 * @param gen_on_blocked_tiles
 * @type boolean
 * @text Gen on Blocked Tiles
 * @desc True: Events can generate on impassible tiles.
 *       False: Events cannot generate on impassible tiles.
 *
 * @param gen_on_walls
 * @type boolean
 * @text Gen on Walls
 * @desc True: Events can generate on walls (tileset's A4 tiles).
 *       False: Events cannot generate on walls (tileset's A4 tiles).
 * 
 * @param gen_on_solid_events
 * @type boolean
 * @text Gen on Solid Events
 * @desc True: Events can generate on solid/impassible events.
 *       False: Events cannot generate on solid/impassible events.
 *
 * @param gen_on_player
 * @type boolean
 * @text Gen on Player
 * @desc True: Events can generate on party leader or followers.
 *       False: Events cannot generate on party leader/followers.
 *
 * @param gen_distance_from_player
 * @type number
 * @min 0
 * @text Min Player Distance
 * @desc Minimum distance away from player to be considered a valid spawn point for a generated event.
 */

/*~struct~area:
 * @param x1
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text X1
 * @desc X1 coordinate value. Default: 0.
 *       +x for east. If relative: -x for west.
 *
 * @param y1
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Y1
 * @desc Y1 coordinate value. Default: 0.
 *       +y for south. If relative: -y for north.
 *
 * @param x2
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text X2
 * @desc X2 coordinate value. Default: 0.
 *       +x for east. If relative: -x for west.
 *
 * @param y2
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Y2
 * @desc Y2 coordinate value. Default: 0.
 *       +y for south. If relative: -y for north.
 */

/*~struct~relativity:
 * @param mode
 * @type select
 * @option Absolute
 * @option Relative to Event
 * @option Relative to Player
 * @default Relative to Event
 * @text Relativity Mode
 * @desc Select how coordinates are to be interpreted. If relative, defaults either to this event or to player.
 *
 * @param eventId
 * @parent mode
 * @type number
 * @text Event ID
 * @desc Event ID number of the event whose coordinates are to be used for "Relative to Event." 0 (or empty) for this event.
 *
 * @param party_member
 * @parent mode
 * @type select
 * @option Player
 * @option Leader
 * @option Follower 1
 * @option Follower 2
 * @option Follower 3
 * @option Follower 4
 * @option Follower 5
 * @option Follower 6
 * @option Follower 7
 * @option Follower 8
 * @option Follower 9
 * @text Party Member
 * @desc Party member whose coordinates are used for "Relative to Player". Default: Player. Can use Follower Control plugin.
 *
 * @param orientational_shift
 * @parent mode
 * @type struct<shift>
 * @text Orientational Shift
 * @desc With "Relative to Event" or "Relative to Player", modify coordinates based on direction character is facing.
 */

/*~struct~shift:
 * @param forward_shift
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Forward Shift
 * @desc Modify coordinates based on the direction the character is facing. Positive for forward. Negative for backward.
 *
 * @param rightward_shift
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Rightward Shift
 * @desc Modify coordinates based on the direction the character is facing. Positive for rightward. Negative for leftward.
 */

/*~struct~quantity:
 * @param max
 * @type number
 * @min 1
 * @text Maximum
 * @desc Maximum number of events to be generated by this command.
 *       If not defined, then defaults to 1.
 *
 * @param min
 * @type number
 * @min 0
 * @text Minimum
 * @desc Minimum number of events to be generated by this command.
 *       If not defined, then Minimum is the same as Maximum.
 *
 * @param formula
 * @type select
 * @option Maximum
 * @option Random number between Minimum and Maximum
 * @option Average of 2 random numbers between Minimum and Maximum
 * @option Average of 3 random numbers between Minimum and Maximum
 * @option Max - Slain
 * @option Max - Slain / 2
 * @option Max - Slain / 3
 * @option Max - Slain / 4
 * @option Max - Slain / 5
 * @option Max - Slain / 6
 * @option Max - Slain / 7
 * @option Max - Slain / 8
 * @option Max - Slain / 9
 * @option Max - Slain / 10
 * @text Formula
 * @desc Formula used to calculate number of events to generate. Slain uses map total, unless location is a single region.
 *
 * @param slain_name
 * @parent formula
 * @type text
 * @text Slain Name
 * @desc Name of slain events to count in formula. Specifies slain to include in calculation. Default: blank (all slain).
 */

(() => {
    const pluginName = "Tyruswoo_EventGenerator";

    //=============================================================================
	// Parameters and globals
	//=============================================================================

	// Parameter declarations
	Tyruswoo.EventGenerator.parameters = PluginManager.parameters(pluginName);
	Tyruswoo.EventGenerator.param = Tyruswoo.EventGenerator.param || {};

	// User-Defined Plugin Parameters
	Tyruswoo.EventGenerator.param.defaultModelMap = Number(
		Tyruswoo.EventGenerator.parameters['Default Model Map']);
	Tyruswoo.EventGenerator.param.genOnBlockedTiles =
		(Tyruswoo.EventGenerator.parameters['Gen on Blocked Tiles'] == "true") ? true : false;
	Tyruswoo.EventGenerator.param.genOnWalls =
		(Tyruswoo.EventGenerator.parameters['Gen on Walls'] == "true") ? true : false;
	Tyruswoo.EventGenerator.param.genOnSolidEvents = 
		(Tyruswoo.EventGenerator.parameters['Gen on Solid Events'] == "true") ? true : false;
	Tyruswoo.EventGenerator.param.genOnPlayer =
		(Tyruswoo.EventGenerator.parameters['Gen on Player'] == "true") ? true : false;
	Tyruswoo.EventGenerator.param.minPlayerDistance =
		Number(Tyruswoo.EventGenerator.parameters['Min Player Distance']);
	Tyruswoo.EventGenerator.param.defaultQuantityFormula =
		Tyruswoo.EventGenerator.parameters['Default Quantity Formula'];
	Tyruswoo.EventGenerator.param.defaultMaximum = Number(
		Tyruswoo.EventGenerator.parameters['Default Maximum']);	
	Tyruswoo.EventGenerator.param.defaultMinimum = Number(
		Tyruswoo.EventGenerator.parameters['Default Minimum']);	
	Tyruswoo.EventGenerator.param.slainCountGroupJson =
			Tyruswoo.EventGenerator.parameters['Slain Count Sharing Map Groups'];

	// Variables
	Tyruswoo.EventGenerator.modelMapData = [null]; //An array, organized by mapId, to hold the corresponding data of each map.
	Tyruswoo.EventGenerator._pluginCommandEventId = 0; //Keep track of the most recent event to run a plugin command.
	
	// Default values for plugin command arguments.
	const defaultGenLocation = {"x":"","y":"","mode":"Coordinates","region":"","area":"","relativity":"","gen_on_blocked_tiles":"","gen_on_solid_events":"","gen_on_player":"","gen_distance_from_player":""};
	const defaultGenQuantity = {"max":"","min":"","formula":""};
	const defaultGenRelativity = {"mode":"Relative to Event","eventId":"","party_member":"","orientational_shift":""};
	const defaultOrientationalShift = {"forward_shift":"0","rightward_shift":"0"};
	
	//=============================================================================
	// PluginManager
	//=============================================================================
	
	// generate_event
	PluginManager.registerCommand(pluginName, "generate_event", args => {
		Tyruswoo.EventGenerator.generateEventBatch(args);
	});
	
	// add_slain
	PluginManager.registerCommand(pluginName, "add_slain", args => {
		const mapId = Number(args.mapId) ? Number(args.mapId) : $gameMap._mapId;
		const eventName = args.eventName ? args.eventName : $gameMap.event(Tyruswoo.EventGenerator._pluginCommandEventId)._name;
		const genRegion = Number(args.genRegion) ? Number(args.genRegion) : $gameMap.event(Tyruswoo.EventGenerator._pluginCommandEventId)._genRegion;
		$gameSystem.addSlain(mapId, genRegion, eventName);
	});
	
	//=============================================================================
	// Tyruswoo.EventGenerator
	//=============================================================================

	Tyruswoo.EventGenerator.getMapIdByString = function(mapName) {
		if (/^[1-9]\d*$/.test(mapName)) {
			// It's a whole number, 1 or greater.
			return Number(mapName);
		}
		let mapInfo = $dataMapInfos.find(
			element => element && element.name == mapName);
		if (!mapInfo) {
			return null;
		}
		return mapInfo.id;
	};

	Tyruswoo.EventGenerator.generateEventBatch = function(args) {
		if (!Tyruswoo.EventGenerator.validateModelMap(Tyruswoo.EventGenerator.param.defaultModelMap)) {
			console.warn("Default model map has not been set, or has been set incorrectly.\n" +
				"Please open the plugin manager, open Default Model Map, and " +
				"set the ID of the map your game will reference for model events.\n" +
				"Until this is done, events will not generate.");
			return;
		}
		const genGoal = Tyruswoo.EventGenerator.genGoal(args);
		const models = Tyruswoo.EventGenerator.models(args);
		const genLocation = Tyruswoo.EventGenerator.parseGenLocationArgs(args);
		const genRegion = Tyruswoo.EventGenerator.genRegion(genLocation);
		// Available tiles are found once;
		// the map and the player's position on it are the same for all iterations.
		const tilesInScope = Tyruswoo.EventGenerator.tilesInScope(genLocation);
		for (var i = 0; i < genGoal; i++) {
			// Events are added as we go, so check event clearance each iteration.
			let tiles = Tyruswoo.EventGenerator.tilesClearOfEvents(tilesInScope, genLocation);
			if (tiles.length) {
				const r = Math.floor(Math.random() * tiles.length); // Select a random valid location.
				const m = Math.floor(Math.random() * models.length); // Select a random model.
				$gameMap.generateEvent(models[m].mapId, models[m].eventId, tiles[r].x, tiles[r].y, genRegion, true);
			};
		};
	};

	Tyruswoo.EventGenerator.validateModelMap = function(mapId) {
		// Verify that the model map data exists.
		return !!mapId && !!Tyruswoo.EventGenerator.modelMapData[mapId];
	};

	// New method
	// Unpacks the struct at args.location and prepares it for use.
	// Where anything is missing, the global default is used in its place.
	Tyruswoo.EventGenerator.parseGenLocationArgs = function(args) {
		const genLocation = args.location ? JSON.parse(args.location) : defaultGenLocation;
		genLocation.x = Number(genLocation.x);
		genLocation.y = Number(genLocation.y);

		genLocation.area = genLocation.area ? JSON.parse(genLocation.area) : null;

		const getBooleanOrFallback = function(str, fallback) {
			str ? (str == "true") : fallback;
		}

		genLocation.gen_on_blocked_tiles = getBooleanOrFallback(
			genLocation.gen_on_blocked_tiles,
			Tyruswoo.EventGenerator.param.genOnBlockedTiles);
		genLocation.gen_on_walls = getBooleanOrFallback(
			genLocation.gen_on_walls,
			Tyruswoo.EventGenerator.param.genOnWalls);
		genLocation.gen_on_solid_events = getBooleanOrFallback(
			genLocation.gen_on_solid_events,
			Tyruswoo.EventGenerator.param.genOnSolidEvents);
		genLocation.gen_on_player = getBooleanOrFallback(
			genLocation.gen_on_player,
			Tyruswoo.EventGenerator.param.genOnPlayer);

		if (genLocation.gen_distance_from_player) {
			genLocation.gen_distance_from_player = Number(
				genLocation.gen_distance_from_player);
		} else {
			genLocation.gen_distance_from_player = 
				Tyruswoo.EventGenerator.param.genDistance;
		}

		genLocation.regionList = genLocation.region ? JSON.parse(genLocation.region) : [];
		for (var i = 0; i < genLocation.regionList.length; i++) {
			genLocation.regionList[i] = Number(genLocation.regionList[i]);
		}
		return genLocation;
	};

	// New method
	// If there is only one region, then this region should be remembered by the generated events.
	Tyruswoo.EventGenerator.genRegion = function(genLocation) {
		var genRegion = 0;
		var regions = genLocation.regionList;
		if (genLocation.mode == "Region" && regions.length == 1 && Number(regions[0])) {
			genRegion = Number(regions[0]);
		};
		return genRegion;
	};

	// New method.
	// Modeled from the similar Tyruswoo_TileControl function, known as Tyruswoo.TileControl.extract_xyz_array().
	// With input of args from the plugin command, outputs an array [x, y], with accounting for relativity options.
	Tyruswoo.EventGenerator.extract_xy_array = function(genLocation) {
		const relativity = (genLocation && genLocation.relativity) ? JSON.parse(genLocation.relativity) : defaultGenRelativity;
		const orientational_shift = relativity.orientational_shift ? JSON.parse(relativity.orientational_shift) : defaultOrientationalShift;
		var x = Number(genLocation.x);
		var y = Number(genLocation.y);
		if (relativity.mode == "Relative to Event") {
			const eventId = Number(relativity.eventId) ? Number(relativity.eventId) : Tyruswoo.EventGenerator._pluginCommandEventId;
			const e = $gameMap.event(eventId);
			if (e) {
				const f = Number(orientational_shift.forward_shift) ? Number(orientational_shift.forward_shift) : 0;
				const r = Number(orientational_shift.rightward_shift) ? Number(orientational_shift.rightward_shift) : 0;
				const xy_shift = Tyruswoo.EventGenerator.orientationalShift(e.direction(), f, r);
				x = x + e.x + xy_shift[0];
				y = y + e.y + xy_shift[1];
			};
		} else if (relativity.mode == "Relative to Player") {
			var p = $gamePlayer; //By default, the party leader is selected.
			if (Imported.Tyruswoo_FollowerControl) { //However, if Tyruswoo_FollowerControl is installed, then the currently selected follower is automatically selected.
				p = Tyruswoo.FollowerControl.follower();
			};
			if (relativity.party_member == "Leader") {
				p = $gamePlayer; //Regardless of whether Tyruswoo_FollowerControl is installed, the "Leader" option can be used to select the leader.
			} else if (relativity.party_member.substr(0, 8) == "Follower") {
				const n = Number(relativity.party_member.substr(9)); //Get the number found after this string's last space.
				p = $gamePlayer.followers().follower(n - 1);
			};
			if (p) {
				const f = Number(orientational_shift.forward_shift) ? Number(orientational_shift.forward_shift) : 0;
				const r = Number(orientational_shift.rightward_shift) ? Number(orientational_shift.rightward_shift) : 0;
				const xy_shift = Tyruswoo.EventGenerator.orientationalShift(p.direction(), f, r);
				x = x + p.x + xy_shift[0];
				y = y + p.y + xy_shift[1];
			};
		};
		return [x, y];
	};

	// New method
	// Modeled from the similar Tyruswoo_TileControl function, known as Tyruswoo.TileControl.orientationalShift().
	Tyruswoo.EventGenerator.orientationalShift = function(direction, f = 0, r = 0) { //direction, forward shift, and rightward shift.
		var xShift = 0;
		var yShift = 0;
		switch(direction) {
			case 2:
				xShift -= r;
				yShift += f;
				break;
			case 4:
				xShift -= f;
				yShift -= r;
				break;
			case 6:
				xShift += f;
				yShift += r;
				break;
			case 8:
				xShift += r;
				yShift -= f;
				break;
		};
		return [xShift, yShift];
	};
	
	// New method
	// Finds all valid tiles within the area specified in genLocation.
	Tyruswoo.EventGenerator.genAreaTiles = function(genLocation, origin) {
		const genArea = genLocation.area;
		const x1 = Number(genArea.x1) ? Number(genArea.x1) + origin.x : origin.x;
		const y1 = Number(genArea.y1) ? Number(genArea.y1) + origin.y : origin.y;
		const x2 = Number(genArea.x2) ? Number(genArea.x2) + origin.x : origin.x;
		const y2 = Number(genArea.y2) ? Number(genArea.y2) + origin.y : origin.y;
		const genAreaTiles = [];
		for (var j = y1; j <= y2; j++) { // Find all tiles in this area.
			for (var i = x1; i <= x2; i++) {
				const tile = {x:i, y:j};
				if (Tyruswoo.EventGenerator.isValidTile(tile, genLocation)) {
					genAreaTiles.push(tile);
				}
			};
		};
		return genAreaTiles;
	};

	// New method
	// Finds all valid tiles within the region list specified in genLocation.
	Tyruswoo.EventGenerator.genRegionTiles = function(genLocation) {
		const regionList = genLocation.regionList;
		var regionTiles = [];
		for (i = 0; i < $gameMap.width(); i++) {
			for (j = 0; j < $gameMap.height(); j++) {
				const regionHere = $gameMap.regionId(i, j);
				for (const myRegion of regionList) {
					if (regionHere == myRegion) {
						const tile = { x:i, y:j };
						if (Tyruswoo.EventGenerator.isValidTile(tile, genLocation)) {
							regionTiles.push(tile);
						}
						break; // Break the current loop. If the region occurs multiple times in the list, this tile will still only be added once.
					}
				}
			}
		}
		return regionTiles;
	};
	
	// New method
	Tyruswoo.EventGenerator.genGoal = function(args) {
		const genQuantity = args.quantity ? JSON.parse(args.quantity) : defaultGenQuantity;
		const maxText = genQuantity.max; //Maximum
		var maximum = Tyruswoo.EventGenerator.param.defaultMaximum ? Tyruswoo.EventGenerator.param.defaultMaximum : 1;
		if (maxText) {maximum = Number(maxText);};
		const minText = genQuantity.min; //Minimum
		var minimum = Tyruswoo.EventGenerator.param.defaultMinimum ? Tyruswoo.EventGenerator.param.defaultMinimum : 1;
		if (minText) {minimum = Number(minText);};
		if (minimum > maximum) {minimum = maximum;};
		const slainRegion = Tyruswoo.EventGenerator.genRegion(args);
		const slainName = genQuantity.slain_name;
		const slain = $gameSystem.slain($gameMap._mapId, slainRegion, slainName);
		const formula = genQuantity.formula ? genQuantity.formula : Tyruswoo.EventGenerator.param.defaultQuantityFormula; //Formula
		var genGoal = maximum;
		switch(formula) {
			case "Random number between Minimum and Maximum":
				genGoal = Math.floor(Math.random() * (maximum - minimum)) + minimum;
				break;
			case "Average of 2 random numbers between Minimum and Maximum":
				genGoal = Tyruswoo.EventGenerator.averageOfRandomNumbers(2, minimum, maximum);
				break;
			case "Average of 3 random numbers between Minimum and Maximum":
				genGoal = Tyruswoo.EventGenerator.averageOfRandomNumbers(3, minimum, maximum);
				break;
			case "Max - Slain":
				genGoal = maximum - slain;
				break;
			case "Max - Slain / 2":
				genGoal = maximum - Math.floor(slain / 2);
				break;
			case "Max - Slain / 3":
				genGoal = maximum - Math.floor(slain / 3);
				break;
			case "Max - Slain / 4":
				genGoal = maximum - Math.floor(slain / 4);
				break;
			case "Max - Slain / 5":
				genGoal = maximum - Math.floor(slain / 5);
				break;
			case "Max - Slain / 6":
				genGoal = maximum - Math.floor(slain / 6);
				break;
			case "Max - Slain / 7":
				genGoal = maximum - Math.floor(slain / 7);
				break;
			case "Max - Slain / 8":
				genGoal = maximum - Math.floor(slain / 8);
				break;
			case "Max - Slain / 9":
				genGoal = maximum - Math.floor(slain / 9);
				break;
			case "Max - Slain / 10":
				genGoal = maximum - Math.floor(slain / 10);
				break;
		};
		if (genGoal < minimum) {genGoal = minimum};
		return genGoal;
	};
	
	// New method
	Tyruswoo.EventGenerator.averageOfRandomNumbers = function(rolls, min, max) {
		var sum = 0;
		for (var i = 0; i < rolls; i++) {
			sum += Math.floor(Math.random() * (max - min)) + min;
		};
		return Math.round(sum / rolls);
	};
	
	// New method
	Tyruswoo.EventGenerator.tilesInScope = function(genLocation) {
		const xy = Tyruswoo.EventGenerator.extract_xy_array(genLocation);
		const origin = {x:xy[0], y:xy[1]};
		var tilesInScope = [];
		switch(genLocation.mode) {
			case "Coordinates":
				tilesInScope.push(origin);
				break;
			case "Region":
				tilesInScope = Tyruswoo.EventGenerator.genRegionTiles(genLocation);
				break;
			case "Area":
				if (genLocation.area) {
					tilesInScope = Tyruswoo.EventGenerator.genAreaTiles(
						genLocation, origin);
				}
				if (0 == tilesInScope.length) {
					console.warn("No area defined for event generation by Area. Instead, generating event at Coordinates.");
					tilesInScope.push(origin);
				}
				break;
			default:
				console.log("Warning: Generation Location Mode was absent. By default, used Coordinates mode (origin tile).");
				tilesInScope.push(origin);
				break;
		};
		return tilesInScope;
	};

	Tyruswoo.EventGenerator.tilesClearOfEvents = function(tilesInScope, genLocation) {
		// Build list of events to avoid.
		var solidEvents = [];
		if (!genLocation.gen_on_solidEvents) {
			solidEvents = solidEvents.concat($gameMap.eventsSolid());
		}
		if (!genLocation.gen_on_player) {
			solidEvents.push($gamePlayer);
			solidEvents = solidEvents.concat($gamePlayer.followers().data());
		}

		// Build list of tiles that aren't occupied by events we're avoiding.
		var tilesClear;
		if (0 == solidEvents.length) {
			tilesClear = tilesInScope; // No changes needed.
		} else {
			tilesClear = [];
			for (const coords of tilesInScope) {
				const solid = solidEvents.some(event => event.pos(coords.x, coords.y));
				if (!solid) {
					tilesClear.push(coords);
				};
			};
		}
		return tilesClear;
	};
	
	// New method
	Tyruswoo.EventGenerator.models = function(args) {
		const modelNamesFromDefaultMap = args.model_event_from_default_map ? JSON.parse(args.model_event_from_default_map) : [];
		//console.log("modelNamesFromDefaultMap", modelNamesFromDefaultMap);
		var modelNamesFromAnyMap = args.model_event_from_any_map ? JSON.parse(args.model_event_from_any_map) : [];
		for (i = 0; i < modelNamesFromAnyMap.length; i++) {
			modelNamesFromAnyMap[i] = JSON.parse(modelNamesFromAnyMap[i]);
		};
		//console.log("modelNamesFromAnyMap", modelNamesFromAnyMap);
		var models = [];
		if (modelNamesFromDefaultMap) {
			for (i = 0; i < modelNamesFromDefaultMap.length; i++) {
				const name = modelNamesFromDefaultMap[i];
				const model = Tyruswoo.EventGenerator.model(name);
				if (model) {models.push(model);};
			};
		};
		if (modelNamesFromAnyMap) {
			for (i = 0; i < modelNamesFromAnyMap.length; i++) {
				const name = modelNamesFromAnyMap[i].event;
				const mapId = Number(modelNamesFromAnyMap[i].map);
				const model = Tyruswoo.EventGenerator.model(name, mapId);
				if (model) {models.push(model);};
			};
		};
		//console.log("models", models);
		return models;
	};
	
	Tyruswoo.EventGenerator.model = function(name, mapId) {
		mapId = mapId || Tyruswoo.EventGenerator.param.defaultModelMap;
		var eventId = 0;
		if (!name.match(/[a-z]/i) && !name.match(/[.*+\-?^${}()|[\]\\]/)) {
			eventId = Number(name);
		} else {
			for (const event of Tyruswoo.EventGenerator.modelMapData[mapId].events.filter(event => !!event)) {
				if (event.name == name) {
					eventId = event.id;
					break; //If an eventId for the name was found, we can stop looking. Therefore, the first (lowest ID) event with this name is selected as a model.
				};
			};
		};
		if (mapId && eventId) {
			const model = {mapId:mapId, eventId:eventId};
			return model;
		};
	};

	Tyruswoo.EventGenerator.isValidTile = function(coords, genLocation) {
		if (!genLocation.gen_on_blocked_tiles) {
			if (!$gameMap.checkPassage(coords.x, coords.y, 0x0f)) {
				return false; // It's blocked. Can't generate here.
			}
		}
		if (!genLocation.gen_on_walls) {
			let layeredTiles = $gameMap.layeredTiles(coords.x, coords.y);
			for (var tileLayer of layeredTiles) {
				if (Tilemap.isWallTile(tileLayer)) {
					return false; // It's a wall. Can't generate here.
				}
			}
		}
		const genDistance = genLocation.gen_distance_from_player;
		if (genDistance) {
			let d = $gameMap.distance(coords.x, coords.y, $gamePlayer.x, $gamePlayer.y);
			if (d < genDistance) {
				return false; // It's too close to the player.
			}
		}
		// If we're here, nothing disqualified these coords.
		return true;
	};

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	// Alias method.
	// Plugin Command
	Tyruswoo.EventGenerator.Game_Interpreter_command357 = Game_Interpreter.prototype.command357;
	Game_Interpreter.prototype.command357 = function(params) {
		Tyruswoo.EventGenerator._pluginCommandEventId = this.eventId(); //Keep track of the most recent event that used a plugin command.
		return Tyruswoo.EventGenerator.Game_Interpreter_command357.call(this, params);
	};
	
	//=============================================================================
	// DataManager
	//=============================================================================

	// Alias method
	// Add new type of slain counter, if absent.
	// Remove legacy slain counter, if present,
	// so that it won't bloat future saves.
	Tyruswoo.EventGenerator.DataManager_correctDataErrors =
		DataManager.correctDataErrors;
	DataManager.correctDataErrors = function() {
		Tyruswoo.EventGenerator.DataManager_correctDataErrors.call(this);
		if (!$gameSystem._slainCounter) {
			Tyruswoo.EventGenerator.initSlainCounter($gameSystem);
		}
		delete $gameSystem._slain;
		delete $gameSystem._slainCountGroupByMapId;
	};

	// Alias method.
	// If $dataMapInfos is loaded, then we can begin loading the other maps into the Tyruswoo.EventGenerator.modelMapData list.
	// If this is a map file being loaded, then we may need to know this for the DataManager.onLoad() function.
	Tyruswoo.EventGenerator.DataManager_onXhrLoad = DataManager.onXhrLoad;
	DataManager.onXhrLoad = function(xhr, name, src, url) {
		if (src == "MapInfos.json") {
			const mapId = "MapInfos";
			window[name] = JSON.parse(xhr.responseText);
			this.onLoad(window[name], mapId);
		} else if (xhr.status < 400 && src.substr(0, 3) == "Map" && src != "MapInfos.json") {
			const mapId = parseInt(src.substr(3, 5));
			window[name] = JSON.parse(xhr.responseText);
			this.onLoad(window[name], mapId);
		} else {
			Tyruswoo.EventGenerator.DataManager_onXhrLoad.call(this, xhr, name, src, url);
		};
	};

	// Alias method.
	// Use the DataManager to find the model events for the Event Generator.
	Tyruswoo.EventGenerator.DataManager_onLoad = DataManager.onLoad;
	DataManager.onLoad = function(object, mapId) {
		Tyruswoo.EventGenerator.DataManager_onLoad.call(this, object);
		if (mapId == "MapInfos") {
			for (i = 0; i < object.length; i++) {
				if (object[i] && object[i].id) {
					const m = object[i].id;
					const filename = "Map%1.json".format(m.padZero(3));
					this.loadDataFile(filename, filename);
				};
			};
			//console.log("$dataMapInfos", $dataMapInfos);
		} else if (mapId && !Tyruswoo.EventGenerator.modelMapData[mapId] && this.isMapObject(object)) {
			Tyruswoo.EventGenerator.modelMapData[mapId] = object;
			if($dataMapInfos[$dataMapInfos.length-1].id && mapId == $dataMapInfos[$dataMapInfos.length-1].id) {
				//console.log("Map data for models: Tyruswoo.EventGenerator.modelMapData", Tyruswoo.EventGenerator.modelMapData);
			};
		};
	};

	//=============================================================================
	// Scene_Boot
	//=============================================================================

	// Alias method.
	Tyruswoo.EventGenerator.Scene_Boot_create = Scene_Boot.prototype.create;
	Scene_Boot.prototype.create = function() {
		Tyruswoo.EventGenerator.Scene_Boot_create(this);
		if(!Tyruswoo.EventGenerator.modelMapData) {
			Tyruswoo.EventGenerator.loadModelData();
		};
	};

	//=============================================================================
	// Tyruswoo.EventGenerator.SlainCounter
	//=============================================================================

	// TODO: Check file for all slain counting data structures,
	//       and unify them here in a compact way

	Tyruswoo.EventGenerator.initSlainCounter = function(gameSystem) {
		// Slain counts are kept in system so it's part of save data.
		gameSystem._slainCounter = {};
		this._slainGroupByMapId = this.makeGroupLookup(); // Does not change.
	};

	Tyruswoo.EventGenerator.makeGroupLookup = function() {
		var lookup = {};
		var mapGroups = [];
		var groupIndexByMapId = {};
		try {
			const mapGroupsJson = JSON.parse(
				Tyruswoo.EventGenerator.param.slainCountGroupJson);
			for (let groupIndex = 0; groupIndex < mapGroupsJson.length; groupIndex++) {
				let mapNameGroup = JSON.parse(mapGroupsJson[groupIndex]);
				let mapIdGroup = [];
				for (const mapName of mapNameGroup) {
					let mapId = Tyruswoo.EventGenerator.getMapIdByString(mapName);
					mapIdGroup.push(mapId);
					groupIndexByMapId[mapId] = groupIndex;
				}
				mapGroups.push(mapIdGroup);
			}
			for (const mapIdKey in groupIndexByMapId) {
				let groupIndex = groupIndexByMapId[mapIdKey];
				let group = mapGroups[groupIndex];
				lookup[mapIdKey] = group;
			}
		} catch (err) {
			console.error("Failed to parse slain count groups");
			console.error(err);
		}
		return lookup;
	};

	Tyruswoo.EventGenerator.getSlainCount = function(
	mapId=0, regionId=0, eventName) {
		let group = this._slainGroupByMapId[mapId];
		if (group) {
			let sum = 0;
			for (const countedMapId of group) {
				let slainHere = this._countSlainInOneMap(
					countedMapId, regionId, eventName);
				sum += slainHere;
			}
			return sum;
		} else {
			// This map doesn't call for any slain count grouping.
			return this._countSlainInOneMap(mapId, regionId, eventName);
		}
	};

	Tyruswoo.EventGenerator.addOneSlain = function(
	mapId=0, regionId=0, eventName="") {
		console.log("Adding %1 to slain count in %2, region %3...".format(
			eventName, mapId, regionId));
		// Gather all relevant keys.
		// If mapId, regionId, or eventName aren't passed in,
		// a given key may be marked for inclusion more than once,
		// but it will still only appear in the set once.
		const keySet = {};
		keySet[this._makeSlainKey()] = true; // Global general key
		keySet[this._makeSlainKey(0, 0, eventName)] = true; // Global event key
		keySet[this._makeSlainKey(mapId)] = true; // Map-wide general key
		keySet[this._makeSlainKey(mapId, 0, eventName)] = true; // Map-wide event key
		keySet[this._makeSlainKey(mapId, regionId)] = true; // Regional general key
		keySet[this._makeSlainKey(mapId, regionId, eventName)] = true; // Regional event key

		// Add one to each relevant key.
		for (const key in keySet) {
			if ($gameSystem._slainCounter[key]) {
				$gameSystem._slainCounter[key]++;
			} else {
				$gameSystem._slainCounter[key] = 1;
			}
			console.log("Slain count %1 increased to %2".format(
				key, $gameSystem._slainCounter[key]));
		}
		console.log("Done adding to slain count.");
	};

	Tyruswoo.EventGenerator._countSlainInOneMap = function(
	mapId=0, regionId=0, eventName) {
		const key = this._makeSlainKey(mapId, regionId, eventName);
		const count = $gameSystem._slainCounter[key] || 0;
		console.log("Checking slain count %1. It's %2".format(key, count));
		return count;
	};

	Tyruswoo.EventGenerator._makeSlainKey = function(
	mapId=0, regionId=0, eventName="") {
		const mapKey = mapId > 0 ? mapId.toString() : "";
		const regionKey = mapId > 0 && regionId > 0 ? regionId.toString() : "";
		const eventKey = eventName || "";
		return "%1,%2,%3".format(mapKey, regionKey, eventKey);
	};

	//=============================================================================
	// Game_System
	//=============================================================================

	// Alias method.
	// By keeping information in the system, it is kept in the save file
	// and is unique for each save file.
	Tyruswoo.EventGenerator.Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		Tyruswoo.EventGenerator.Game_System_initialize.call(this);
		Tyruswoo.EventGenerator.initSlainCounter(this);
	};

	// TODO: Load slain counter properly from save.
	
	// New method
	// Add to the list of slain.
	Game_System.prototype.addSlain = function(mapId, genRegionId, eventName) {
		Tyruswoo.EventGenerator.addOneSlain(mapId, genRegionId, eventName);
	};

	// New method
	// Check how many slain in a given map, region, and/or event name.
	Game_System.prototype.slain = function(mapId, regionId, eventName) {
		return Tyruswoo.EventGenerator.getSlainCount(mapId, regionId, eventName);
	};

	//=============================================================================
	// Game_CharacterBase
	//=============================================================================

	// New method
	// True for characters that can't pass through each other or the player.
	Game_CharacterBase.prototype.isSolid = function() {
		return !this.isThrough() && this.isNormalPriority();
	};

	//=============================================================================
	// Game_Map
	//=============================================================================

	// New method
	// Returns all solid events.
	Game_Map.prototype.eventsSolid = function() {
		return this.events().filter(event => event.isSolid());
	};

	// Alias method.
	// Create a list that tracks events that have been generated by this plugin.
	Tyruswoo.EventGenerator.Game_Map_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function() {
		Tyruswoo.EventGenerator.Game_Map_initialize.call(this);
		this._generatedEvents = []; //A list of all events generated by the Tyruswoo Event Generator plugin.
	};

	// Alias method.
	// When a new map is entered, reset the list of the events that have been generated by this plugin.
	// This is a separate from the $gameMap._events list of events routinely created by default when entering a map.
	// A generated event is one object, but is listed in both lists: $gameMap._events and $gameMap._generatedEvents.
	Tyruswoo.EventGenerator.Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		this._generatedEvents = []; //Reset list of all events generated.
		Tyruswoo.EventGenerator.Game_Map_setupEvents.call(this);
	};

	// New method.
	// This function generates an event. This is separate from the routine event creation that occurs by default when entering a map.
	Game_Map.prototype.generateEvent = function(modelMapId = 0, modelEventId = 0, x = 0, y = 0, genRegion = 0, createSprite = true) {
		if (!Tyruswoo.EventGenerator.validateModelMap(modelMapId)) {
			console.warn("Invalid model map: %1\nThis event will not generate.".format(modelMapId));
			return;
		}
		if (!modelEventId) {
			return; //To generate an event, there must be a modelMapId and modelEventId.
		}
		const newEventId = 1000 + this._generatedEvents.length;
		const newEvent = new Game_Event(this._mapId, newEventId, modelMapId, modelEventId, x, y); // Generate the event. New event is created in the map's _events list.
		this._events[newEventId] = newEvent;
		this._generatedEvents.push(newEvent); // Also, keep track of the generated event in the separate $gameMap.generatedEvents list.
		newEvent._isGenerated = true; // Each event remembers if it was generated by this plugin.
		if (this._eventsByName && this._eventsByName[newEvent.name]) {
			// Tyruswoo_EventAI integration.
			// If events by this name have a cache, add to it.
			this._eventsByName[newEvent.name].push(newEvent);
		}
		if (genRegion) {
			// Each event remembers if it was purposefully generated into a specific region.
			newEvent._genRegion = genRegion;
		}
		if (createSprite) {
			if (SceneManager._scene && SceneManager._scene._spriteset && typeof SceneManager._scene._spriteset.createGeneratedCharacter === "function") {
				//Make sure the generated event has a sprite/graphic. Otherwise, the event cannot be seen, even though it exists.
				SceneManager._scene._spriteset.createGeneratedCharacter( newEvent );
			}
		}
	};
	
	// New method
	// Allows a script call to check the name of the map's currently active event.
	Game_Map.prototype.eventName = function() {
		var activeEventId = this._interpreter.eventId();
		return (this.event(activeEventId) && this.event(activeEventId)._name) ? this.event(activeEventId)._name : "";
	};
	
	// New method
	// Returns the same name as $gameMap.eventName()
	Game_Map.prototype.enemyName = function() {
		return this.eventName();
	};
	
	// New method
	// Allows a script call to check if the map's currently active event was generated.
	Game_Map.prototype.eventWasGenerated = function() {
		var activeEventId = this._interpreter.eventId();
		return (this.event(activeEventId) && this.event(activeEventId)._isGenerated) ? this.event(activeEventId)._isGenerated : false;
	};
	
	// New method
	// Returns the same value as $gameMap.eventWasGenerated()
	Game_Map.prototype.enemyWasGenerated = function() {
		return this.eventWasGenerated();
	};
	
	//=============================================================================
	// Spriteset_Map
	//=============================================================================
	
	// New method
	// Modeled from the method Spriteset_Map.createCharacters
	// Make sure the generated event has a sprite/graphic. Otherwise, the event cannot be seen, even though it exists.
	Spriteset_Map.prototype.createGeneratedCharacter = function( event ) {
		if( event ) {
			const sprite = new Sprite_Character(event);
			this._characterSprites.push(sprite);
			this._tilemap.addChild(sprite);
			return true;
		} else {
			return false;
		}
	};

	//=============================================================================
	// Game_Event
	//=============================================================================

	// Alias method.
	// Makes it possible to generate an event based on a model event.
	Tyruswoo.EventGenerator.Game_Event_initialize = Game_Event.prototype.initialize;
	Game_Event.prototype.initialize = function(mapId, eventId, modelMapId = 0, modelEventId = 0, x = 0, y = 0) {
		this._modelMapId = modelMapId;		// The mapId of this event's model event.
		this._modelEventId = modelEventId;	// The eventId of this event's model event.
		this._isGenerated = false;			// This should be true only for events that were generated by the Event Generator plugin.
		this._genRegion = 0;				// If event was purposefully generated into a specific region, then remember the region.
		this._name = "";					// Name of this event, from the map data.
		if (this._modelMapId && this._modelEventId) {
			Game_Character.prototype.initialize.call(this);
			this._name = Tyruswoo.EventGenerator.modelMapData[this._modelMapId].events[this._modelEventId].name;
			this._mapId = mapId;
			this._eventId = eventId;
			this.locate(x, y); // Set the starting x and y coordinates of generated events.
			this.refresh();
		} else {
			this._name = Tyruswoo.EventGenerator.modelMapData[mapId].events[eventId].name;
			Tyruswoo.EventGenerator.Game_Event_initialize.call(this, mapId, eventId);
		};
	};
	
	// Alias method.
	// If this event is modeled after another event, then use the model event's data.
	Tyruswoo.EventGenerator.Game_Event_event = Game_Event.prototype.event;
	Game_Event.prototype.event = function() {
		if (this._modelMapId && this._modelEventId) {
			return Tyruswoo.EventGenerator.modelMapData[this._modelMapId].events[this._modelEventId];
		};
		return Tyruswoo.EventGenerator.Game_Event_event.call(this);
	};

})();