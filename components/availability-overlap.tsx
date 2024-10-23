"use client";

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import type { Participant, OverlapSlot, TimeRange } from '@/types/calendar';

interface AvailabilityOverlapProps {
  participants: Participant[];
  onProposeMeeting: (date: Date, timeRange: TimeRange) => void;
}

export function AvailabilityOverlap({
  participants,
  onProposeMeeting,
}: AvailabilityOverlapProps) {
  const overlappingSlots = useMemo(() => {
    const slots: OverlapSlot[] = [];
    
    // Get all unique dates
    const allDates = new Set(
      participants.flatMap(p => 
        p.availability.map(a => a.date.toDateString())
      )
    );

    allDates.forEach(dateStr => {
      const date = new Date(dateStr);
      
      // Get all availabilities for this date
      const dateAvailabilities = participants
        .map(p => ({
          nickname: p.nickname,
          timeRange: p.availability.find(
            a => a.date.toDateString() === dateStr
          )?.timeRange
        }))
        .filter(a => a.timeRange);

      if (dateAvailabilities.length > 1) {
        // Find overlapping time ranges
        const overlaps = findOverlappingRanges(
          dateAvailabilities.map(a => ({
            nickname: a.nickname,
            range: a.timeRange!
          }))
        );

        slots.push(...overlaps.map(overlap => ({
          date,
          timeRange: overlap.range,
          participants: overlap.participants
        })));
      }
    });

    return slots.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [participants]);

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
      <h3 className="text-lg font-semibold mb-4">Common Availability</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {overlappingSlots.map((slot, index) => (
            <div
              key={`${slot.date.toISOString()}-${index}`}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {format(slot.date, 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeRange(slot.timeRange)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onProposeMeeting(slot.date, slot.timeRange)}
                >
                  Propose Meeting
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Available participants: {slot.participants.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function findOverlappingRanges(availabilities: { nickname: string; range: TimeRange }[]) {
  const overlaps: { range: TimeRange; participants: string[] }[] = [];

  for (let i = 0; i < availabilities.length; i++) {
    for (let j = i + 1; j < availabilities.length; j++) {
      const a = availabilities[i];
      const b = availabilities[j];
      
      const startA = a.range.startHour * 60 + a.range.startMinute;
      const endA = a.range.endHour * 60 + a.range.endMinute;
      const startB = b.range.startHour * 60 + b.range.startMinute;
      const endB = b.range.endHour * 60 + b.range.endMinute;

      const overlapStart = Math.max(startA, startB);
      const overlapEnd = Math.min(endA, endB);

      if (overlapStart < overlapEnd) {
        overlaps.push({
          range: {
            startHour: Math.floor(overlapStart / 60),
            startMinute: overlapStart % 60,
            endHour: Math.floor(overlapEnd / 60),
            endMinute: overlapEnd % 60,
          },
          participants: [a.nickname, b.nickname]
        });
      }
    }
  }

  return overlaps;
}