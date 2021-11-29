import { Client, Message, TextChannel, } from "discord.js";
import User from "./user";
import * as dotenv from 'dotenv';
import * as socket from 'socket.io-client';
dotenv.config();


export default class Bot extends User {
  client: Client;//atributos da classe Bot
  static guilds: number;
  socketClient: socket.Socket<any, any>;

  constructor(client: Client) { // construtor
    super();
    this.client = client;
    if (!this.initSystem()) {
      //caso retorne FALSE
      console.log("erro na inicialização.");
    }
    console.log("INICIALIZADO.");
  }

  private initSystem(): boolean {
    try {//connect to socket server
      this.socketClient = socket.io(`${process.env.SERVER}${process.env.PORT}`);
    } catch (error) {
      console.log('error on socket connect: '+error);
    }

    try {
      //init bot
      this.client.on("ready", (evt) => {
        // Setando atributos
        this.setId(Number(this.client.user.id));
        this.setName(this.client.user.username);
        Bot.guilds = this.calculateGuilds();
      });

      // this.client.on("messageCreate", (msg) => {
      //   
      //   const refined = msg.content.split(" ")[0].toLowerCase();
      //   if (
      //     msg.author.id != this.client.user.id && refined.startsWith(process.env.PREFIX)) {
      //     this.commandHandle(msg, refined.replace("!", ""));
      //   }
      // });

      if(this.socketClient) {
        console.log('INITIALIZATING SOCKET HANDLERS');
        this.socketClient.on('receiveMessage', (text: {message:string, channel: string}) => {
          const channel = this.client.channels.cache.get(text.channel) as TextChannel;

          if (channel) {
            
            channel.send(text.message);
          } else {
            let obj = {
              error: "Catapimbas!",
              description: "Não tenho acesso à esse canal :C",
            }
            this.socketClient.emit('invalidChannel', obj);
          }
        });
      }
      return true; //deu certo
    } catch (error) {
      return false; // deu errado
    }
  }

  // private commandHandle(msg: Message, command: string) {
  //       CommandList.comandos.forEach((com) => {
  //         Bot.guilds = this.calculateGuilds(); // updating guild count
  //           if (com.name === command) {
  //               com.invoke(msg);
  //           }
  //       });
  // }

  private calculateGuilds(): number {
    //calcula em quantos servers estou!
    let guildCount = 0;
    this.client.guilds.cache.forEach((guild) => {
      guildCount++;
    });
    return guildCount;
  }
}
