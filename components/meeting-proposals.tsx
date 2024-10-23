"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { MeetingProposal, TimeRange } from '@/types/calendar';

interface MeetingProposalsProps {
  proposals: MeetingProposal[];
  currentUser: string;
  onVote: (proposalId: string, vote: boolean) => void;
  onPropose: (date: Date, timeRange: TimeRange) => void;
}

export function MeetingProposals({ 
  proposals, 
  currentUser, 
  onVote, 
  onPropose 
}: MeetingProposalsProps) {
  const formatTimeRange = (range: TimeRange) => {
    const formatTime = (hour: number, minute: number) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    return `${formatTime(range.startHour, range.startMinute)} - ${formatTime(range.endHour, range.endMinute)}`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Meeting Proposals</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const totalVotes = Object.values(proposal.votes).length;
            const positiveVotes = Object.values(proposal.votes).filter(v => v).length;
            const userVote = proposal.votes[currentUser];

            return (
              <div
                key={proposal.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {format(new Date(proposal.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeRange(proposal.timeRange)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={userVote === true ? "default" : "outline"}
                      onClick={() => onVote(proposal.id, true)}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={userVote === false ? "default" : "outline"}
                      onClick={() => onVote(proposal.id, false)}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Proposed by: {proposal.proposedBy}</p>
                  <p>{positiveVotes} of {totalVotes} participants agreed</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}