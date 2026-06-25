const mineflayer = require('mineflayer');

// Configuration - Change these to match your server
const config = {
    host: 'localhost',       // Server IP
    port: 25565,             // Server Port
    username: 'LightBot',    // Bot's username
    version: '1.20.1',       // Set specific version to skip auto-ordering/ping overhead
    auth: 'offline'          // 'offline' for cracked/local, 'microsoft' for premium
};

let bot;

function createBot() {
    console.log(`[🤖] Connecting to ${config.host}:${config.port}...`);
    
    bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
        auth: config.auth,
        
        // Performance optimizations:
        viewDistance: 'tiny',       // Reduces chunk data the bot tries to load/track
        physicsEnabled: true        // Set to false if the bot never needs to move (massive CPU savings)
    });

    // Event: Bot successfully spawns into the world
    bot.once('spawn', () => {
        console.log(`[✅] ${bot.username} has joined the server.`);
        
        // Disable heavy features if not needed (e.g., tracking entities slows down performance)
        // bot.spyMode = false; 
    });

    // Event: Listening to chat
    bot.on('chat', (username, message) => {
        // Prevent the bot from responding to itself
        if (username === bot.username) return;

        // Example trigger command
        if (message === '!ping') {
            bot.chat(`Pong! I am running on a lightweight Node.js core.`);
        }
    });

    // Event: Kicked or disconnected
    bot.on('kick', (reason) => {
        console.log(`[❌] Kicked from server. Reason: ${reason}`);
    });

    bot.on('end', () => {
        console.log('[⚠️] Disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000); // Auto-reconnect loop
    });

    // Event: Error handling to prevent the script from crashing
    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`[❌] Connection refused to ${err.address}:${err.port}`);
        } else {
            console.error('[💥] Error encountered:', err);
        }
    });
}

// Start the bot
createBot();