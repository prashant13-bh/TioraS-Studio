"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, MapPin, Mail, Phone } from "lucide-react";
import { useUser } from "@/firebase";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Meta Card */}
        <Card className="col-span-full lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="relative h-32 w-32 mb-4">
              <Image
                src={user.photoURL || "https://github.com/shadcn.png"}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-muted"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
            <p className="text-muted-foreground">Customer</p>
            
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info & Address */}
        <div className="col-span-full lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" defaultValue={user.displayName || ""} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Full Name</Label>
                  <p className="font-medium">{user.displayName || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Placeholder */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Address Book</CardTitle>
                <CardDescription>Manage your shipping addresses.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                 <a href="/dashboard/addresses">Manage Addresses</a>
              </Button>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">No default address set.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
