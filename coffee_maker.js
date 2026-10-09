
//
// Thing Ids
//
const NO_SUCH_THING = 1;
const NO_SUCH_VERB = 2;
const UNSUPPLIED = 3;
const AVATAR = 4;
//
// ROOMS
const HERE_ROOM = 5;                    // alias for current room
const KITCHEN_ROOM = 6;
const DINING_ROOM = 7;
const LIBRARY_ROOM = 8;
const LOUNGE_ROOM = 9;
const BASEMENT_ROOM = 10;
const SUN_ROOM = 11;
//
// VERBS
const DOWN_VERB = 12;
const EAST_VERB = 13;
const LOOK_VERB = 14;
const NORTH_VERB = 15;
const SOUTH_VERB = 16;
const UP_VERB = 17;
const WALK_VERB = 18;
const WEST_VERB = 19;
const DRINK_VERB = 20;
const DROP_VERB = 21;
const INVENTORY_VERB = 22;
const LOCK_VERB = 23;
const MAKE_VERB = 24;                   // only for "make coffee"
const READ_VERB = 25;
const SEARCH_VERB = 26;
const TAKE_VERB = 27;
const UNLOCK_VERB = 28;
const USE_VERB = 29;
const WASH_VERB = 30;
const WIPE_VERB = 31;
//
// THINGS, some takeable, some not
const CLEAN_FUNNEL = 32;
const DIRTY_MUG = 33;
const GROUND_COFFEE = 34;
const KETTLE = 35;
const CLEAN_MUG = 36;
const DIRTY_FUNNEL = 37;
const KITTY = 38;
const MUG_OF_COFFEE = 39;
const NOTE = 40;
const SACK_OF_FOODSTUFFS = 41;
const NO_MORE_THINGS = 42;

//
//
//
let TURN_COUNT = 0;

//
// This is the dictionary that the 2-word parser uses.
// Keys are words.  Values are Thing ids.
// It's okay if a Thing appears more than once, but of course
// a word may occur only once or never.
//
// The Ada version of Coffee Maker relied on the table being
// sorted (or it would have, if I had implemented binary
// search through the words).  In JavaScript, we'll let the
// language's key/value (object) implementation do the search
// for us; we'll assume it's efficient.  So we needn't sort
// the words.  But I did anyway.
//
let WORDS = {
  "": UNSUPPLIED,
  "bag": SACK_OF_FOODSTUFFS,
  "cat": KITTY,
  "coffee": GROUND_COFFEE,
  "d": DOWN_VERB,
  "down": DOWN_VERB,
  "drink": DRINK_VERB,
  "drop": DROP_VERB,
  "drygoods": SACK_OF_FOODSTUFFS,
  "e": EAST_VERB,
  "east": EAST_VERB,
  "electric": KETTLE,
  "exam": LOOK_VERB,
  "examine": LOOK_VERB,
  "filter": DIRTY_FUNNEL,
  "food": SACK_OF_FOODSTUFFS,
  "foodstuffs": SACK_OF_FOODSTUFFS,
  "funnel": DIRTY_FUNNEL,
  "get": TAKE_VERB,
  "go": WALK_VERB,
  "groceries": SACK_OF_FOODSTUFFS,
  "grounds": GROUND_COFFEE,
  "here": HERE_ROOM,
  "i": INVENTORY_VERB,
  "invent": INVENTORY_VERB,
  "inventory": INVENTORY_VERB,
  "kettle": KETTLE,
  "kitten": KITTY,
  "kitty": KITTY,
  "l": LOOK_VERB,
  "lock": LOCK_VERB,
  "look": LOOK_VERB,
  "make": MAKE_VERB,
  "me": AVATAR,
  "mug": DIRTY_MUG,                     // later, CLEAN_MUG
  "n": NORTH_VERB,
  "north": NORTH_VERB,
  "note": NOTE,
  "read": READ_VERB,
  "rinse": WASH_VERB,
  "s": SOUTH_VERB,
  "sack": SACK_OF_FOODSTUFFS,
  "search": SEARCH_VERB,
  "self": AVATAR,
  "south": SOUTH_VERB,
  "take": TAKE_VERB,
  "u": UP_VERB,
  "unlock": UNLOCK_VERB,
  "up": UP_VERB,
  "use": USE_VERB,
  "w": WEST_VERB,
  "walk": WALK_VERB,
  "wash": WASH_VERB,
  "wipe": WIPE_VERB,
  "west": WEST_VERB
}; // end WORDS

//
//
//
let Location = Array();
for (let i = NO_SUCH_THING; i < NO_MORE_THINGS; ++i) {
  Location[i] = NO_SUCH_THING;
}
Location[AVATAR] = KITCHEN_ROOM;
Location[DIRTY_MUG] = LOUNGE_ROOM;
Location[KETTLE] = DINING_ROOM;
Location[DIRTY_FUNNEL] = LIBRARY_ROOM;
Location[NOTE] = KITCHEN_ROOM;
Location[SACK_OF_FOODSTUFFS] = BASEMENT_ROOM;

