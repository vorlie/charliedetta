// presence.ts
import type { LanyardData, Activity } from './interfaces';
import { fetchPresence, getStatusColor } from './lanyard';

const extractImageUrl = (url: string, application_id?: string): string => {
    if (url.startsWith('mp:external/')) {
        return `https://media.discordapp.net/external/${url.replace('mp:external/', '')}`;
    } else if (url.startsWith("spotify:")) {
        return url.replace("spotify:", "https://i.scdn.co/image/");
    } else if (application_id) {
        return `https://cdn.discordapp.com/app-assets/${application_id}/${url}.webp`;
    }
    return url;
};

const displayPresence = async (presence: LanyardData | null): Promise<void> => {
    const container = document.querySelector('.presence-container');
    if (!container) return;

    container.innerHTML = ''; 

    if (!presence) {
        container.innerHTML = 'Loading...';
        return;
    }

    let hasDisplayableActivity = false;
    
    presence.activities.forEach(async (activity, index) => {
        let isCustomStatus = activity.type === 4;
        let activityDetails = activity.details ?? '';
        let activityState = activity.state ?? '';
        let activityName = activity.name ?? '';
        if (activity.name.toLowerCase().includes('spotify') && presence.spotify) {
            activityName = `Listening to ${presence.spotify.song}`;
            activityDetails = `on ${presence.spotify.album}`;
            activityState = `by ${presence.spotify.artist}`;
        }

        if (isCustomStatus && activity.emoji) {
            return;
        }
        if (isCustomStatus && !activity.emoji) {
            return;
        }
        
        const activityElement = document.createElement('div');
        activityElement.classList.add('activity');
        activityElement.style.backgroundColor = 'var(--color-main-background-secondary)';
        activityElement.style.borderRadius = 'var(--roundness)';
        activityElement.style.padding = '10px 15px';
        const maxWidth = window.innerWidth <= 768 ? '100%' : 'fit-content';
        activityElement.style.maxWidth = maxWidth;

        hasDisplayableActivity = true;
        let imageUrl = '/images/default.png'; 

        if (activity.assets?.large_image) {
            imageUrl = extractImageUrl(activity.assets.large_image, activity.application_id);
        } else if (activity.assets?.small_image) {
            imageUrl = extractImageUrl(activity.assets.small_image, activity.application_id);
        }

        const nameElement = document.createElement('p');
        nameElement.style.color = 'var(--accent-gradient)';
        nameElement.style.fontSize = '20px';
        nameElement.style.fontWeight = '600';
        nameElement.style.margin = '2px 0';
        nameElement.className = 'activityName';
        nameElement.title = activityName ?? '';
        nameElement.textContent = activityName ?? '';

        activityElement.appendChild(nameElement);

        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = activity.name;
        imgElement.style.width = '60px';
        imgElement.style.height = '60px';
        imgElement.style.objectFit = 'cover';
        imgElement.style.borderRadius = '10px';

        activityElement.appendChild(imgElement);

        const detailsElement = document.createElement('div');
        detailsElement.style.display = 'inline-block';
        detailsElement.style.marginLeft = '10px'; 
        detailsElement.style.verticalAlign = 'top';

        const maxTextLength = window.innerWidth <= 768 ? 25 : 50;
        const truncateText = (text: string, maxLength: number) => {
            if (text.length > maxLength) {
                return text.slice(0, maxLength) + '...';
            }
            return text;
        }

        if (activityDetails) {
            const detailsTextElement = document.createElement('p');
            detailsTextElement.style.margin = '0';
            detailsTextElement.className = 'activityDetails';
            detailsTextElement.title = activityDetails;
            detailsTextElement.textContent = truncateText(activityDetails, maxTextLength);
            detailsElement.appendChild(detailsTextElement);
        }

        if (activityState) {
            const stateElement = document.createElement('p');
            stateElement.style.margin = '0';
            stateElement.className = 'activityState';
            stateElement.title = activityState;
            stateElement.textContent = truncateText(activityState, maxTextLength);
            detailsElement.appendChild(stateElement);
        }
    
        activityElement.appendChild(detailsElement);

        container.appendChild(activityElement);
    });

    if (!hasDisplayableActivity) {
        container.innerHTML = 'Not doing anything right now.';
    }
};


const updatePresence = async (): Promise<void> => {
    const presence = await fetchPresence();
    displayPresence(presence);
};

updatePresence();
