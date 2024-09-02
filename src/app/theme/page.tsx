"use client";
import Switch from "react-switch";
import { useEffect, useState } from "react";
import Image from "next/image";
export function ThemeToggle() {
  const [currentTheme, setCurrenTheme] = useState(false);

  const handleChangeTheme = () => {
    const newTheme = !currentTheme;
    setCurrenTheme(newTheme);
    localStorage.setItem("darkMode", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "dark") {
      setCurrenTheme(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className=" flex   justify-between  lg:justify-around xl:px-44 pt-8 ">
      <Image
        src="/logo.svg"
        alt="logo"
        width={62}
        height={10}
        className="pl-8"
      />
      <div className="flex items-center gap-x-4">
        <Switch
          checked={currentTheme}
          onChange={handleChangeTheme}
          onColor="#0000FF"
          uncheckedIcon={false}
          checkedIcon={false}
        />
        <Image
          src="/icon-moon.svg"
          alt="moon-icon"
          width={54}
          height={10}
          className="pr-8"
        />
      </div>
    </div>
  );
}
