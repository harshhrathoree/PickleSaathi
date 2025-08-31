// components/Events.tsx
"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EventCard from "./EventCard";
import Link from "next/link";

export default function Events() {
  const events = [
    { venue: "ABC Sports Arena", day: "Saturday", time: "5:00 PM", players: 6, maxPlayers: 10, cost: 200, sport: "Pickleball" },
    { venue: "XYZ Turf", day: "Sunday", time: "7:00 AM", players: 8, maxPlayers: 12, cost: 150, sport: "Tennis" },
    { venue: "Metro Courts", day: "Friday", time: "8:30 PM", players: 4, maxPlayers: 8, cost: 250, sport: "Badminton" },
    { venue: "City Grounds", day: "Monday", time: "6:00 PM", players: 10, maxPlayers: 10, cost: 300, sport: "Basketball" },
    { venue: "Green Valley Club", day: "Tuesday", time: "4:00 PM", players: 3, maxPlayers: 6, cost: 180, sport: "Pickleball" },
    { venue: "Sports Hub", day: "Wednesday", time: "7:30 PM", players: 5, maxPlayers: 8, cost: 220, sport: "Tennis" },
    { venue: "Elite Courts", day: "Thursday", time: "6:30 PM", players: 2, maxPlayers: 4, cost: 350, sport: "Squash" },
    { venue: "Community Center", day: "Saturday", time: "9:00 AM", players: 7, maxPlayers: 12, cost: 120, sport: "Badminton" },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-16 pt-6 md:py-12 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Upcoming Games in Ahmedabad
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Join exciting games happening near you. Connect with local players and book your spot!
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
            {events.map((event, index) => (
              <CarouselItem
                key={index}
                className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <EventCard {...event} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="hidden sm:flex left-2 sm:left-4 bg-white shadow-lg border hover:bg-gray-50 hover:scale-105 transition-all" />
          <CarouselNext className="hidden sm:flex right-2 sm:right-4 bg-white shadow-lg border hover:bg-gray-50 hover:scale-105 transition-all" />
        </Carousel>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <Link href="/games/create">
          <button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105">
            Host Your Own Game
          </button>
          </Link>
          
        </div>
      </div>
    </section>
  );
}