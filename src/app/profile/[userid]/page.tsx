// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  UserIcon,
  StarIcon,
  EditIcon,
  CameraIcon,
  LogOutIcon,
  AwardIcon,
  CheckCircleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Temporary data for bookings
const currentBookings = [
  {
    id: "1",
    venue: "ABC Sports Arena",
    location: "Bopal",
    date: "2023-11-15",
    time: "6:00 PM",
    duration: "1.5 hours",
    players: 4,
    maxPlayers: 8,
    cost: 200,
    status: "confirmed",
    skillLevel: "Intermediate"
  },
  {
    id: "2",
    venue: "Metro Courts",
    location: "Prahlad Nagar",
    date: "2023-11-18",
    time: "7:30 PM",
    duration: "1 hour",
    players: 2,
    maxPlayers: 4,
    cost: 250,
    status: "confirmed",
    skillLevel: "Advanced"
  },
  {
    id: "3",
    venue: "Green Valley Club",
    location: "SG Highway",
    date: "2023-11-20",
    time: "5:00 PM",
    duration: "2 hours",
    players: 6,
    maxPlayers: 8,
    cost: 300,
    status: "waiting",
    skillLevel: "All Levels"
  }
];

const previousBookings = [
  {
    id: "4",
    venue: "Elite Courts",
    location: "Bodakdev",
    date: "2023-10-10",
    time: "6:30 PM",
    duration: "1.5 hours",
    players: 4,
    maxPlayers: 8,
    cost: 200,
    status: "completed",
    skillLevel: "Intermediate",
    rating: 4.5,
    review: "Great game! Rajesh has excellent sportsmanship."
  },
  {
    id: "5",
    venue: "Community Center",
    location: "Navrangpura",
    date: "2023-09-25",
    time: "4:00 PM",
    duration: "1 hour",
    players: 3,
    maxPlayers: 4,
    cost: 150,
    status: "completed",
    skillLevel: "Beginner",
    rating: 4.0,
    review: "Fun playing with Rajesh, very encouraging to beginners."
  },
  {
    id: "6",
    venue: "Sports Hub",
    location: "Maninagar",
    date: "2023-09-12",
    time: "7:00 PM",
    duration: "2 hours",
    players: 8,
    maxPlayers: 8,
    cost: 250,
    status: "completed",
    skillLevel: "Advanced",
    rating: 5.0,
    review: "Highly competitive player with excellent skills!"
  }
];

// Sample user photos (in a real app, these would come from user uploads)
const userPhotos = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
];

