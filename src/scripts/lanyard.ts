// lanyard.ts
interface Activity {
    name: string;
    application_id?: string;
    emoji?: {
        name: string;
    }
    type: number;
    details?: string;
    state?: string;
    assets?: {
        large_image?: string;
        small_image?: string;
    };
}

interface AvatarDecoration {
    asset: string;
    sku_id: number;
}

interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    display_name?: string;
    avatar_decoration_data?: AvatarDecoration;
}

interface LanyardData {
    discord_user: DiscordUser;
    discord_status: string;
    activities: Activity[];
    spotify?: Spotify;
}
interface Spotify {
    track_id: string;
    timestamps: {
        start: number;
        end: number;
    };
    album: string;
    album_art_url: string;
    artist: string;
    song: string;
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

    let hasDisplayableActivity = false;
    
    presence.activities.forEach(async (activity, index) => {
        let isCustomStatus = activity.type === 4;

        if (isCustomStatus && activity.emoji) {
            return;
        }
        const activityElement = document.createElement('div');
        activityElement.classList.add('activity');
        activityElement.style.backgroundColor = 'var(--color-main-background-secondary)';
        activityElement.style.borderRadius = 'var(--roundness)';
        activityElement.style.padding = '10px';
        const maxWidth = window.innerWidth <= 768 ? '100%' : 'fit-content';
        activityElement.style.maxWidth = maxWidth;

        hasDisplayableActivity = true;
        let imageUrl = '/images/default.png'; 


        if (activity.assets?.large_image) {
            imageUrl = extractImageUrl(activity.assets.large_image, activity.application_id);
        } else if (activity.assets?.small_image) {
            imageUrl = extractImageUrl(activity.assets.small_image, activity.application_id);
        }

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
        const maxTextLength = window.innerWidth <= 768 ? 25 : 50;
        const truncateText = (text: string, maxLength: number) => {
            if (text.length > maxLength) {
                return text.slice(0, maxLength) + '...';
            }
            return text;
        }
        let activityDetails = activity.details ?? '';
        let activityState = activity.state ?? '';
        let activityName = activity.name ?? '';
        if (activity.name.toLowerCase().includes('spotify') && presence.spotify) {
            activityName = `Listening to ${presence.spotify.song}`;
            activityDetails = `on ${presence.spotify.album}`;
            activityState = `by ${presence.spotify.artist}`;

        }

        detailsElement.innerHTML = `
        
            <p 
                style="color: var(--accent-gradient); 
                    font-size: 20px; 
                    font-weight: 600; 
                    margin: 2px 0;" 
                class="activityName" 
                title="${activityName}">
                ${truncateText(activityName, maxTextLength)}
            </p>
            ${activityDetails ? `<p 
                style="
                    margin: 2px;" 
                class="activityDetails" 
                title="${activityDetails}">
                ${truncateText(activityDetails, maxTextLength)}</p>` : 
                '<p style="margin: 2px;" class="activityDetails" title="N/A">N/A</p>'}
            ${activityState ? `<p 
                style="
                    margin: 2px;"
                class="activityState" 
                title="${activityState}">
                ${truncateText(activityState, maxTextLength)}</p>` : 
                '<p style="margin: 2px;" class="activityState" title="N/A">N/A</p>'}
        `;
    
        activityElement.appendChild(detailsElement);

        container.appendChild(activityElement);
    });

    if (!hasDisplayableActivity) {
        container.innerHTML = 'Not doing anything right now.';
    }
};

const generateNavbarHTML = (navbarData: DiscordUser): string => {
    const displayName = navbarData.display_name || '';
    const username = navbarData.username;

    return `
        <p style="margin: 4px auto;font-weight: 600;font-size: 20px; color: var(--color-2);">${displayName}<span style="color: var(--color-2);"> @${username}</span></p>
    `;
};

const displayNavbar = (navbarData: LanyardData | null): void => {
    const navbar = document.querySelector('.vorlie');
    const statusContainer = document.querySelector('.status') as HTMLElement;
    if (!navbar || !navbarData || !statusContainer) {
        if (navbar) {
            navbar.innerHTML = '<p>Loading...</p>';
        }
        return;
    }

    const avatarImg = document.getElementById('avatar') as HTMLImageElement;
    const avatarDecoImg = document.getElementById('avatar-deco') as HTMLImageElement;
    const userInfo = navbar.querySelector('.userinfo');
    

    if (userInfo) {
        userInfo.innerHTML = generateNavbarHTML(navbarData.discord_user);
    }

    if (avatarImg) {
        avatarImg.src = `https://cdn.discordapp.com/avatars/${navbarData.discord_user.id}/${navbarData.discord_user.avatar}.png`;
        avatarImg.alt = 'User Avatar';
        avatarImg.style.borderColor = getStatusColor(navbarData.discord_status);
    }

    if (navbarData.discord_user.avatar_decoration_data && avatarDecoImg) {
        avatarDecoImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${navbarData.discord_user.avatar_decoration_data.asset}.png`;
        avatarDecoImg.alt = 'Avatar Decoration';
        avatarDecoImg.style.display = 'block';
    } else if (avatarDecoImg) {
        avatarDecoImg.style.display = 'none';
    }

    const customStatus = navbarData.activities.find(activity => activity.type === 4);
    if (customStatus && customStatus.emoji) {
        const emojiElement = document.createElement('img');
        emojiElement.src = `https://twemoji.maxcdn.com/v/latest/svg/${customStatus.emoji.name.codePointAt(0)!.toString(16)}.svg`;
        emojiElement.alt = customStatus.emoji.name;
        emojiElement.style.width = '24px';
        emojiElement.style.height = '24px';
        emojiElement.style.marginRight = '8px';
        
        const statusState = customStatus.state ?? ''; 
        let statusTextElement: HTMLSpanElement | HTMLAnchorElement;
        if (statusState.startsWith('https://')) {
            const anchorElement = document.createElement('a') as HTMLAnchorElement;
            anchorElement.href = statusState;
            anchorElement.textContent = statusState;
            anchorElement.target = '_blank'; 
            anchorElement.rel = 'noopener noreferrer';
            anchorElement.style.color = 'var(--accent-gradient)';
            anchorElement.style.textDecoration = 'underline';
            
            statusTextElement = anchorElement;
        } else {
            statusTextElement = document.createElement('span');
            statusTextElement.textContent = statusState;
        }

        statusContainer.innerHTML = '';
        statusContainer.appendChild(emojiElement);
        statusContainer.appendChild(statusTextElement);
        statusContainer.style.display = 'flex'; 
    } else {
        statusContainer.innerHTML = '';
        statusContainer.style.display = 'none';
    }
};
const updateNavbar = async (): Promise<void> => {
    const navbarData = await fetchPresence();
    displayNavbar(navbarData);
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'online':
            return 'var(--status-color-online)';
        case 'idle':
            return 'var(--status-color-idle)';
        case 'dnd':
            return 'var(--status-color-dnd)';
        default:
            return 'var(--status-color-offline)';
    }
};



updatePresence();
updateNavbar();


const updateBoth = async (): Promise<void> => {
    const presence = await fetchPresence();
    displayPresence(presence);
    displayNavbar(presence);
}

setInterval(updateBoth, 10000);