//
// There's no harm in marking non-Takeable objects as Dropable
// because they ain't gonna get took in the first place, so
// they ain't gonna be dropped.  The only object in this game
// that's Takeable but not Dropable, therefore the only object
// that must be marked as non-Dropable, is the MUG OF COFFEE
// the player obtains when "make coffee" succeeds.
//
let Dropable = Array();
for (let i = NO_SUCH_THING; i < NO_MORE_THINGS; ++i) {
  Dropable[i] = true;
}
Dropable[MUG_OF_COFFEE] = false;

//
// Unlike Dropable, most Things are non-Takeable.  Then we
// mark specific Things as Takeable.
//
let Takeable = Array();
for (let i = NO_SUCH_THING; i < NO_MORE_THINGS; ++i) {
  Takeable[i] = false;
}
Takeable[DIRTY_MUG] = true;
Takeable[KETTLE] = true;
Takeable[DIRTY_FUNNEL] = true;
Takeable[SACK_OF_FOODSTUFFS] = true;
Takeable[CLEAN_FUNNEL] = true;
Takeable[GROUND_COFFEE] = true;
Takeable[CLEAN_MUG] = true;
Takeable[MUG_OF_COFFEE] = true;

//
//
//
let Name = Array();
for (let i = NO_SUCH_THING; i < NO_MORE_THINGS; ++i) {
  Name[i] = "missing name " + i;
}
Name[AVATAR] = "you";
Name[BASEMENT_ROOM] = "in the basement";
Name[CLEAN_FUNNEL] = "a pour-over funnel that's ready to make coffee";
Name[CLEAN_MUG] = "a large, clean coffee mug";
Name[DINING_ROOM] = "the dining room";
Name[DROP_VERB] = "the drop verb";
Name[DIRTY_FUNNEL] = "a pour-over funnel that needs cleaning";
Name[GROUND_COFFEE] = "some ground coffee";
Name[INVENTORY_VERB] = "the inventory verb";
Name[KETTLE] = "an electric kettle";
Name[KITCHEN_ROOM] = "in the kitchen";
Name[LOUNGE_ROOM] = "in the lounge";
Name[MAKE_VERB] = "the make verb";
Name[DIRTY_MUG] = "a large, dirty coffee mug";
Name[NOTE] = "a hand-written note";
Name[NO_SUCH_THING] = "no such object";
Name[SACK_OF_FOODSTUFFS] = "a sack of drygoods from the grocery store";
Name[TAKE_VERB] = "the take verb";
Name[WASH_VERB] = "the wash verb";
Name[WEST_VERB] = "the west verb";
Name[WIPE_VERB] = "the wipe verb";

//
//
//
let Desc = Array();
for (let i = NO_SUCH_THING; i < NO_MORE_THINGS; ++i) {
  Desc[i] = "missing desc " + i;
}
Desc[AVATAR] = "a respectable person";
Desc[BASEMENT_ROOM] = "You are in the basement.  It's dark, but there are" +
                      " no grues.  Such" +
                      " luck!  The room is large & unfinished.  The floor" +
                      " is cinderblock" +
	  " with a thick coat of dry dust.  The walls are brick & coated with" +
      " nearly as much dust.  Several thick columns of brick prevent" +
  " the ceiling from collapsing.";
Desc[CLEAN_MUG] =
  "It's a coffee mug.  It's clean enough to drink from if there were" +
  " coffee in it.";
Desc[DINING_ROOM] =
  "You are in the dining room.  There's a wooden table in the center" +
  " of the room.  The kitchen is to the south.";
Desc[DIRTY_MUG] = "It's a coffee mug.  It's structurally sound but could use" +
  "a washing before anyone drinks from it.";
Desc[DROP_VERB] =
  "This is the object that implements the Drop action.  You should" +
  " no be seeing this.";
Desc[INVENTORY_VERB] =
  "This is the object that implements the Inventory action.  You should" +
  " no be seeing this.";
Desc[KETTLE] =
  "It's an electric kettle.  The barrel is glass.  Its lid is hinged." +
  "  It has a base with bumps & slots, looks like they fit into a" +
  " custom stand.";
Desc[KITCHEN_ROOM] =
  "You are in a huge kitchen with red-brick walls.  It has ovens" +
  " embedded into the walls, three on each side.  There's a table" +
  " near the center of the room.  On the table are a stand for an" +
  " electric kettle & a note next to it.  There are open doorways" +
  " to each of the 4 main compass directions (north, east, south" +
  " west).";
Desc[LIBRARY_ROOM] =
  "You are in the library.  Tall bookcases line the walls.  There's a" +
  " ladder on casters & attached to a rail that runs around the room" +
  " so that people (including you) can reach even the top shelves. " +
  " Good thing, that, as those shelves are too high for even the" +
  " tallest person you've ever met to reach.  The kitchen is to the" +
  " west.";
