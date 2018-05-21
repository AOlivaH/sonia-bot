var ERROR_SERVER_FOLDCR = 80003;

var MAX_RLISTS = 5;
var ANAME = 'TruckerHat#7425';
var fs = require('fs');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '·') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        switch(cmd) {

/*** PING COMMAND: ***/
/* Basic heartbeat test */
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;

/*** OFF COMMAND: ***/
/* Turns the bot off */
		case 'off':
			if(Number(userID) !== 126024619051188224){
				return;
			}
			logger.info('Disonnected ' + bot.username);
			bot.disconnect();
   			logger.info('Exiting...');
			return;

/*** REBOOT COMMAND: ***/
/* Reboots the bot updating the code */
		case 'reboot':
			if(Number(userID) !== 126024619051188224){
				return;
			}			
			bot.sendMessage({to: channelID,
				message: 'Rebooting...'});
			logger.info('Disonnected ' + bot.username);
			bot.disconnect();
   			logger.info('Rebooting...');
			const subprocess = require('child_process').spawn(process.argv[0], ['bot.js'], {  detached: true,  stdio: 'ignore'});
			subprocess.unref();
			return;

/*** ABOUT COMMAND: ***/
/* Shows basic information regarding the bot */
		case 'about':
			bot.sendMessage({to: channelID,
				message: '```* Sonia Bot *\n\tAuthor: Trucker Hat\n\nContact '+ANAME+' for any questions regarding the bot.\n\nType a command + help (eg. ·h2hhelp) to get info regarding the command.\n\nAvailable commands:\n·lose\n·h2h\n·about```'});
			break;


/*** LOSEHELP COMMAND: ***/
		case 'losehelp':
			bot.sendMessage({to: channelID,
				message: '```Command lose-to:\n\t·lose <game> <lost-to> <#games>\n\nDescription:\nRecord an amount of losses against the player <lost-to> in a game.'
			+ '\n\nArguments:\n- game      -    Game played.\n\tList of all supported games:'
			+'\n\tpm      -    Project M\n\tmelee   -    Super Smash Bros. Melee'
			+'\n\ts4      -    Super Smash Bros. for Wii U\n\tmvci    -    Marvel vs Capcom: Infinite'
			+'\n\tggear   -    Guilty Gear Xrd: Rev2\n\troa     -    Rivals of Aether'
			+'\n\tdbfz    -    Dragon Ball FighterZ'
			+'\n\n- lost-to   -    Mention (@User#1234) of the player played'
			+'\n\n- #games    -    Positive amount of games lost to said user```'});
			break;

/*** H2HHELP COMMAND: ***/
		case 'h2hhelp':
			bot.sendMessage({to: channelID,
				message: '```Command head-to-head:\n\t·h2h <game> <against>\n\nDescription:\nCheck the score bewteen yourself and <against> in a game.'
			+ '\n\nArguments:\n- game      -    Game played.\n\tList of all supported games:'
			+'\n\tpm      -    Project M\n\tmelee   -    Super Smash Bros. Melee'
			+'\n\ts4      -    Super Smash Bros. for Wii U\n\tmvci    -    Marvel vs Capcom: Infinite'
			+'\n\tggear   -    Guilty Gear Xrd: Rev2\n\troa     -    Rivals of Aether'
			+'\n\tdbfz    -    Dragon Ball FighterZ'
			+'\n\n- against   -    Mention (@User#1234) of the player to check```'});
			break;

/*** ADDRLIST COMMAND: ***/
/* Creates a new list of random pulling for the server */
		case 'addrlist':
			/* ANHADIR LISTA ALEATORIA */
			var serverid = bot.channels[channelID].guild_id;

			/* CHECKING FOR ADMIN PERMISSIONS */
			var roles = bot.servers[serverid].members[userID].roles;
			var adminr = false;
			var i=0;
			for(i=0; i<roles.length; i++){
				if(bot.servers[serverid].roles[roles[i]].GENERAL_ADMINISTRATOR){
					adminr = true;
					break;
				}
			}
			if(!adminr){
				bot.sendMessage({to: channelID,
					message: 'Administrator permissions are required to run this command.'});
				break;
			}
			/* CHECKING FOR ADMIN PERMISSIONS */

			if(args.length !== 2){
				bot.sendMessage({to: channelID,
					message: 'Command `addrlist` must be run using `addrlist <listname>`.'});
				break;
			}
			var lname = args[1];
			var path='servers\\'+serverid;
			var mapa=null;
			fs.exists(path, function(exists){
				if(!exists){
					fs.mkdir(path, function(err){});
					mapa = new Map();
					mapa.set(Number(bot.id), 0);
					fs.writeFile(path + '\\' + 'data.th', JSON.stringify([...mapa]) , function(err) {
						 if(err) console.log(err)
					});
				}

				/* SECURITY CHECK */
				if(Number(bot.id) === Number(lname)){
					bot.sendMessage({to: channelID,
						message: 'Cannot make a list with that name.'});
					return;
				}
				/* SECURITY CHECK */

				fs.exists(path+'\\data.th', function(exi){
					if(!exi){
						bot.sendMessage({to: channelID,
							message: 'Corrupted server data, please contact `' + ANAME + '`.'});
						return;
					}else{
						fs.readFile(path + '\\' + 'data.th', function(err, data) {
							if(err){return;}
							var d = JSON.parse(data);
							mapa = new Map(d);
							if(mapa.get(Number(bot.id)) >= MAX_RLISTS){
								bot.sendMessage({to: channelID,
								message: 'Server already has reached the maximum of random lists allowed.'
									+ '\nPlease delete some to add more.'});
								return;
							}

							if(mapa.has(lname)){
								bot.sendMessage({to: channelID,
								message: 'List `' + lname + '` already exists.'});
								return;
							}

							for(i=0; i<MAX_RLISTS; i++){
								if(!fs.existsSync(path + '\\' + i + '.th')){
									mapa.set(lname, i);
									mapa.set(Number(bot.id), mapa.get(Number(bot.id))+1);
									fs.writeFile(path + '\\' + 'data.th', JSON.stringify([...mapa]) , function(err) {
										 if(err) console.log(err)
									});
									mapa = new Map();		
									fs.writeFile(path + '\\' + i + '.th', JSON.stringify([...mapa]) , function(err) {
										 if(err) console.log(err)
									});
									bot.sendMessage({to: channelID,
									message: 'Added random list `'+ lname + '`.'});
									return;
								}
							}
						});
					}
				});
			});
			
			
			break;

/*** LOSE COMMAND: ***/
/* Records lost match data from a game */
		case 'lose':
			/* LOSE COMMAND */
			if(args.length < 4){
				bot.sendMessage({to: channelID,
				message: '_Error, use `<game>` `<player>` `<score>`_'});
				return;
			}else{
				if(evt.d.mentions.length < 1){
					bot.sendMessage({to: channelID,
					message: 'Argument 2 must be of type `mention`.'});
					return;
				}
				var game = args[1];
				var mention = evt.d.mentions[0];
				var score=Number(args[3]);
				if(score < 1){
					bot.sendMessage({to: channelID,
					message: 'Argument 3 `<score>` must be positive.'});
					return;
				}
				var path='head2head\\'+game;
				var mapa = null;
				switch(game){
					case 'pm': case 'melee':
					case 'ggear': case 's4':
					case 'dbfz': case 'roa':
					case 'mvci':
						break;
					default:
						bot.sendMessage({to: channelID,
						message: 'Argument 1 `'+game+'` is not supported. Please check the following list of supported games:\n\n```'+'- pm\n- melee\n- s4\n- mvci\n- ggear\n- roa\n- dbfz```'});
						return;
				}
				bot.sendMessage({to: channelID,
				message: 'Input info:\n\nGame played:   `' + game + '`\nLost to:               `'
					+ mention.username + '`\nGames lost:       `' + score + '`'});
				
				fs.exists(path, (exists) => {
				  if (!exists)
					fs.mkdirSync(path);
				});
				fs.exists(path + '\\' + userID + '.th', (exists) => {
				  	if (!exists){
						mapa = new Map();
						mapa.set(Number(mention.id), score);
						fs.writeFile(path + '\\' + userID + '.th', JSON.stringify([...mapa]) , function(err) {
	 					 if(err) console.log(err)
						});
				  	}else{
						fs.readFile(path + '\\' + userID + '.th', function(err, data) {
							if(err){
								return;
							}
							else{
								var d = JSON.parse(data);
								mapa = new Map(d);	
							}
							if(mapa.has(Number(mention.id))){
								mapa.set(Number(mention.id), Number(mapa.get(Number(mention.id))+score));
							}else{
								mapa.set(Number(mention.id), score);
							}
							fs.writeFile(path + '\\' + userID + '.th', JSON.stringify([...mapa]) , function(err) {
			 					 if(err) console.log(err)
							});
						});
					}
					
				});
				
			}
			break;

/*** H2H COMMAND: ***/
/* Shows head to head record between calling and target users */
		case 'h2h':
			/* CHECK HEAD 2 HEAD COMMAND */
			if(args.length < 3){
				bot.sendMessage({to: channelID,
				message: '_Error, use `<game>` `<player>`_'});
				return;
			}else{
				if(evt.d.mentions.length < 1){
					bot.sendMessage({to: channelID,
					message: 'Argument 2 must be of type `mention`.'});
					return;
				}
				var game = args[1];
				switch(game){
					case 'pm': case 'melee':
					case 'ggear': case 's4':
					case 'dbfz': case 'roa':
					case 'mvci':
						break;
					default:
						bot.sendMessage({to: channelID,
						message: 'Argument 1 `'+game+'` is not supported. Please check the following list of supported games:\n\n```'+'- pm\n- melee\n- s4\n- mvci\n- ggear\n- roa\n- dbfz```'});
						return;
				}
				var mention = evt.d.mentions[0];
				var path='head2head\\'+game;
				fs.exists(path, (exists) => {
				  if (!exists)
					fs.mkdirSync(path);
				});
				var mapa=null;
				var usersc=0;
				var opponent=0;
				fs.exists(path + '\\' + userID + '.th', (exists) => {
				  	if (!exists){
						opponent=0;
						fs.exists(path + '\\' + Number(mention.id) + '.th', (exists) => {
							if(!exists){
								usersc=0;
								bot.sendMessage({to: channelID,
									message: 'Game:\t`' + game + '`\t'+ user + ' `' + usersc +'` - `' + opponent + '` ' + mention.username});
								return;
							}else{
								fs.readFile(path + '\\' + mention.id + '.th', function(err, data) {
									if(err){
										return;
									}else{
										var d = JSON.parse(data);
										mapa = new Map(d);	
									}
									if(mapa.has(Number(userID))){
										usersc = Number(mapa.get(Number(userID)));
									}else{
										usersc = 0;
									}
									bot.sendMessage({to: channelID,
										message: 'Game:\t`' + game + '`\t'+ user + ' `' + usersc +'` - `' + opponent + '` ' + mention.username});
								});
							}
						});
						
				  	}else{
						fs.readFile(path + '\\' + userID + '.th', function(err, data) {
							if(err){
								return;
							}else{
								var d = JSON.parse(data);
								mapa = new Map(d);	
							}
							if(mapa.has(Number(mention.id))){
								opponent = Number(mapa.get(Number(mention.id)));
							}else{
								opponent = 0;
							}
							fs.exists(path + '\\' + mention.id + '.th', (exists) => {
								if(!exists){
									usersc=0;
									bot.sendMessage({to: channelID,
									message: 'Game:\t`' + game + '`\t'+ user + ' `' + usersc +'` - `' + opponent + '` ' + mention.username});
									return;
								}else{
									fs.readFile(path + '\\' + mention.id + '.th', function(err, data) {
										if(err){
											return;
										}else{
											var d = JSON.parse(data);
											mapa = new Map(d);	
										}
										if(mapa.has(Number(userID))){
											usersc = Number(mapa.get(Number(userID)));
										}else{
											usersc = 0;
										}
										bot.sendMessage({to: channelID,
										message: 'Game:\t`' + game + '`\t'+ user + ' `' + usersc +'` - `' + opponent + '` ' + mention.username});
									});
								}
							});
						});
					}
					
				});
				
			}
			break;

            // Just add any case commands if you want to..
         }
     }
});
