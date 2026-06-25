const mineflayer = require('mineflayer');

// Configuration Settings
const config = {
    host: '192.168.0.89',       // Server IP
    port: 25565,             // Server Port
    version: '1.20.1',       // Lock version to skip ping overhead
    auth: 'offline'          // 'offline' for local/cracked, 'microsoft' for premium
};

let bot;

function createBot() {
    // Generate a fresh random 4-digit ID every time the bot connects/reconnects
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const botName = `Bot_${randomId}`;

    console.log(`[🤖] Connecting ${botName} to ${config.host}:${config.port}...`);
    
    bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: botName,
        version: config.version,
        auth: config.auth,
        
        // Performance optimizations:
        viewDistance: 'tiny'        // Drastically reduces memory and network usage
    });

    // Event: Successfully joined the server
    bot.once('spawn', () => {
        console.log(`[✅] ${bot.username} has successfully joined the world.`);
        
        // Disable physics engine calculation (Massive CPU savings, near 0% usage)
        bot.physicsEnabled = false; 
    });

    // Event: Simple chat handler
    bot.on('chat', (username, message) => {
        if (username === bot.username) return; // Ignore itself

        if (message === '!ping') {
            bot.chat(`Pong! I am a ultra-lightweight Node.js bot.`);
        }
    });

    // Event: Handles getting kicked from the server
    bot.on('kick', (reason) => {
        console.log(`[❌] Kicked from server. Reason: ${reason}`);
    });

    // Event: Disconnect handling (trigged on kick or server shutdown)
    bot.on('end', () => {
        console.log('[⚠️] Connection lost. Generating a new name and reconnecting in 5 seconds...');
        setTimeout(createBot, 5000); 
    });

    // Event: Error handling to prevent the entire script from crashing
    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`[❌] Target server is offline or connection was refused.`);
        } else {
            console.error('[💥] Network Error:', err.message);
        }
    });
}

// Start the initial connection cycle
createBot();
