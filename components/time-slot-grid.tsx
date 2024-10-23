"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { TimeRange } from '@/types/calendar';

interface TimeSlotGridProps {
  date: Date;
  timeRange: TimeRange | null;
  onTimeRangeChange: (range: TimeRange | null) => void;
}

export function TimeSlotGrid({ date, timeRange, onTimeRangeChange }: TimeSlotGridProps) {
  const [range, setRange] = useState<[number, number]>([540, 1020]); // 9:00 AM to 5:00 PM default

  useEffect(() => {
    if (timeRange) {
      const startMinutes = timeRange.startHour * 60 + timeRange.startMinute;
      const endMinutes = timeRange.endHour * 60 + timeRange.endMinute;
      setRange([startMinutes, endMinutes]);
    }
  }, [timeRange]);

  const minutesToTimeString = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const handleTimeRangeChange = (values: number[]) => {
    const [start, end] = values as [number, number];
    setRange([start, end]);

    const newRange: TimeRange = {
      startHour: Math.floor(start / 60),
      startMinute: start % 60,
      endHour: Math.floor(end / 60),
      endMinute: end % 60,
    };

    onTimeRangeChange(newRange);
  };

  const clearTimeRange = () => {
    onTimeRangeChange(null);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Select Available Time Range</Label>
        <div className="pt-4 px-2">
          <Slider
            min={0}
            max={1440}
            step={30}
            value={range}
            onValueChange={handleTimeRangeChange}
            className="my-6"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Start: {minutesToTimeString(range[0])}</span>
          <span>End: {minutesToTimeString(range[1])}</span>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={clearTimeRange}
        className="w-full"
      >
        Clear Time Range
      </Button>
    </div>
  );
}