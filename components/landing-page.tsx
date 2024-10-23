"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock } from 'lucide-react';

export function LandingPage() {
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleContinue = () => {
    if (!nickname.trim()) {
      toast({
        title: "Nickname required",
        description: "Please enter a nickname to continue",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('anytime-nickname', nickname);
    router.push('/calendar');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Calendar className="w-12 h-12 text-primary" />
            <Clock className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            You Said <span className="text-primary">ANYTIME</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Schedule meetings effortlessly with real-time availability sharing.
            No registration required.
          </p>

          <div className="max-w-md mx-auto space-y-4 w-full">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12 text-lg"
                maxLength={30}
              />
            </div>

            <Button 
              onClick={handleContinue}
              className="w-full h-12 text-lg"
            >
              Continue to Calendar
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Registration</h3>
              <p className="text-muted-foreground">Just enter a nickname and start scheduling</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Real-time Updates</h3>
              <p className="text-muted-foreground">See everyone's availability instantly</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Easy to Share</h3>
              <p className="text-muted-foreground">Share your session link with others</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}