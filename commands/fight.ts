import {ICommand} from "wokcommands";
import {Channel, Interaction, MessageActionRow, MessageButton, Role} from "discord.js";

let Timer = new Map<string, Date>();
const COOLDOWN = 12

export default {
    category: 'Fight',
    description: 'Try your luck to win SPW immunity',
    slash: "both",
    guildOnly: true,

    callback: async ({interaction: msgInt, channel, guild}) => {
        const correctChannel = guild?.channels.cache.find(channel => channel.name === '⚔│spw-bot-fights')
        if (correctChannel != channel) return console.log(`Incorrect channel "${channel}"`);

        if (Timer.has(msgInt.user.id)) {
            const hours = Math.abs(Timer.get(msgInt.user.id)!.getTime() - Date.now()) / 3600000
            if (hours < COOLDOWN) {
                const h = Math.abs(COOLDOWN - hours); // Change to positive
                const m = (h - Math.floor(h)) * 60
                await msgInt.reply({
                    content: `${msgInt.user}, before u next fight **${Math.floor(h)} H** **${Math.floor(m)} M**`
                })
                return console.log(`before next battle "${COOLDOWN - hours}"`);
            }
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('scratch')
                    .setLabel('SCRATCH😾 him')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('bite')
                    .setLabel('BITE🐶 him')
                    .setStyle('DANGER')
            );

        await msgInt.reply({
            content: `${msgInt.user} entered the ⚔ battlefields\n` +
                'and saw a dark figure rapidly approaching you\n' +
                '**What your actions?**',
            components: [row]
        })

        const filter = (btnInt: Interaction) => msgInt.user.id === btnInt.user.id

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15
        })

        collector.on('end', async (collection) => {
            collection.forEach((click) => {
                console.log(click.user.id, click.customId)
            })

            const member = guild!.members.cache.get(msgInt.user.id)
            const role = guild?.roles.cache.find(role => role.name === 'Immunity') as Role;
            const channel = guild?.channels.cache.find(channel => channel.name === '🛡│spw-immunity')

            if (!member) return console.log(`Can't find member with ID "${member}"`);
            if (!role) return console.log(`Can't find role with ID "${role}"`);
            if (!channel) return console.log(`Can't find channel with ID "${channel}"`);

            if (collection.first()?.customId === 'scratch' || collection.first()?.customId === 'bite') {
                const win = fight()
                await msgInt.editReply({
                    content: getContent(win, msgInt, channel),
                    components: []
                })
                if (win) {
                    member?.roles.add(role)
                }
            } else {
                await msgInt.editReply({
                    content: `${msgInt.user} thought too long and was killed`,
                    components: []
                })
            }
            Timer.set(msgInt.user.id, new Date())
        })
    }
} as ICommand

const getContent = (win: boolean, msgInt: Interaction, channel: Channel) => {
    return win
        ? `You win! ${msgInt.user} defeated enemy! Congratulations🎉! Now you have **Immunity** role. Send your NFT number in ${channel.toString()}!`
        : `You lose! Enemy dodged and killed ${msgInt.user}☠! Better luck next time!`
}

const fight = () => {
    const probWin = 0.07

    return Math.random() <= probWin
}
