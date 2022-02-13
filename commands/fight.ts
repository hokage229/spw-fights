import {ICommand} from "wokcommands";
import {Channel, Interaction, MessageActionRow, MessageButton, Role} from "discord.js";

export default {
    category: 'Fight',
    description: 'Try your luck to win SPW immunity',
    slash: true,
    guildOnly: true,

    callback: async ({interaction: msgInt, channel, guild}) => {
        const correctChannel = guild?.channels.cache.find(channel => channel.name === 'fights')
        if (correctChannel != channel) return console.log(`Incorrect channel "${channel}"`);

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
            )

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
            time: 1000 * 30
        })

        collector.on('end', async (collection) => {
            collection.forEach((click) => {
                console.log(click.user.id, click.customId)
            })

            const member = guild!.members.cache.get(msgInt.user.id)
            const role = guild?.roles.cache.find(role => role.name === 'Immunity') as Role;
            const channel = guild?.channels.cache.find(channel => channel.name === 'immunity')

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
        })
    }
} as ICommand

const getContent = (win: boolean, msgInt: Interaction, channel: Channel) => {
    return win
        ? `${msgInt.user} defeated enemy! Congratulations🎉! Now you have **Immunity** role. Visit ${channel.toString()}`
        : `Enemy dodged and killed ${msgInt.user}☠! Better luck next time`
}

const fight = () => {
    const probWin = 0.1

    return Math.random() <= probWin
}