Desc[LOUNGE_ROOM] =
  "You are in the lounge.  A large window on the west lets in sunlight" +
  " on bad days, twilight or moonlight when the weather is good.  It's" +
  " furnished with comfy chairs & a comfy couch, perfect for people to" +
  " take a seat with their coffee to talk or read quietly.";
Desc[MAKE_VERB] =
  "This is the object that implements the Make action.  You should" +
  " not be seeing this.";
Desc[NOTE] =
  "In an admirably controlled hand, someone has written" +
  " \"To make coffee, you will need the electric kettle, a mug," +
  " a pour-over funnel with built-in filter, & of course some ground" +
  " coffee.\"";
Desc[SACK_OF_FOODSTUFFS] =
  "It's a paper sack, like from a grocery story.  It's stuffed full" +
  " of drygoods (stuff that you can put on a shelf for weeks or" +
  " longer without it going bad).  You feel a temptation to SEARCH" +
  " this sack.";
Desc[SUN_ROOM] =
  "You walk up the stairs & into a comfortably welcoming room, perfect" +
  " for sipping coffee with the kitty & a friend.  Congratulations," +
  " you've completed the game!";
Desc[TAKE_VERB] =
  "This is the object that implements the Take action.  You should" +
  " no be seeing this.";
Desc[WASH_VERB] =
  "This is the object that implements the Wash action.  You should" +
  " not be seeing this.";
Desc[WIPE_VERB] =
  "This is the object that implements the Wipe action.  You should" +
  " not be seeing this.";

//
// True for rooms that are inherently illuminated, in other words,
// it's bright enough to LOOK in them without turning on lights or
// carrying a light-emitting Thing such as a flashlight.
//
// For this game, most rooms are illuminated, so the default is true.
// For non-rooms (Things that Avatar will never enter), the default
// is not important.  So again, it's true.
//
// If we turn on the lights in a room, set the room's element in
// Illuminated.  If we turn off those lights, clear that element.
//
let Illuminated = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Illuminated[I] = true;
}
Illuminated[BASEMENT_ROOM] = false;

//
// Sort of like Illuminated, this array tells whether a Thing emits
// light.  If it emits light, it illuminates the room it's in.  Or,
// if it emits light & Avatar carries it, it illuminates the room
// that Avatar is in.
//
// No Things (a.k.a. Nothing) in this game ever emits light, but here
// it is in case future games offer flashlights, candles, glowing
// cave fungus, or whatever.
//
let Emits_Light = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Emits_Light[I] = false;
}

//
//
//
let Here_Before = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Here_Before[I] = false;
}
Here_Before[KITCHEN_ROOM] = true;

//
// The Map.  When the target is NO_SUCH_THING, it means you can't
// go that way.
//
let Targets_North = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Targets_North[I] = NO_SUCH_THING;
}
Targets_North[KITCHEN_ROOM] = DINING_ROOM;
Targets_North[LOUNGE_ROOM] = KITCHEN_ROOM;

let Targets_East = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Targets_East[I] = NO_SUCH_THING;
}
Targets_East[KITCHEN_ROOM] = LIBRARY_ROOM;
Targets_East[LOUNGE_ROOM] = KITCHEN_ROOM;

let Targets_South = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Targets_South[I] = NO_SUCH_THING;
}
Targets_South[DINING_ROOM] = KITCHEN_ROOM;
Targets_South[KITCHEN_ROOM] = LOUNGE_ROOM;

let Targets_West = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Targets_West[I] = NO_SUCH_THING;
}
Targets_West[KITCHEN_ROOM] = LOUNGE_ROOM;
Targets_West[LIBRARY_ROOM] = KITCHEN_ROOM;

let Targets_Up = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Targets_Up[I] = NO_SUCH_THING;
}
Targets_Up[BASEMENT_ROOM] = KITCHEN_ROOM;

let Targets_Down = Array();
for (let I = 1; I < NO_MORE_THINGS; ++I) {
  Targets_Down[I] = NO_SUCH_THING;
}
Targets_Down[KITCHEN_ROOM] = BASEMENT_ROOM;

////////////////////////////////////////////////////////////////////////

//
// True if & only if the argument is the empty string.
// False otherwise.  Returns strictly true or false.
//
function Is_Empty_String( x ) {
  let result;

  if (x === "") {
    result = true;
  } else {
    result = false;
  }
  return result;
}

//
//
//
function Is_Nonempty_String( x ) {
  return ! Is_Empty_String( x );
}

//
// Because I dislike the dot notation for "sending" a message to an object.
// (It has long since caused us to forget that we are sending a message.
// And we rarely are.)
//
function To_String( X ) {
  return X.toString();
}

