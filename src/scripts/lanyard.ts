// lanyard.ts
interface Activity {
    name: string;
    application_id?: string;
    type: number;
    details?: string;
    state?: string;
    assets?: {
        large_image?: string;
        small_image?: string;
    };
}

interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    display_name?: string;
}

interface LanyardData {
    discord_user: DiscordUser;
    discord_status: string;
    activities: Activity[];
}


const fetchPresence = async (): Promise<LanyardData | null> => {
    try {
        const response = await fetch('https://api.lanyard.rest/v1/users/614807913302851594');
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const { data }: { data: LanyardData } = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const updatePresence = async (): Promise<void> => {
    const presence = await fetchPresence();
    displayPresence(presence);
};

function extractImageUrl(url: string, application_id?: string): string {
    if (url.startsWith('mp:external/')) {
        return `https://media.discordapp.net/external/${url.replace('mp:external/', '')}`;
    } else if (url.startsWith("spotify:")) {
        return url.replace("spotify:", "https://i.scdn.co/image/");
    } else if (application_id) {
        return `https://cdn.discordapp.com/app-assets/${application_id}/${url}.webp`;
    }
    return url;
}

const displayPresence = async (presence: LanyardData | null): Promise<void> => {
    const container = document.querySelector('.presence-container');
    if (!container) return;

    container.innerHTML = ''; 

    if (!presence) {
        container.innerHTML = 'Loading...';
        return;
    }
    if (presence.activities.length === 0) {
        container.innerHTML = 'Not doing anything right now.';
        return;
    }
    presence.activities.forEach(async (activity, index) => {
        const activityElement = document.createElement('div');
        activityElement.classList.add('activity');
    
        let imageUrl = '/images/default.png'; 
        if (activity.assets?.large_image) {
            imageUrl = extractImageUrl(activity.assets.large_image, activity.application_id);
        } else if (activity.assets?.small_image) {
            imageUrl = extractImageUrl(activity.assets.small_image, activity.application_id);
        }
        console.log('Image URL:', imageUrl); 
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = activity.name;
        imgElement.style.width = '60px'; 
        imgElement.style.borderRadius = '10px';

        activityElement.appendChild(imgElement);

        const detailsElement = document.createElement('div');
        detailsElement.style.display = 'inline-block';
        detailsElement.style.marginLeft = '10px'; 
        detailsElement.innerHTML = `
            <p style="color: var(--accent-gradient); font-size: 20px; font-weight: 600; margin: 2px 0;" class="activityName">${activity.name}</p>
            ${activity.details ? `<p style="margin: 2px;">${activity.details}</p>` : ''}
            ${activity.state ? `<p style="margin: 2px;">${activity.state}</p>` : ''}
        `;
    
        activityElement.appendChild(detailsElement);
    
        container.appendChild(activityElement);
    });
};
    
updatePresence();

setInterval(updatePresence, 10000);
