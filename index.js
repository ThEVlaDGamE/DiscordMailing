// Импорт библиотеки
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js')
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
})

// Функция остановки программы на заданное время
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

// Ваше ID. Впиши его сюда, если хотите получить ссылки на все сервера в ЛС
let ownerId = "";

bot.on('ready', async () => {
    console.log(`Запустился бот ${bot.user.username}`);
    
    // Получение всех серверов, где есть бот
    let guilds = await bot.guilds.cache.toJSON();
    // Получение владельца
    let owner = await bot.users.fetch(ownerId);

    for (let i = 0; i < guilds.length; i++) {
        // Получение бота, как участника сервера
        let member = await guilds[i].members.fetch(bot.user.id);

        // Получение списка каналов сервера
        let channels = guilds[i].channels.cache.toJSON();
        // Сортировка каналов по позиции (так, как их видно визуально)
        channels.sort((prev, next) => prev.rawPosition - next.rawPosition);

        for (let j = 0; j < channels.length; j++)  {  
            // Если канал текстовый
            if (channels[j].type == 0) {
                // Если у бота есть право смотреть канал
                if (channels[j].permissionsFor(member).has(PermissionsBitField.Flags.ViewChannel)) {
                    // Если у бота есть право писать в канале
                    if (channels[j].permissionsFor(member).has(PermissionsBitField.Flags.SendMessages)) {
                        // Отправка в консоль названия сервера
                        console.log(guilds[i].name);
                        // Отправка сообщения
                        channels[j].send("**Рассылка**");

                        // Если есть ID владельца, создать приглашение, отправить его в ЛС
                        if (ownerId != "") {
                            let invite = await channels[j].createInvite({ temporary: true });
                            owner.send(`https://discord.gg/${invite.code}`);
                        }

                        // Подождать, перейти к следующему серверу
                        sleep(1200);
                        break;
                    }
                }
            }
        }
    }
    console.log("Готово!");
});

// Сюда впишите токен вашего бота
bot.login("");