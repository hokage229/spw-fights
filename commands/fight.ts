import {ICommand} from "wokcommands";
import {Interaction, MessageActionRow, MessageButton} from "discord.js";

export default {
    category: 'Fight',
    description: 'Try your luck to win SPW immunity',
    slash: true,
    minArgs: 1,
    expectedArgs: '<token-address>',
    expectedArgsTypes: ["STRING"],

    callback: async ({interaction: msgInt, channel, args}) => {
        const [tokenAddress] = args
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

            if (collection.first()?.customId === 'scratch' || collection.first()?.customId === 'bite') {
                await msgInt.editReply({
                    content: getContent(tokenAddress, msgInt),
                    components: []
                })
            } else {
                await msgInt.editReply({
                    content: `${msgInt.user} thought too long and was killed`,
                    components: []
                })
            }
        })
    }
} as ICommand

const getContent = (tokenAddress: string, msgInt: Interaction) => {
    return fight()
        ? `${msgInt.user} defeated enemy! Congratulations🎉! Now the token **${tokenAddress}** has immunity in SPW`
        : `Enemy dodged and killed ${msgInt.user}☠! Better luck next time`
}

const fight = () => {
    const probWin = 0.1

    return Math.random() <= probWin
}
