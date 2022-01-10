import os

import discord

client = discord.Client()

link_to_message = {}

@client.event
async def on_ready():
    print(f"We have logged in as {client.user}")

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('https://'):
        url = message.content
        message_url = message.jump_url

        if url in link_to_message:
            await message.channel.send(f"Already seen! Check out {link_to_message[url]}")
        else:     
            link_to_message[url] = message_url

client.run(os.getenv('TOKEN'))
