import {Client} from "discord.js";
import fetch from 'node-fetch'

export default (client: Client) => {

    const updateStatus = async () => {
        client.user?.setPresence({
            status: "online",
            activities: [
                {
                    name: await getStatus()
                }
            ]
        })


        setTimeout(updateStatus, 1000 * 60 * 60)
    }


    updateStatus().then(() => console.log("update status started"))
}

const getStatus = async () => {
    const settings = {method: "Get"};
    let url = "https://raw.githubusercontent.com/Vakurin/SPW-Change-Metadata/main/data/alive_mint_ids.json";
    const res = await fetch(url, settings)
    console.log('status changed')
    return `SPW (Alive Pets:${(await res.json()).length})`
}

export const config = {
    dbName: 'STATUS_CHANGER',
    displayName: 'Status Changer'
}