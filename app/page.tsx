/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets, Search, Thermometer, Wind } from "lucide-react";
import { getWeatherData } from "./actions";
import { useState } from "react";
import { WeatherData } from "@/types/weather";
import { Card, CardContent } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Search className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
    </Button>
  );
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  const handleSearch = async (formData: FormData) => {
    setError("");

    const city = formData.get("city") as string;
    const { data, error: weatherError } = await getWeatherData(city);
    console.log(error);

    if (weatherError) {
      setError(weatherError);
      setWeather(null);
    }

    if (data) {
      setWeather(data);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
  <div className="w-full max-w-lg space-y-6">
    {/* Formulario */}
    <form action={handleSearch} className="flex gap-3 bg-white/30 p-3 rounded-lg shadow-md backdrop-blur-lg">
      <Input
        name="city"
        type="text"
        placeholder="Enter city name..."
        className="bg-white/80 border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-blue-400 transition"
        required
      />
      <SubmitButton />
    </form>

    {/* Mensaje de error */}
    {error && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-center text-red-600 bg-red-100 border border-red-300 rounded-lg p-3 shadow-md"
      >
        {error}
      </motion.div>
    )}

    {/* Tarjeta de clima */}
    {weather && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <motion.h2
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-semibold text-gray-800"
              >
                {weather.name}
              </motion.h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                <motion.img
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  width={80}
                  height={80}
                  className="drop-shadow-md"
                />
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl font-bold text-gray-900"
                >
                  {Math.round(weather.main.temp)}°C
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2 text-lg capitalize"
              >
                {weather.weather[0].description}
              </motion.div>
            </div>

            {/* Información adicional */}
            <motion.div
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                {
                  icon: <Thermometer className="w-8 h-8 mx-auto text-orange-500" />,
                  label: "Feels like",
                  value: `${Math.round(weather.main.feels_like)}°C`,
                },
                {
                  icon: <Droplets className="w-8 h-8 mx-auto text-blue-500" />,
                  label: "Humidity",
                  value: `${weather.main.humidity}%`,
                },
                {
                  icon: <Wind className="w-8 h-8 mx-auto text-teal-500" />,
                  label: "Wind",
                  value: `${Math.round(weather.wind.speed)} m/s`,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/70 p-4 rounded-lg shadow-md backdrop-blur-md hover:scale-105 transition"
                  whileHover={{ scale: 1.1 }}
                >
                  {item.icon}
                  <div className="mt-2 text-sm text-gray-500">{item.label}</div>
                  <div className="font-semibold text-gray-900">{item.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )}
  </div>
</div>

  );
}
