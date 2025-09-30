// function isWordValid(word) {
//   const dictionary = [
//   "ABOUT", "ABOVE", "ACT", "ADD", "AFTER", "AGAIN", "AIM", "AIR", "ALL", "ALMOST",
//   "ALONG", "ALSO", "ALWAYS", "AM", "AMONG", "AN", "AND", "ANGRY", "ANIMAL", "ANOTHER",
//   "ANSWER", "ANY", "APPLE", "ARE", "AROUND", "AS", "ASK", "AT", "AWAY", "BACK",
//   "BACKEND", "BALL", "BAR", "BASE", "BAT", "BE", "BECAUSE", "BED", "BEEN", "BEFORE",
//   "BEGAN", "BEGIN", "BEHIND", "BEING", "BELL", "BERRY", "BEST", "BETTER", "BETWEEN", "BIG",
//   "BIRD", "BLACK", "BLINK", "BLUE", "BOARD", "BOAT", "BODY", "BONUS", "BOOK", "BOOTS",
//   "BOTH", "BOX", "BOY", "BRAVE", "BREAD", "BRICK", "BRIDGE", "BRING", "BROOM", "BROUGHT",
//   "BRUSH", "BUG", "BUILD", "BUT", "BUTTON", "BUTTONS", "BUY", "BY", "CALL", "CAME",
//   "CAN", "CANYON", "CAO", "CAR", "CARRY", "CAT", "CHAIR", "CHANGE", "CHECK", "CHILDREN",
//   "CITY", "CLEAN", "CLOCK", "CLOUD", "CODE", "COOL", "COULD", "COUNTRY", "CROWN", "CUP",
//   "CUT", "DAN", "DATABASE", "DESK", "DEVELOPER", "DEVELOPS", "DID", "DIDNOT", "DOG", "DOE",
//   "DOES", "DOING", "DOLLAR", "DONE", "DOOR", "DOWN", "DRAW", "DREAM", "DRINK", "DRIVE",
//   "DROP", "DRY", "EACH", "EARLY", "EARTH", "EAST", "EAT", "END", "ENOUGH", "EVEN",
//   "EVER", "EVERY", "EXAMPLE", "EYE", "FACE", "FACT", "FALL", "FAMILY", "FAN", "FAR",
//   "FARM", "FAST", "FATHER", "FEEL", "FEW", "FIELD", "FIGHT", "FIGMA", "FIGMENT", "FIGURE",
//   "FILL", "FINAL", "FIND", "FINE", "FIRE", "FIRST", "FISH", "FIVE", "FIX", "FLOOD",
//   "FLOOR", "FOG", "FOLLOW", "FOOD", "FOOT", "FOR", "FORM", "FOUND", "FOUR", "FREE",
//   "FRIEND", "FROM", "FRONT", "FRONTEND", "FRUIT", "FUN", "FUNNY", "GAME", "GAMES", "GATO",
//   "GAVE", "GENIUS", "GET", "GIRL", "GIVE", "GLASS", "GLOVE", "GO", "GOD", "GOLD",
//   "GONE", "GOOD", "GOT", "GOVERN", "GRASS", "GREAT", "GREEN", "GROUND", "GROUP", "GROW",
//   "GUESS", "HACKING", "HAD", "HALF", "HAND", "HAPPEN", "HAPPY", "HARD", "HAS", "HAT",
//   "HAVE", "HE", "HEAD", "HEAR", "HEARD", "HEART", "HELP", "HELLO", "HEN", "HER",
//   "HERE", "HEY", "HIGH", "HILL", "HIM", "HIMSELF", "HIS", "HOLD", "HOME", "HONEY",
//   "HORSE", "HOT", "HOUR", "HOUSE", "HOW", "HUE", "HUNDRED", "I", "IDEA", "IF",
//   "IMPORTANT", "IN", "INCH", "INPUT", "INPUTTER", "INTO", "INK", "IS", "IT", "JAM",
//   "JAR", "JAVASCRIPT", "JOB", "JOKER", "JOURNAL", "JUST", "KEEP", "KEY", "KEYWORD", "KIND",
//   "KING", "KNEW", "KNOW", "LAND", "LANGUAGE", "LARGE", "LAST", "LATE", "LATER", "LAUGH",
//   "LAW", "LAY", "LEAD", "LEAF", "LEARN", "LEAVE", "LEFT", "LEG", "LEMON", "LENGTH",
//   "LESS", "LET", "LETTER", "LEVELS", "LID", "LIFE", "LIGHT", "LIKE", "LINE", "LIST",
//   "LISTEN", "LITTLE", "LIVE", "LOG", "LONG", "LOOK", "LOSERS", "LOUD", "LOVE", "LOW",
//   "MACHINE", "MADE", "MAKE", "MANGO", "MAN", "MANY", "MAP", "MARK", "MATCH", "MAT",
//   "MAY", "ME", "MEAN", "MEN", "MIDDLE", "MIGHT", "MILE", "MILK", "MIND", "MINE",
//   "MISS", "MONEY", "MONTH", "MOON", "MORE", "MORNING", "MOST", "MOTHER", "MOUNTAIN", "MOUSE",
//   "MOVE", "MUG", "MUSIC", "MUST", "MY", "NAME", "NEAR", "NEH", "NEVER", "NEW",
//   "NEXT", "NICE", "NIGHT", "NO", "NORTH", "NOT", "NOTHING", "NOTICE", "NOW", "NUMBER",
//   "NURSE", "OF", "OFF", "OFTEN", "OH", "OLD", "ON", "ONCE", "ONE", "ONLY",
//   "OPEN", "OR", "OTHER", "OUR", "OUT", "OVER", "OWN", "PAGE", "PAM", "PAPER",
//   "PART", "PASS", "PAST", "PAT", "PATH", "PAY", "PEACH", "PEOPLE", "PERHAPS", "PEN",
//   "PERSON", "PICTURE", "PIECE", "PIN", "PLACE", "PLAN", "PLANE", "PLANT", "PLAY", "PLAYER",
//   "POINT", "POINTS", "POT", "POWER", "PRESS", "PRETTY", "PROBLEM", "PROJECTS", "PROUD", "PYRAMIDS",
//   "PYTHON", "PYTHONIC", "QUESTION", "QUEUE", "QUIET", "QUICK", "QUICKLY", "RACE", "RACK", "RACKS",
//   "RADIO", "RAIN", "RAN", "RAT", "READ", "READY", "REACT", "REACTOR", "REAL", "RED",
//   "REMEMBER", "RESET", "REST", "RESULT", "RICH", "RIDE", "RIG", "RIGA", "RIGHT", "RIVER",
//   "ROAD", "ROCK", "ROCKY", "ROG", "ROLL", "ROOM", "ROUND", "ROW", "RULE", "RUN",
//   "RUDE", "SAID", "SAME", "SCORE", "SCHOOL", "SCIENCE", "SCRABBLE", "SECOND", "SEE", "SEEM",
//   "SEEN", "SELL", "SEND", "SENSE", "SENT", "SEVERAL", "SHE", "SHEET", "SHELL", "SHIP",
//   "SHOULD", "SHOW", "SHY", "SIDE", "SIGN", "SIMPLE", "SINCE", "SING", "SISTER", "SIT",
//   "SIX", "SIZE", "SLEEP", "SLOPE", "SLOW", "SMART", "SMALL", "SNOW", "SNAKE", "SO",
//   "SOH", "SOME", "SON", "SONG", "SOON", "SOUND", "SOUTH", "SPACE", "SPEAK", "SPECIAL",
//   "SPELL", "SPRING", "START", "STATE", "STAY", "STEP", "STILL", "STONE", "STOOD", "STOP",
//   "STORE", "STORM", "STORY", "STREET", "STRONG", "STUDY", "SUGAR", "SUCH", "SUDDENLY", "SUM",
//   "SUMMER", "SUN", "SURE", "SWORD", "TABLE", "TAKE", "TALL", "TALK", "TANK", "TAX",
//   "TEACH", "TELL", "TEN", "TEST", "THAN", "THAT", "THE", "THEIR", "THEM", "THEN",
//   "THERE", "THESE", "THEY", "THING", "THINK", "THIRD", "THIS", "THOSE", "THOUGH", "THOUGHT",
//   "THREE", "THROUGH", "TIE", "TIGER", "TILE", "TILES", "TIME", "TIMER", "TIN", "TIP",
//   "TIRED", "TO", "TODAY", "TOGETHER", "TOLD", "TOO", "TOOK", "TOP", "TOTAL", "TOUCH",
//   "TOWN", "TRACK", "TRADE", "TRAIN", "TREE", "TREES", "TRIED", "TRIP", "TROUBLE", "TRUE",
//   "TRUCK", "TRY", "TURN", "TWO", "UNDER", "UNTIL", "UP", "US", "USE", "USUALLY",
//   "VALID", "VAN", "VAPOR", "VARIABLE", "VERY", "VOICE", "VIOLETS", "VOTE", "WALK", "WANT",
//   "WAR", "WARM", "WAS", "WATCH", "WATER", "WAY", "WE", "WEB", "WEEK", "WEIGHT",
//   "WELL", "WENT", "WEIRD", "WERE", "WEST", "WHAT", "WHEN", "WHERE", "WHICH", "WHILE",
//   "WHITE", "WHO", "WHOLE", "WHY", "WILL", "WIN", "WIND", "WINDOW", "WINNER", "WINTER",
//   "WISH", "WITH", "WOMAN", "WOMEN", "WON", "WOOD", "WORD", "WORDS", "WORK", "WORLD",
//   "WOULD", "WRITE", "WRITTEN", "WRONG", "WROTE", "YEAR", "YELLOW", "YES", "YET", "YOU",
//   "YOUNG", "YOUR", "ZIP", "ZEBRA"
// ];

//   return dictionary.includes(word.toUpperCase());
// }

// export default isWordValid;

async function isWordValid(word) {

  if (!word || word.length < 2) {
    return false;
  }

  try {
    const response = await fetch (`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (response.ok) {
      return true;
    }

    return false;
  }

    catch (error) {
      console.error("Error validating word:", error);
      return false;
    }   
    
}

export default isWordValid;

