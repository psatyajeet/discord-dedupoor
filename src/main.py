import os
from urllib.parse import urljoin, urlparse

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
        if "youtube.com" in message.content:
            url = message.content
        else:
            url = message.content.split('?')[0]
        
        message_url = message.jump_url

        if url in link_to_message:
            await message.channel.send(f"Someone posted this link elsewhere! There may already be a discussion, check out {link_to_message[url]}")
        else:     
            link_to_message[url] = message_url

client.run(os.getenv('TOKEN'))
