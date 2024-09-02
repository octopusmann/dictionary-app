"use client";
import { useState } from "react";
import Image from "next/image";

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

      if (!response.ok) throw new Error("No Definitions Found");

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
      setFetchedWordData(null);
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="flex flex-col justify-center items-center pt-10 pb-6 px-4  ">
      <div className="relative flex items-center  justify-center w-full  lg:max-w-2xl  ">
        <input
          type="text"
          className="border-2  px-8 py-4 bg-gray-100 dark:bg-gray-900 dark:text-white  rounded-2xl w-11/12"
          value={word}
          onChange={(e) => setWord((e.target as HTMLInputElement).value)}
          placeholder="search a word"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchDefinition();
            }
          }}
        ></input>

        <Image
          alt="searchIcon"
          src="/searchIcon.svg"
          width={15.55}
          height={15.55}
          className="absolute right-4 mr-6 sm:mr-8 md:mr-12 lg:mr-10"
          onClick={() => fetchDefinition()}
        />
      </div>

      {error && (
        <div className="flex flex-col  justify-center items-center gap-y-8 lg:max-w-2xl">
          <Image
            alt="sad-Icon"
            width={64}
            height={64}
            src="/sad.png"
            className="pt-10"
          />
          <h3 className="text-white">{error}</h3>
          <p className="  px-4 text-gray-500">
            Sorry pal, we couldn't find definitions for the word you were
            looking for. You can try the search again at later time or head to
            the web instead.
          </p>
        </div>
      )}

      <div className="ml-4 lg:max-w-xl">
        <div>
          <div className="flex justify-between items-center pt-10">
            <div className=" flex flex-col gap-y-2">
              <h1 className=" text-3xl md:text-5xl font-bold">
                {fetchedWordData?.word}
              </h1>

              {fetchedWordData &&
                fetchedWordData.phonetics &&
                fetchedWordData?.phonetics.length > 0 && (
                  <h3 className="text-sky-600">
                    {fetchedWordData.phonetics[0].text}
                  </h3>
                )}
            </div>

            {fetchedWordData && fetchedWordData.phonetics.length > 0 && (
              <button className="w-14 mr-6">
                <Image
                  src="/icon-play.svg"
                  width={75}
                  height={75}
                  alt="Play audio"
                />
              </button>
            )}
          </div>
        </div>

        {fetchedWordData?.meanings.map((meaning, index) => (
          <div key={index}>
            <div className="flex items-center">
              <h2 className="mr-4 py-4 text-xl font-bold">
                {meaning.partOfSpeech}
              </h2>
              <div className=" flex-grow border-t border-gray-300 mr-4"></div>
            </div>

            <div className="flex flex-col items-start">
              <h3 className="pb-4 text-gray-400">Meaning</h3>
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
              <div className="flex gap-x-3">
                <span className="text-gray-400 pr-2">Synonyms :</span>
                <div className="flex gap-x-1 text-purple-500 font-bold">
                  {meaning.definitions[0].synonyms.map((synonym, index) => (
                    <span>{synonym},</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className=" border-t border-gray-300 mt-2"></div>

        {fetchedWordData?.sourceUrls && (
          <div className="flex flex-col sm:flex sm:flex-row sm:items-center sm:gap-x-4 md:flex md:flex-row md:items-center md:gap-x-4 mt-4 sm:pt-2 md:pt-2">
            <label className="font-semibold text-gray-500  underline underline-offset-4 decoration-gray-300 ">
              Source:{" "}
            </label>
            <a
              href={fetchedWordData.sourceUrls[0]}
              className="text-blacl underline underline-offset-2 decoration-black pt-2 sm:pt-0 md:pt-0"
            >
              {fetchedWordData.sourceUrls[0]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
