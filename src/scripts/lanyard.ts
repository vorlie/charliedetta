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
        activityElement.style.backgroundColor = 'var(--color-main-background-secondary)';
        activityElement.style.borderRadius = 'var(--roundness)';
        activityElement.style.padding = '10px';
    
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
        imgElement.style.height = '60px';
        imgElement.style.objectFit = 'cover';
        imgElement.style.borderRadius = '10px';

        activityElement.appendChild(imgElement);

        const detailsElement = document.createElement('div');
        detailsElement.style.display = 'inline-block';
        detailsElement.style.marginLeft = '10px'; 
        const maxTextLength = window.innerWidth <= 768 ? 25 : 50;
        detailsElement.innerHTML = `
            <p style="color: var(--accent-gradient); font-size: 20px; font-weight: 600; margin: 2px 0;" class="activityName">${activity.name}</p>
            ${activity.details ? `<p style="margin: 2px;" class="activityDetails">${truncateText(activity.details, maxTextLength)}</p>` : '<p style="margin: 2px;" class="activityState">N/A</p>'}
            ${activity.state ? `<p style="margin: 2px;" class="activityState">${truncateText(activity.state, maxTextLength)}</p>` : '<p style="margin: 2px;" class="activityState">N/A</p>'}
        `;
    
        activityElement.appendChild(detailsElement);
    
        container.appendChild(activityElement);
    });
};

const generateNavbarHTML = (navbarData: DiscordUser): string => {
    const displayName = navbarData.display_name || '';
    const username = navbarData.username;

    return `
        <p style="margin: 4px auto;font-weight: 600;font-size: 20px;">${displayName}<span style="color: var(--accent-gradient);"> @${username}</span></p>
    `;
};

const displayNavbar = (navbarData: LanyardData | null): void => {
    const navbar = document.querySelector('.vorlie');
    if (!navbar || !navbarData) {
        if (navbar) {
            navbar.innerHTML = '<p>Loading...</p>';
        }
        return;
    }

    const avatarImg = navbar.querySelector('img');
    const userInfo = navbar.querySelector('.userinfo');

    if (userInfo) {
        userInfo.innerHTML = generateNavbarHTML(navbarData.discord_user);
    }

    if (avatarImg) {
        avatarImg.src = `https://cdn.discordapp.com/avatars/${navbarData.discord_user.id}/${navbarData.discord_user.avatar}.png`;
        avatarImg.alt = 'User Avatar';
        avatarImg.style.borderColor = getStatusColor(navbarData.discord_status);
    }
};
const updateNavbar = async (): Promise<void> => {
    const navbarData = await fetchPresence();
    displayNavbar(navbarData);
};
const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;

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
    const navbarData = await fetchPresence();
    displayPresence(presence);
    displayNavbar(navbarData);
}

setInterval(updateBoth, 10000);
