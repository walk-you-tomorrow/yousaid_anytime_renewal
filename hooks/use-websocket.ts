"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import type { AvailabilityUpdate, MeetingProposal } from '@/types/calendar';

// Enable client-events for Pusher
const pusherClient = new Pusher('daafa95f2b9c7775071d', {
  cluster: 'ap3',
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
});

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const channelRef = useRef<Pusher.Channel>();

  const connect = useCallback(() => {
    const sessionIdFromUrl = new URLSearchParams(window.location.search).get('session') || 
                            crypto.randomUUID();
    setSessionId(sessionIdFromUrl);

    if (!window.location.search.includes('session')) {
      window.history.replaceState({}, '', `?session=${sessionIdFromUrl}`);
    }

    const channel = pusherClient.subscribe(`presence-session-${sessionIdFromUrl}`);
    channelRef.current = channel;
    
    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherClient.unsubscribe(`presence-session-${sessionIdFromUrl}`);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const sendMessage = (type: string, data: any) => {
    if (channelRef.current) {
      // Use Pusher's client events
      channelRef.current.trigger(`client-${type}`, data);
    }
  };

  const sendAvailability = (update: AvailabilityUpdate) => {
    sendMessage('availability', update);
  };

  const sendProposal = (proposal: MeetingProposal) => {
    sendMessage('proposal', proposal);
  };

  const subscribeToUpdates = (
    onAvailability: (update: AvailabilityUpdate) => void,
    onProposal: (proposal: MeetingProposal) => void
  ) => {
    if (channelRef.current) {
      channelRef.current.bind('client-availability', onAvailability);
      channelRef.current.bind('client-proposal', onProposal);
    }
  };

  return {
    isConnected,
    sessionId,
    sendAvailability,
    sendProposal,
    subscribeToUpdates,
  };
}