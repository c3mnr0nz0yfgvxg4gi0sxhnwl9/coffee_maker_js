# coffee_maker_js
an experiment in writing a tiny parser game using table-like data structures in JavaScript


What is this?
-------------

Coffee Maker is a demo of a parser game.  I wrote it to experiment
with using simple, global data structures for a parser game, also to
see how well that works in JavaScript.

You might also enjoy comparing this project to my "coffee_maker_ada".
It's nearly identical to this one except that I write it in Ada, & I wrote
it before I wrote this one.

Motivation
----------

In the first 2 parser games I wrote,  I used an object-oriented style
that'd be obvious to most programmers these days.  In other
words, I had classes such as Thing, Room, Takeable, Avatar, & more.

When reading the source code for some older parser games, I noticed
that they weren't object-oriented at all.  Instead, they used tables
of primitive types.  For example, room descriptions were arrays (or
lists) of char * (or strings).  Locations were in arrays (or lists)
indexed by object id & whose values were other object ids.

(The games I examined were
[Dunnet.el](https://github.com/emacs-mirror/emacs/blob/master/lisp/play/dunnet.el),
[Colossal Cave in C](https://github.com/wh0am1-dev/adventure), &
[Battlestar](https://mirrors.mit.edu/NetBSD/NetBSD-release-11/src/games/battlestar/).)

I wondered how well that style worked for writing parser games in JavaScript.

What I learned
--------------

* global data structures worked well for this
* simple data structures worked well

Parser
------

The parser allows only 1- & 2-word commands.  It's not an Infocom,
Inform, or TADS parser.

Given a string that the user typed, the parser stuffs the first word
into the Verb_Str slot of a Command (of type Command_Type).  If
there's a second word, that goes into the Command's Object_Str.

The Bind_Words procedure looks for the Verb_Str & Object_Str in a
dictionary.  I realized that verbs can be in the dictionary, too.  So
in this game, verbs are Things, though they are located where the
player won't ever see them.  When Bind_Words finds a word in the
dictionary, it stuffs the associated Thing_Id into a slot in the
Command.

A Do_Command function figures out what to do.  Each verb has a pointer
to a procedure that does the work for that verb.

Special cases are what allow games to differ.  Some of the special
cases are in the procedures for the verbs.  Some others are in a
Special_Actions procedure.  I didn't separate them cleanly.  Since the
experiment wasn't about that, I didn't go back & clean it up.

Definitions
-----------

PARSER GAMES are also called text adventures, but some text adventures
present the player with menus & don't read typed commands, so I used
the term "parser game".  Famous parser games include the Infocom
adventures; people still create parser games (& I still play them).

Ada is a general purpose programming language.
