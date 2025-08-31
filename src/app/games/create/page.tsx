// app/host-game/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyIcon,
  ZapIcon,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const pickleballVenues = [
  { id: "abc-sports-arena", name: "ABC Sports Arena", location: "Bopal", courts: 4, surface: "Indoor Hard Court", amenities: ["Parking", "Restrooms", "Water"] },
  { id: "metro-courts", name: "Metro Courts", location: "Prahlad Nagar", courts: 2, surface: "Outdoor Concrete", amenities: ["Parking", "Lighting"] },
  { id: "green-valley-club", name: "Green Valley Club", location: "SG Highway", courts: 3, surface: "Indoor Synthetic", amenities: ["Cafeteria", "Restrooms", "Pro Shop"] },
  { id: "elite-courts", name: "Elite Courts", location: "Bodakdev", courts: 2, surface: "Indoor Hard Court", amenities: ["AC", "Restrooms"] },
  { id: "community-center", name: "Community Center", location: "Navrangpura", courts: 2, surface: "Outdoor Asphalt", amenities: ["Free Parking"] },
  { id: "sports-hub", name: "Sports Hub", location: "Maninagar", courts: 3, surface: "Indoor Composite", amenities: ["Equipment Rental", "Restrooms"] },
];

const timeSlots = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM",
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM",
  "9:00 PM","9:30 PM","10:00 PM",
];

export default function HostGame() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    venue: "",
    date: "",
    time: "",
    playersReady: "",
    maxPlayers: "",
    costPerPlayer: "",
    description: "",
    skillLevel: "",
    duration: "60",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const gameData = {
        ...formData,
        sport: "Pickleball",
        createdAt: new Date().toISOString(),
        gameId: `pb-${Date.now()}`,
        status: "active",
      };

      console.log("Creating pickleball game:", gameData);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
      setTimeout(() => router.push(`/games/${gameData.gameId}`), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.venue &&
    formData.date &&
    formData.time &&
    formData.playersReady &&
    formData.maxPlayers &&
    formData.costPerPlayer &&
    formData.skillLevel;

  const selectedVenue = pickleballVenues.find((v) => v.id === formData.venue);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 sm:py-8">
          <div className="max-w-3xl mx-auto px-3 sm:px-6">
            {showSuccess && (
              <Alert className="mb-6 border-emerald-500 bg-emerald-50">
                <ZapIcon className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">
                  🎉 Your pickleball game has been created successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <Card className="shadow-md border border-slate-200 bg-white text-slate-900">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-t-lg">
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  Host a Pickleball Game
                </CardTitle>
                <CardDescription className="text-emerald-50">
                  Create your pickleball match and invite local players!
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Venue */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-slate-800">
                      <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      Venue
                    </Label>
                    <Select
                      value={formData.venue}
                      onValueChange={(value) => handleInputChange("venue", value)}
                    >
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                        <SelectValue placeholder="Select venue" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900">
                        {pickleballVenues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id} className="focus:bg-slate-100">
                            {venue.name} • {venue.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedVenue && (
                      <div className="bg-slate-100 p-3 rounded-lg text-sm text-slate-700 mt-2">
                        <strong>{selectedVenue.name}</strong> ({selectedVenue.surface},{" "}
                        {selectedVenue.courts} courts)
                        <div className="mt-1 text-xs flex gap-2 flex-wrap">
                          {selectedVenue.amenities.map((a) => (
                            <Badge key={a} variant="outline" className="border-slate-300 text-slate-600 bg-slate-200">
                              {a}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Date / Time / Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-800">Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-white border-slate-300 text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-800">Start Time</Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) => handleInputChange("time", value)}
                      >
                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-slate-900 max-h-56">
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t} className="focus:bg-slate-100">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-800">Duration</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange("duration", value)}
                    >
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900">
                        <SelectItem value="45" className="focus:bg-slate-100">45 minutes</SelectItem>
                        <SelectItem value="60" className="focus:bg-slate-100">1 hour</SelectItem>
                        <SelectItem value="90" className="focus:bg-slate-100">1.5 hours</SelectItem>
                        <SelectItem value="120" className="focus:bg-slate-100">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Players */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-slate-800">Players Ready</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 2"
                        value={formData.playersReady}
                        onChange={(e) => handleInputChange("playersReady", e.target.value)}
                        className="bg-white border-slate-300 text-slate-900"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-800">Max Players</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 8"
                        value={formData.maxPlayers}
                        onChange={(e) => handleInputChange("maxPlayers", e.target.value)}
                        className="bg-white border-slate-300 text-slate-900"
                        min="2"
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Skill Level + Cost */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-slate-800">Skill Level</Label>
                      <Select
                        value={formData.skillLevel}
                        onValueChange={(value) => handleInputChange("skillLevel", value)}
                      >
                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                          <SelectValue placeholder="Choose level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-slate-900">
                          <SelectItem value="beginner" className="focus:bg-slate-100">Beginner (1.0-2.5)</SelectItem>
                          <SelectItem value="intermediate" className="focus:bg-slate-100">Intermediate (3.0-3.5)</SelectItem>
                          <SelectItem value="advanced" className="focus:bg-slate-100">Advanced (4.0+)</SelectItem>
                          <SelectItem value="all-levels" className="focus:bg-slate-100">All Levels Welcome</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-800">Cost per Player</Label>
                      <Input
                        type="number"
                        placeholder="200"
                        value={formData.costPerPlayer}
                        onChange={(e) => handleInputChange("costPerPlayer", e.target.value)}
                        className="bg-white border-slate-300 text-slate-900"
                        min="0"
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-200" />

                  {/* Description */}
                  <div>
                    <Label className="text-slate-800">Additional Details</Label>
                    <Textarea
                      placeholder="Any rules or info..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white mb-3 sm:mb-0"
                    >
                      {isSubmitting ? "Creating..." : "Host Game"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}