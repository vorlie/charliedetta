const generateNavbarHTML = (navbarData: DiscordUser): string => {
    const displayName = navbarData.display_name || '';
    const username = navbarData.username;

    return `
        <p style="margin: 4px auto;font-weight: 600;font-size: 20px;">${displayName}<span style="color: var(--accent-gradient);"> @${username}</span></p>
    `;
};

const fetchNavbarData = async (): Promise<LanyardData | null> => {
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

const updateNavbar = async (): Promise<void> => {
    const navbarData = await fetchNavbarData();
    displayNavbar(navbarData);
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


updateNavbar();

setInterval(updateNavbar, 10000);
