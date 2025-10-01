

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

