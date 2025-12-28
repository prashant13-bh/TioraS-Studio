'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Shield } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: string;
  id: string;
}

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      if (user) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            setNewName(data.name || '');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, loading, router, toast]);

  const handleUpdateProfile = async () => {
    if (!user || !userData) return;

    setIsSaving(true);
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'users', user.uid), {
        name: newName,
      });
      
      setUserData({ ...userData, name: newName });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) {
    return null; // Or an error state
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-muted-foreground">
              <Mail className="size-4" />
              <span>{userData.email}</span>
            </div>
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-muted-foreground">
              <Shield className="size-4" />
              <span className="capitalize">{userData.role}</span>
            </div>
            <p className="text-xs text-muted-foreground">Role is managed by administrators.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Your Name"
                />
                <Button onClick={handleUpdateProfile} disabled={isSaving}>
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
                </Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span>{userData.name || 'No name set'}</span>
                </div>
                <Button variant="link" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