//
//
//
function To_Downcase( S ) {
  if ("string" != typeof S) {
    throw "In To_Downcase, S must be a string.";
  }
  return S.toLowerCase();
}

//
// Returns strictly true or false
//
function Is_Integer( X ) {
  let result;

  if (Number.isInteger(X)) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

////////////////////////////////////////////////////////////////////////

//
// Append the plain text to the game transcript.
//
function Put( text = "" ) {
  const output = document.getElementById( "output" );
  output.textContent += text;
  //
  // Scroll so that the newest output is visible.
  //
  // FIXME output.scrollTop = output.scrollHeight;
  window.scrollTo( 0, document.body.scrollHeight );
}

//
// Append plain text to the game transcript.
// Always scroll to bottom so the addition is visible.
//
function Put_Line( text = "" ) {
  Put( text + "\n" );
}

//
//
//
function New_Line() {
  Put_Line( "" );
}

//
// In the Ada version, which outputs to a plain text terminal, there
// was distinctions between emitting a string, a line, & a paragraph.
// That was because the program needed to perform its own word-wrap.
// When emitting to a browser, it's not such a big deal.
//
// But here's a "Paragraph" function anyway.
//
function Paragraph( text ) {
  Put_Line( text );
}

let TRON = false;
function Trace( caller, text ) {
  if (TRON) {
    Put_Line( "In " + caller + ", " + text );
  }
}

////////////////////////////////////////////////////////////////////////
// CONVENIENCE PREDICATES
//

//
// True if & only if the Avatar is carrying the Thing.
// In this game, that's simple: Is the Avatar the Thing's location.
// In future games, we might need to search containers that the
// Avatar is carrying, & those containers might contain more
// containers.
//
function Carries( X ) {
  let Result;

  if (Location[X] == AVATAR) {
    Result = true;
  } else {
    Result = false;
  } // end if
  return Result;
} // end Carries

//
// True if & only if the Avatar has access to the Thing.  To have
// access to the Thing, the Avatar holds it or it's in the same
// room as the Avatar.
//
function Has_Access_To( X ) {
  let Result;

  if (Location[X] == AVATAR) {
    Result = true;                      // Avatar holds it
  } else if (Location[X] == Location[AVATAR]) {
    Result = true;                      // same room as Avatar
  } else {
    Result = false;                     // doesn't have access
  } // end if
  return Result;
} // end Has_Access_To

//
// True if & only if the room is illuminated or AVATAR is
// carrying (directly) an item that emits light.
//
function Is_Illuminated() {
  let Here = Location[AVATAR];
  let Result = Illuminated[Here];
  let I = 1;

  // Search Avatar's inventory for light-emitting Things.
  // Also consider light-emitting objects in the current room.
  // If we find a light-emitting Thing, the room is illuminated.
  // We can exit the search when we find even just one.
  // or when there are no more Things.
  // If the room is inherently illuminated (which we checked, above),
  // we needn't loop at all.  And the condition on the WHILE will
  // catch that & prevent even a first iteration.  So there's no need
  // to check Result before evaluating the WHILE.
  while (! Result && I < NO_MORE_THINGS) {
    if (! Emits_Light[I]) {
      // The Thing does not emit light, so it cannot turn Result
      // to true no matter its location.
    } else if (Location[I] == AVATAR) {
      Result = true;                    // Avatar carries emitter
    } else if (Location[I] == Here) {
      Result = true;                    // Emitter is in same room
    }
    I = I + 1;
  } // end loop
  return Result;
} // end Is_Illuminated

////////////////////////////////////////////////////////////////////////
// HELPERS FOR THE ACTIONS
//

//
// for "look" or "look here"
//
function Look_Here() {
  const Here = Location[AVATAR];
  let Is_First = true;
  let Is_Empty = true;

  Paragraph( Desc[Here] );
  for (let I = 1; I < NO_MORE_THINGS; ++I) {
    if (I == AVATAR) {
      // Don't bother to tell player that Avatar is here.
    } else if (Location[I] == Here) {
      Is_Empty = false;
      if (Is_First) {
        Is_First = false;
        Put( "You see" );
      } else {
        Put( "," );
      } // end if
      Put( " " );
      Put( Name[I] );
    } // end if
  } // end for
  if (! Is_Empty) {
    Put( "." );
  } // end if;
  New_Line();
} // end Look_Here

//
//
//
function Look_At( C ) {
  const Object_Id = C["object_id"];
  const Object_Str = C["object_str"];
  if (Has_Access_To(Object_Id)) {
    Paragraph( Desc[Object_Id] );
  } else {
    Put_Line( "I don't see any " + Object_Str + " here." );
  } // end if
} // end Look_At

//
//
//
function Actually_Walk_Action( Targets, C ) {
  const Target = Targets[Location[AVATAR]];
  if (Target == NO_SUCH_THING) {
    Put_Line( "You can't go that way." );
  } else if (Here_Before[Target]) {
    Location[AVATAR] = Target;
    Put( "You are " );
    Put( Name[Target] );
    Put_Line( "." );
  } else {
    Location[AVATAR] = Target;
    Here_Before[Target] = false;
    Look_Here();
  } // end if
} // end Actually_Walk_Action

//
// The special cases that distinguish this game from others.
// You can assume that verbs requiring objects have them.
// Verbs requiring objects that are carried... have them.
// Verbs requiring HAS ACCESS TO the object has it.
//
// Return true if we have a special case & handled it.  Return
// false otherwise.
//
function Special_Actions( C ) {
  let Result = false;
  const Verb_Id = C["verb_id"];
  const Object_Id = C["object_id"];
  let S;
  //
  // This is an ugly block even in a tiny game.  I'll need a better way
  // to organize special cases in a real game.
  //
  if (Verb_Id == DROP_VERB) {
    if (Location[AVATAR] == KITCHEN_ROOM && Object_Id == KETTLE) {
      // Dropping the Kettle in the Kitchen places it in its stand &
      // markes it as Not Takeable.
      Location[KETTLE] = KITCHEN_ROOM;
      Takeable[KETTLE] = false;
      Paragraph( "The electric kettle fits snuggly into its stand &" +
                 " is ready to boil water when you're ready to make" +
                 " coffee!" );
      Result = true;
    } // end if
  } else if (Verb_Id == SEARCH_VERB && Object_Id == SACK_OF_FOODSTUFFS) {
    // We move the Ground Coffee to wherever the Sack is.
    // That works whether AVATAR searched the Sack where it
    //  was or was carrying it.
    Location[GROUND_COFFEE] = Location[SACK_OF_FOODSTUFFS];
    // We no longer need the sack, so we move it to nowhere.
    Location[SACK_OF_FOODSTUFFS] = NO_SUCH_THING;
    S = "Searching " + Name[SACK_OF_FOODSTUFFS] + " reveals " +
        Name[GROUND_COFFEE] + "!";
    Paragraph( S );
    Result = true;
  } else {
    Result = false;                     // It's not a special case.
  }
  return Result;
} // end Special_Actions

////////////////////////////////////////////////////////////////////////
// VERB PROCEDURES (a.k.a. ACTIONS)
//

//
//
//
function Not_A_Verb_Action( C ) {
  Put_Line( C["verb_str"] + " is not a verb!" );
}

//
//
//
function Drink_Action( C ) {
  Paragraph( "FIXME Drink_Action" );
} // end Drink_Action

//
//
//
function Drop_Action( C ) {
  const Object_Id = C["object_id"];
  const Object_Str = C["object_str"];
  if (Object_Id == UNSUPPLIED) {
    Put_Line( "Drop what?" );
  } else if (Object_Id == NO_SUCH_THING) {
    Paragraph( "What is a " + Object_Str + "?" );
  } else if (! Carries(Object_Id)) {
    Paragraph( "You aren't carrying any " + Object_Str + "." );
  } else if (! Dropable[Object_Id]) {
    Paragraph( "It's impossible to drop " + Object_Str + "!" );
  } else if (Special_Actions(C)) {
    // It's a special case, & Special_Actions took care of it for us.
  } else {
    Location[Object_Id] = Location[AVATAR];
    Paragraph( Object_Str + ": Dropped." );
  } // end if
} // end Drop_Action

//
//
//
function Take_Action( C ) {
  const Object_Id = C["object_id"];
  const Object_Str = C["object_str"];
  if (Object_Id == UNSUPPLIED) {
    Put_Line( "Take what?" );
  } else if (Object_Id == NO_SUCH_THING) {
    Put_Line( "What is a " + Object_Str + "?" );
  } else if (Location[Object_Id] != Location[AVATAR]) {
    Put_Line( "I don't see any " + Object_Str + " here." );
  } else if (! Takeable[Object_Id]) {
    Put_Line( "You can't take that." );
  } else {
    Location[Object_Id] = AVATAR;
    Put_Line( Object_Str + ": Taken." );
  } // end if
} // end Take_Action

//
//
//
function Inventory_Action( C ) {
  let Count = 0;
  //
  // Count the items AVATAR carries.
  //
  for (let Id = 1; Id < NO_MORE_THINGS; ++Id) {
    if (Carries(Id)) {
      Count = Count + 1;
    } // end if;
  } // end loop
  if (Count == 0) {
    Put_Line( "You aren't carrying anything." );
  } else {
    Put_Line( "You are carrying " + Count + " items.  They are..." );
    for (let Id = 1; Id < NO_MORE_THINGS; ++Id) {
      if (Carries(Id)) {
        Put_Line( " * " + Name[Id] );
      } // end if
    } // end loop
  } // end if
} // end Inventory_Action

//
//
//
function Look_Action( C ) {
  const Object_Id = C["object_id"];
  Trace( "Look_Action", "Object_Id is " + Object_Id + "." );
  if (! Is_Illuminated()) {
    Put_Line( "It's too dark to see anything." );
  } else if (Object_Id == UNSUPPLIED || Object_Id == HERE_ROOM) {
    Look_Here();
  } else {
    Look_At( C );
  } // end if
} // end Look_Action

//
// As part of this "parser game written in Ada" experiment, this is an
// interesting procedure because it has the most preconditions of any
// action in the game & the most side effects.
//
// The preconditions include Avatar's location & the locations of
// the ground coffee, the kettle, the clean mug (which was created
// from the dirty mug), & the clean funnel (created from the dirty
// funnel).
//
// All that is a way of saying that the procedure begins with a
// lengthy list of if/else arms.  When a precondition fails, we print a
// message that, we hope, tells the player what they need to do in
// the hopes of getting their next "make coffee" succeed.
//
function Make_Action( C ) {
  const Target = C["object_id"];

  if (Target != GROUND_COFFEE) {
    Paragraph( "You could make coffee if you have all 4 of the items &" +
               " you are in the kitchen, but I'm not aware of anything" +
               " else you could make in this game.  Sorry." );
  } else if (Location[AVATAR] != KITCHEN_ROOM) {
      Paragraph( "The kitchen is the best place to make coffee." );
  } else if (Location[KETTLE] != KITCHEN_ROOM) {
    Paragraph( "You'll need to drop an electric kettle on the electric" +
               " kettle stand that's on the counter top over there." );
  } else if (! Has_Access_To(CLEAN_MUG)) {
    Paragraph( "You'll need to hold a clean mug or at least have one" +
               " here in the kitchen." );
  } else if (! Has_Access_To(CLEAN_FUNNEL)) {
    Paragraph( "You'll need to carry a clean pour-over funnel, or at" +
               " least have one here with you in the kitchen.  And" +
               " it must be clean, not just a dirty old thing." );
  } else if (! Has_Access_To(GROUND_COFFEE)) {
    Paragraph( "You'll need to carry some ground coffee or have it" +
               " here in the kitchen.  I mean, you can't make coffee" +
               " without some ground coffee." );
  } else {
    Location[MUG_OF_COFFEE] = AVATAR;
    Location[CLEAN_MUG] = NO_SUCH_THING;
    Location[CLEAN_FUNNEL] = NO_SUCH_THING;
    Location[GROUND_COFFEE] = NO_SUCH_THING;
    Targets_Up[KITCHEN_ROOM] = SUN_ROOM;
    Replace_Word( "coffee", MUG_OF_COFFEE );
    Paragraph( "You fill the electric kettle with water from the faucet" +
               " & start it.  You put the pour-over funnel on your mug &" +
               " fill it with some ground coffee.  You wait..." );
    Paragraph( "When the water boils, you pour it into the filter &" +
               " wait while it trickles into the mug." );
    Paragraph( "You now have a cup of steaming coffee!  It smells" +
               " wonderful!" );
    Paragraph( "A kitty enters from some direction you didn't see," +
               " meows, & runs up some stairs you hadn't noticed" +
               " before.  There's a sun room up there, perfect for" +
               " sipping coffee with a friend.  Someone is waiting for" +
               " you up there." );
  } // end if
} // end Make_Action

//
// For this game, reading a target is the same as looking at it.
// In a more complex game, we could distinguish between the two.
//
function Read_Action( C ) {
  const X = C["object_id"];
  const Object_Str = C["object_str"];

  if (X == UNSUPPLIED) {
    Put_Line( "Read what?" );
  } else if (X == NO_SUCH_THING) {
    Put_Line( "What is a \"" + Object_Str + "\"?" );
  } else if (Has_Access_To(X)) {
    Paragraph( Desc[X] );
  } else {
    Put_Line( "I don't see any " + Object_Str + " here." );
  } // end if
} // end Read_Action

//
// Maybe I'm wrong about this, but what I think I've learned about
// Search from this experiment is that, when Search does something
// interesting, it moves the newly revealed object from No Such Thing
// (where the Avatar could not see it) to the current location.  It
// can also move an object from this location to No Such Thing, which
// this Search does.
//
// When Search doesn't reveal something new, it prints that searching
// doesn't turn up anything useful.
//
// A game could randomize the results, but be careful of never-ending
// failed searches.  If we want to randomize the results, we'll
// probably list all possible outcomes including failures, then
// shuffle the list.  Each search takes the next element from the
// list.  That way, the player is guaranteed to succeed before too
// long.
//
function Search_Action( C ) {
  const Object_Id = C["object_id"];
  const Object_Str = C["object_str"];
  let S = "";

  if (Object_Id == UNSUPPLIED) {
    Put_Line( "Search what?" );
  } else if (Object_Id == NO_SUCH_THING) {
    Put_Line( "What is a " + Object_Str + "?" );
  } else if (! Has_Access_To(Object_Id)) {
    S = "You aren't carrying any " + Object_Str + ", & there isn't one" +
        " here in the room."
    Paragraph( S );
  } else if (Special_Actions(C)) {
    // It's a special case, & Special_Actions took care of it for us.
  } else {
    S = "Searching " + Object_Str + " doesn't reveal anything.";
    Paragraph( S );
  } // end if
} // end Search_Action;

//
//
//
function Unsupplied_Action( C ) {
  Put_Line( "Hum dee dum dum do hum." );
} // end Unsupplied_Action

//
// Like Search, makes use of the "move one object into hiding, move another
// object from hiding to here" trick.
//
function Wash_Action( C ) {
  const Target = C["object_id"];
  const Object_Str = C["object_str"];

  if (Target == NO_SUCH_THING) {
    Paragraph( "What is a " + Object_Str + "?" );
  } else if (! Carries(Target)) {
    Paragraph( "You can't wash it if you aren't carrying it." );
  } else if (Location[AVATAR] != KITCHEN_ROOM) {
    Paragraph( "The only place around here for washing anything is" +
               " the kitchen." );
  } else if (Target == DIRTY_MUG) {
    Location[CLEAN_MUG] = Location[DIRTY_MUG];
    Location[DIRTY_MUG] = NO_SUCH_THING;
    Replace_Word( "mug", CLEAN_MUG );
    Paragraph( "The formerly dirty mug is now clean enough for a drink." +
	       "  Excellent!" );
  } else if (Target == DIRTY_FUNNEL) {
    Location[CLEAN_FUNNEL] = Location[DIRTY_FUNNEL];
    Location[DIRTY_FUNNEL] = NO_SUCH_THING;
    Replace_Word( "funnel", CLEAN_FUNNEL );
    Replace_Word( "filter", CLEAN_FUNNEL );
    Paragraph( "The pour-over funnel is now clean & ready for making" +
	       " coffee.  Wonderful!" );
  } else {
    Paragraph( "It's cleaner than it was, always an improvement." );
  } // end if
} // end Wash_Action

//
// Not used in this game.
//
function Wipe_Action( C ) {
  Paragraph( "FIXME You wipe " + C["object_str"] + "." );
} // end Wipe_Action

//
//
//
function North_Action( C ) {
  Actually_Walk_Action( Targets_North, C );
} // end North_Action

//
//
//
function  East_Action( C ) {
  Actually_Walk_Action( Targets_East, C );
} // end East_Action

//
//
//
function South_Action( C ) {
  Actually_Walk_Action( Targets_South, C );
} // end South_Action

//
//
//
function West_Action( C ) {
  Actually_Walk_Action( Targets_West, C );
} // end West_Action

//
//
//
function Up_Action( C ) {
  // End-of-game is a special case, but we can detect it
  // after the general purpose movement.  By doing the general
  // state-changing action, then looking for the special case,
  // it differs from all the other special cases.  They check
  // for the special case early (not always first), before
  // any state-changing code.
  Actually_Walk_Action( Targets_Up, C );
  //
  // If the Avatar is in the Sun Room, the game is over.
  if (Location[AVATAR] == SUN_ROOM) {
    Is_Done = true;
  } // end if
} // end Up_Action

//
//
//
function Down_Action( C ) {
  Actually_Walk_Action( Targets_Down, C );
} // end Down_Action

//
//
//
function Walk_Action( C ) {
  switch (C["object_id"]) {
  case NORTH_VERB: North_Action( C ); break;
  case EAST_VERB: East_Action( C ); break;
  case SOUTH_VERB: South_Action( C ); break;
  case WEST_VERB: West_Action( C ); break;
  case UP_VERB: Up_Action( C ); break;
  case DOWN_VERB: Down_Action( C ); break;
  default:
    Put_Line( C["object_str"] + " isn't a direction." );
  } // end switch
} // end Walk_Action

////////////////////////////////////////////////////////////////////////
//
//
//
let Action = Array();
for (let i = NO_SUCH_THING; i < NO_MORE_THINGS; ++i) {
  Action[i] = Not_A_Verb_Action
}
Action[DOWN_VERB] = Down_Action;
Action[DRINK_VERB] = Drink_Action;
Action[DROP_VERB] = Drop_Action;
Action[EAST_VERB] = East_Action;
Action[INVENTORY_VERB] = Inventory_Action;
Action[LOOK_VERB] = Look_Action;
Action[MAKE_VERB] = Make_Action;
Action[NORTH_VERB] = North_Action;
Action[READ_VERB] = Read_Action;
Action[SEARCH_VERB] = Search_Action;
Action[SOUTH_VERB] = South_Action;
Action[TAKE_VERB] = Take_Action;
Action[UNSUPPLIED] = Unsupplied_Action;
Action[UP_VERB] = Up_Action;
Action[WALK_VERB] = Walk_Action;
Action[WASH_VERB] = Wash_Action;
Action[WEST_VERB] = West_Action;
Action[WIPE_VERB] = Wipe_Action;

//
// Use this to direct a word from the dictionary to a different
// object.
//
// W is a string, a word in the dictionary.
// Replacement is a Thing id to associate with the word.
// If W is not in the WORDS already, you win an error.
//
function Replace_Word( W, Replacement ) {
  if ("string" != typeof W) {
    throw "In Replace_Word, W must be a string.";
  } else if (! Is_Integer(Replacement) ) {
    throw "In Replace_Word, Replacement must be an integer, not a " +
          To_String(typeof Replacement) + "(" + To_String(Replacement) +
          ").";
  } else if (! Object.hasOwn(WORDS, W)) {
    throw "In Replace_Word, the word must already be in WORDS.";
  }
  WORDS[W] = Replacement;
} // end Replace_Word

//
// Return a list of words from the string.
// Words are separated by spaces.
// Words are non-empty.
// The list of words could be empty.
//
function Split_Into_Words( str ) {
  // FIXME There's probably a simpler way to do this.
  let words = str.split( " " );
  //
  // If the string contains consecutive spaces, we now have
  // words that are the empty string.  Remove those.
  words = words.filter( Is_Nonempty_String );
  return words;
}

//
//
//
function Bind_Words( c ) {
  const verb = To_Downcase( c["verb_str"] );
  const obj = To_Downcase( c["object_str"] );
  
  if (Object.hasOwn(WORDS, verb)) {
    c["verb_id"] = WORDS[verb];
  }
  if (Object.hasOwn(WORDS, obj)) {
    c["object_id"] = WORDS[obj];
  }
  return c;
}

//
// Parse the command string & return a Command.
// A Command is an associative array with 4 members:
//
// 1. "verb_str" is the verb word, if there was one.
//    If not, it's empty string.
//
// 2. "verb_id" is the Thing id of the verb, if we could
//    determine it.  Otherwise, it's NO_SUCH_THING.
//
// 3. "object_str" is the object word, if there was one.
//    Otherwise, it's empty string.
//
// 4. "object_id" is the Thing id of the object, if we
//    could determine it.  Otherwise, NO_SUCH_THING.
//
function Parse( str ) {
  // FIXME There's probably a simpler way to do this.
  let c = { "verb_str": "", "verb_id": NO_SUCH_THING,
            "object_str": "", "object_id": NO_SUCH_THING };
  let words = Split_Into_Words( str );
  
  if (words.length == 0) {
    // No words at all.
  } else if (words.length == 1) {
    c["verb_str"] = words[0];
  } else if (words.length == 2) {
    c["verb_str"] = words[0];
    c["object_str"] = words[1];
  } else {
    throw "Too many words, " + words.length + ".";
  }  
  c = Bind_Words( c );
  return c;
}

//
// Execute the Command.  At this point, the command's parts have
// been "bound" == the string parts are words & the id parts are
// the ids of the Things.
//
// Call the verb Thing's Action function.
//
// Eventually, this will contain the parser/game logic.
//
// For now, return some placeholder text.
//
function Process_Command( command ) {
  let result;
  let c;
  let verb;
  let f;

  c = Parse( command );
  verb = c["verb_id"];
  f = Action[verb];
  f( c );
}

//
// Handle the player pressing Enter.
//
function Submit_Command() {
  const command_elt = document.getElementById( "command" );
  const command_str = command_elt.value;
  let response;

  //
  // We've grabbed the command string from the "command" element.
  // Clear the command element.
  //
  command_elt.value = "";
  //
  // Echo the player's command into the transcript.
  //
  TURN_COUNT = TURN_COUNT + 1;
  Put_Line( "--- [" + TURN_COUNT + "] ---" );
  Put_Line( "> " + command_str );
  //
  try {
    Process_Command( command_str );
  } catch (err) {
    Put_Line( "Process_Command threw something at us.  " + To_String(err) );
  }
}

//
// Callback for keypresses in the COMMAND element.
// When you type Enter, it packs up the string & sends
// it to the Submit_Command procedure.
//
function Command_On_Keydown( event ) {
  if (event.key === "Enter") {
    event.preventDefault();
    Submit_Command();
  }
}

//
// Init the application after the page is loaded.
//
function Window_On_Load( event ) {
  const command_elt = document.getElementById( "command" );
  command_elt.addEventListener( "keydown", Command_On_Keydown );
  //
  // Initial game text.
  // 
  Put_Line( "Coffee Maker (2026-10-04T21:05:04-0700)" );
  Put_Line();
  // Put_Line( "You are standing in the kitchen." );
  Process_Command( "look" );
  Put_Line();
} // end Window_On_Load
window.addEventListener( "load", Window_On_Load );
// end of file
