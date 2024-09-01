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
      setError(null);

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

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="flex   flex-col justify-center items-center pt-10 pb-6 px-4   ">
      <div className="relative flex items-center  justify-center w-full">
        <input
          type="text"
          className="border-2  px-8 py-4 bg-gray-100 rounded-2xl w-11/12"
          value={word}
          onChange={(e) => setWord((e.target as HTMLInputElement).value)}
          placeholder="search a word"
        ></input>

        <img
          src="/searchIcon.svg"
          className="absolute right-4 mr-6"
          onClick={() => fetchDefinition()}
        />
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <div className="ml-4">
        <div>
          <div className="flex justify-between items-center pt-10">
            <div className=" flex flex-col gap-y-2">
              <h1>{fetchedWordData?.word}</h1>

              {fetchedWordData &&
                fetchedWordData.phonetics &&
                fetchedWordData?.phonetics.length > 0 && (
                  <h3 className="text-sky-600">
                    {fetchedWordData.phonetics[0].text}
                  </h3>
                )}
            </div>

            {fetchedWordData && fetchedWordData.phonetics.length > 0 && (
              <button
                onClick={() => playAudio(fetchedWordData.phonetics[0].audio!)}
                className="w-14 mr-6"
              >
                <img src="/icon-play.svg" alt="Play audio" />
              </button>
            )}
          </div>
        </div>

        {fetchedWordData?.meanings.map((meaning, index) => (
          <div key={index}>
            <div className="flex items-center">
              <h2 className="mr-4 py-4">{meaning.partOfSpeech}</h2>
              <div className=" flex-grow border-t border-gray-300 mr-4"></div>
            </div>

            <div className="flex flex-col items-start">
              <h3 className="pb-4">Meaning</h3>
              <ul className="list-disc marker:text-sky-600 ml-4 pb-4">
                {meaning.definitions.map((def, index) => (
                  <li key={index} className="pb-4">
                    {def.definition}
                    {def.example && (
                      <p className="text-customGray pt-2 pb-2">
                        "{def.example}"
                      </p>
                    )}
                  </li>
                ))}
              </ul>{" "}
            </div>
            {meaning.definitions[0].synonyms && (
              <div>
                <span>Synonyms</span>
                <span>{meaning.definitions[0].synonyms.join(",")}</span>
              </div>
            )}
          </div>
        ))}

        <div className=" border-t border-gray-300 mt-2"></div>

        {fetchedWordData?.sourceUrls && (
          <div className="flex flex-col mt-4">
            <label className="font-semibold text-gray-500  underline underline-offset-4 decoration-gray-300 ">
              Source:{" "}
            </label>
            <a
              href={fetchedWordData.sourceUrls[0]}
              className="text-blacl underline underline-offset-2 decoration-black pt-2"
            >
              {fetchedWordData.sourceUrls[0]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
