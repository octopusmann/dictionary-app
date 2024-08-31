"use client";
import { useState } from "react";

interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface WordData {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
}

export default function Home() {
  const [word, setWord] = useState("");
  const [fetchedWordData, setFetchedWordData] = useState<WordData | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = async () => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!response.ok) throw new Error("Word not found");

      const data: WordData[] = await response.json();
      console.log(data);
      setFetchedWordData({
        word: data[0].word,
        phonetics: data[0].phonetics,
        meanings: data[0].meanings.map((m: Meaning) => ({
          partOfSpeech: m.partOfSpeech,
          definitions: m.definitions.map((d: Definition) => ({
            definition: d.definition,
            example: d.example,
            synonyms: d.synonyms,
            antonyms: d.antonyms,
          })),
        })),
        sourceUrls: data[0].sourceUrls,
      });
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  };

  return (
    <div className="flex  flex-col justify-center items-center pt-10 ">
      <div className="relative flex items-center  justify-end">
        <input
          type="text"
          className="border-2 px-8 py-2"
          value={word}
          onChange={(e) => setWord((e.target as HTMLInputElement).value)}
          placeholder="search a word"
        ></input>

        <img
          src="/searchIcon.svg"
          className="absolute mr-3"
          onClick={() => fetchDefinition()}
        />
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <h1>{fetchedWordData?.word}</h1>

      <div>
        {fetchedWordData?.phonetics.map((phonetic, index) => (
          <div key={index}>
            <h3>{phonetic.text}</h3>
          </div>
        ))}

        {fetchedWordData?.meanings.map((meaning, index) => (
          <div key={index}>
            <h2>{meaning.partOfSpeech}</h2>

            <h3>Meaning</h3>
            <ul>
              {meaning.definitions.map((def, index) => (
                <li key={index}>
                  {def.definition}
                  {def.example && <p>{def.example}</p>}
                </li>
              ))}
            </ul>
            {meaning.definitions[0].synonyms && (
              <div>
                <span>Synonyms</span>
                <span>{meaning.definitions[0].synonyms.join(",")}</span>
              </div>
            )}
          </div>
        ))}

        {fetchedWordData?.sourceUrls && (
          <div className="flex flex-col mt-4">
            <label className="font-semibold">Source: </label>
            <a
              href={fetchedWordData.sourceUrls[0]}
              className="text-blue-600 underline"
            >
              {fetchedWordData.sourceUrls[0]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
