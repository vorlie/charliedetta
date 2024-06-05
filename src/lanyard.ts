// src/lanyard.ts
import { useEffect, useState } from 'react';

const LANYARD_API_URL = 'https://api.lanyard.rest/v1/users/';
const DISCORD_USER_ID = '614807913302851594'; 

interface DiscordPresence {
  activities: Array<any>;
  discord_status: string;
}

export const useLanyard = () => {
  const [presence, setPresence] = useState<DiscordPresence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const response = await fetch(`${LANYARD_API_URL}${DISCORD_USER_ID}`);
        const data = await response.json();
        setPresence(data.data);
      } catch (error) {
        console.error('Error fetching presence:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
  }, []);

  return { presence, loading };
};
