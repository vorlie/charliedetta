const generateNavbarHTML = (navbarData: DiscordUser, status: string): string => {
    const displayName = navbarData.display_name || '';
    const username = navbarData.username;

    return `
        <p style="margin: 4px auto;font-weight: 600;font-size: 20px;">${displayName}<span style="color: var(--accent-gradient);"> @${username}</span></p>
        <div class="badges">
            <img src="/images/${status}.png" style="width: 15px; margin:auto" alt="${status}">
        </div>
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
    if (!navbar || !navbarData) return;

    const avatarImg = navbar.querySelector('img');
    const userInfo = navbar.querySelector('.userinfo');

    if (userInfo) {
        const status = navbarData.discord_status;
        userInfo.innerHTML = generateNavbarHTML(navbarData.discord_user, status);
    }

    if (avatarImg) {
        avatarImg.src = `https://cdn.discordapp.com/avatars/${navbarData.discord_user.id}/${navbarData.discord_user.avatar}.png`;
        avatarImg.alt = 'User Avatar';
    }
};

updateNavbar();

setInterval(updateNavbar, 10000);