export default function ProfilePage() {
  const { user } = useUser();
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: "Pickleball enthusiast with 3 years of experience. Love playing both singles and doubles!",
    phone: "+91 98765 43210",
    skillLevel: "Intermediate",
    playingStyle: "Aggressive baseliner"
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "waiting":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // In a real app, you would save the profile data to your backend here
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  // Calculate average rating from previous bookings
  const averageRating = previousBookings
    .filter(booking => booking.rating)
    .reduce((acc, booking, index, array) => {
      acc += booking.rating || 0;
      return index === array.length - 1 ? acc / array.length : acc;
    }, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 text-lg">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">{user?.emailAddresses[0]?.emailAddress}</p>
                  
                  <div className="flex items-center mt-3 bg-amber-50 px-3 py-1 rounded-full">
                    <StarIcon className="h-4 w-4 text-amber-500 fill-current mr-1" />
                    <span className="text-amber-800 font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-slate-500 ml-1">({previousBookings.length} reviews)</span>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="w-full space-y-2">
                    <Button 
                      variant={activeMenu === "profile" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveMenu("profile")}
                    >
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant={activeMenu === "bookings" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveMenu("bookings")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      All Bookings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeMenu === "profile" && (
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                      Manage your profile information and photos
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {/* User Rating Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <AwardIcon className="h-5 w-5 mr-2 text-amber-500" />
                      Player Rating & Reviews
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-600">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        <div className="text-slate-600 text-sm mt-1">{previousBookings.length} reviews</div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = previousBookings.filter(b => b.rating === rating).length;
                            const percentage = (count / previousBookings.length) * 100;
                            return (
                              <div key={rating} className="flex items-center">
                                <div className="w-10 text-sm text-slate-600">{rating}</div>
                                <div className="flex-1 h-2 bg-slate-200 rounded-full mx-2">
                                  <div 
                                    className="h-2 bg-amber-500 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <div className="w-10 text-sm text-slate-600">{count}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Photos Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <CameraIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Your Photos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {userPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`User photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all">
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <CameraIcon className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center h-32">
                        <Button variant="ghost" className="flex flex-col">
                          <CameraIcon className="h-6 w-6 text-slate-400 mb-1" />
                          <span className="text-slate-500 text-sm">Add Photo</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="skillLevel">Skill Level</Label>
                            <Input
                              id="skillLevel"
                              value={profileData.skillLevel}
                              onChange={(e) => handleInputChange("skillLevel", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="playingStyle">Playing Style</Label>
                            <Input
                              id="playingStyle"
                              value={profileData.playingStyle}
                              onChange={(e) => handleInputChange("playingStyle", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-500">First Name</Label>
                            <p className="font-medium">{profileData.firstName}</p>
                          </div>
                          <div>
                            <Label className="text-slate-500">Last Name</Label>
                            <p className="font-medium">{profileData.lastName}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-slate-500">Phone Number</Label>
                          <p className="font-medium">{profileData.phone}</p>
                        </div>
                        <div>
                          <Label className="text-slate-500">Bio</Label>
                          <p className="font-medium">{profileData.bio}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-500">Skill Level</Label>
                            <p className="font-medium">{profileData.skillLevel}</p>
                          </div>
                          <div>
                            <Label className="text-slate-500">Playing Style</Label>
                            <p className="font-medium">{profileData.playingStyle}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeMenu === "bookings" && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>
                    Manage your current and previous pickleball game bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="current" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="current">Current Bookings</TabsTrigger>
                      <TabsTrigger value="previous">Booking History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="current" className="space-y-4 mt-6">
                      {currentBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
                          <h3 className="mt-4 text-lg font-medium text-slate-900">No current bookings</h3>
                          <p className="mt-1 text-sm text-slate-500">Get started by booking your first pickleball game.</p>
                          <Button className="mt-4">Book a Game</Button>
                        </div>
                      ) : (
                        currentBookings.map((booking) => (
                          <Card key={booking.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <h3 className="text-lg font-semibold">{booking.venue}</h3>
                                      <Badge variant={getStatusVariant(booking.status)} className="ml-2 capitalize">
                                        {booking.status}
                                      </Badge>
                                    </div>
                                    <p className="text-slate-600 flex items-center mt-1">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      {booking.location}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                      <div className="flex items-center text-sm">
                                        <CalendarIcon className="h-4 w-4 mr-2 text-slate-500" />
                                        {formatDate(booking.date)}
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <ClockIcon className="h-4 w-4 mr-2 text-slate-500" />
                                        {booking.time} • {booking.duration}
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <UsersIcon className="h-4 w-4 mr-2 text-slate-500" />
                                        {booking.players}/{booking.maxPlayers} players
                                      </div>
                                      <div className="flex items-center text-sm">
                                        ₹{booking.cost} per player
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                      <Badge variant="outline" className="bg-slate-100">
                                        {booking.skillLevel}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-2">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    {booking.status === "confirmed" && (
                                      <Button variant="destructive" size="sm">
                                        Cancel Booking
                                      </Button>
                                    )}
                                    {booking.status === "waiting" && (
                                      <Button variant="default" size="sm">
                                        Check Availability
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="previous" className="space-y-4 mt-6">
                      {previousBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
                          <h3 className="mt-4 text-lg font-medium text-slate-900">No booking history</h3>
                          <p className="mt-1 text-sm text-slate-500">Your previous bookings will appear here.</p>
                        </div>
                      ) : (
                        previousBookings.map((booking) => (
                          <Card key={booking.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <h3 className="text-lg font-semibold">{booking.venue}</h3>
                                      <Badge variant={getStatusVariant(booking.status)} className="ml-2 capitalize">
                                        {booking.status}
                                      </Badge>
                                    </div>
                                    <p className="text-slate-600 flex items-center mt-1">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      {booking.location}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                      <div className="flex items-center text-sm">
                                        <CalendarIcon className="h-4 w-4 mr-2 text-slate-500" />
                                        {formatDate(booking.date)}
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <ClockIcon className="h-4 w-4 mr-2 text-slate-500" />
                                        {booking.time} • {booking.duration}
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <UsersIcon className="h-4 w-4 mr-2 text-slate-500" />
                                        {booking.players}/{booking.maxPlayers} players
                                      </div>
                                      <div className="flex items-center text-sm">
                                        ₹{booking.cost} per player
                                      </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                      <Badge variant="outline" className="bg-slate-100">
                                        {booking.skillLevel}
                                      </Badge>
                                    </div>

                                    {booking.rating && (
                                      <div className="mt-4 flex items-center">
                                        <div className="flex mr-2">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                              key={star}
                                              className={`h-4 w-4 ${star <= booking.rating! ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-slate-700 font-medium">{booking.rating.toFixed(1)}</span>
                                      </div>
                                    )}

                                    {booking.review && (
                                      <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-700 italic">"{booking.review}"</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-col gap-2">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    <Button variant="default" size="sm">
                                      Book Again
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}