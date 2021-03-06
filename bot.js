var ANAME = 'TruckerHat#7425';

var ERROR_SERVER_FOLDCR = 80003;

var MAX_RLIST_TERMS = 100;
var MAX_RLISTS = 5;

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

	var PREFIX = '>';
	var mapa = null;
	var d = null;
	var serverid = bot.channels[channelID].guild_id;
	var path='servers\\'+serverid;
	fs.exists(path, function(exists){
		if(!exists){
			fs.mkdir(path, function(err){});
			mapa = new Mapa();
			mapa.set(Number(bot.id), 0);
			mapa.set('_PREFIX', PREFIX);
			fs.writeFile(path + '\\' + 'data.th', JSON.stringify([...mapa]) , function(err) {
				 if(err) console.log(err)
			});
			return;
		}
		fs.exists(path+'\\data.th', function(exi){
			if(!exi){
				bot.sendMessage({to: channelID,
					message: 'Corrupted server data, please contact `' + ANAME + '`.'});
				return;
			}
			fs.readFile(path + '\\' + 'data.th', function(err, data){
				d = JSON.parse(data);
				mapa = new Map(d);
				PREFIX = mapa.get('_PREFIX');

				if (message.substring(0, 1) == PREFIX) {
					var args = message.substring(1).split(' ');
					var cmd = args[0];
				       
					switch(cmd) {

/*** PING COMMAND: ***/
/* Basic heartbeat test */
						case 'ping':
							bot.sendMessage({ to: channelID,
								message: 'Pong!'});
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
								message: '```* Sonia Bot *\n\tAuthor: Trucker Hat\n\nContact '+ANAME+' for any questions regarding the bot.\n\nType a command + help (eg. ' + PREFIX +'h2hhelp) to get info regarding the command.\n\nAvailable commands:\n\t' + PREFIX +'about\n\nGames:\n\t' + PREFIX +'lose\n\t' + PREFIX +'h2h\n\nMisc:\n\t' + PREFIX +'addrlist\n\t' + PREFIX +'addtorlist\n\t' + PREFIX +'clearrlist\n\t' + PREFIX +'deleterlist```'});
							break;


/*** ADDRLISTHELP COMMAND: ***/
						case 'addrlisthelp':
							bot.sendMessage({to: channelID,
								message: '```Command add random list:\n\t' + PREFIX +'addrlist <listname>\n\nDescription:\nAdd a list that returns random prerecorded messages.\nYou can call that list by running:\n\t'+ PREFIX + '<listname>'
							+ '\n\nArguments:\n- listname      -    Name of the list```'});
							break;

/*** PREFIXHELP COMMAND: ***/
						case 'prefixhelp':
							bot.sendMessage({to: channelID,
								message: '```Command prefix:\n\t' + PREFIX +'prefix <newprefix>\n\nDescription:\nChanges the prefix the bot needs to read to interpret a command.'
							+ '\n\nArguments:\n- newprefix      -    New prefix made of a single character\n```'});
							break;

/*** ADDTORLISTHELP COMMAND: ***/
						case 'addtorlisthelp':
							bot.sendMessage({to: channelID,
								message: '```Command add to random list:\n\t' + PREFIX +'addtorlist <listname> <response>\n\nDescription:\nAdd a response to a random message list.'
							+ '\n\nArguments:\n- listname      -    Name of the list\n- response      -    Message to be displayed```'});
							break;

/*** CLEARRLISTHELP COMMAND: ***/
						case 'clearrlisthelp':
							bot.sendMessage({to: channelID,
								message: '```Command clear random list:\n\t' + PREFIX +'clearrlist <listname>\n\nDescription:\nRemoves all responses from a random message list.'
							+ '\n\nArguments:\n- listname      -    Name of the list```'});
							break;

/*** DELETERLISTHELP COMMAND: ***/
						case 'deleterlisthelp':
							bot.sendMessage({to: channelID,
								message: '```Command delete random list:\n\t' + PREFIX +'deleterlist <listname>\n\nDescription:\nDeletes a random message list.'
							+ '\n\nArguments:\n- listname      -    Name of the list```'});
							break;

/*** LOSEHELP COMMAND: ***/
						case 'losehelp':
							bot.sendMessage({to: channelID,
								message: '```Command lose-to:\n\t' + PREFIX +'lose <game> <lost-to> <#games>\n\nDescription:\nRecord an amount of losses against the player <lost-to> in a game.'
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
								message: '```Command head-to-head:\n\t' + PREFIX +'h2h <game> <against>\n\nDescription:\nCheck the score bewteen yourself and <against> in a game.'
							+ '\n\nArguments:\n- game      -    Game played.\n\tList of all supported games:'
							+'\n\tpm      -    Project M\n\tmelee   -    Super Smash Bros. Melee'
							+'\n\ts4      -    Super Smash Bros. for Wii U\n\tmvci    -    Marvel vs Capcom: Infinite'
							+'\n\tggear   -    Guilty Gear Xrd: Rev2\n\troa     -    Rivals of Aether'
							+'\n\tdbfz    -    Dragon Ball FighterZ'
							+'\n\n- against   -    Mention (@User#1234) of the player to check```'});
							break;

/*** PREFIX COMMAND ***/
/* Changes the prefix associated with the server */

						case 'prefix':

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
									message: 'Command must be run using `' + PREFIX + 'prefix <newprefix>`.'});
								break;	
							}
							if(args[1].length !== 1){
								bot.sendMessage({to: channelID,
									message: 'Length of `<newprefix>` must be 1.'});
								break;
							}
							if(/[\\\"\']/.test(args[1])){
								bot.sendMessage({to: channelID,
									message: 'Unvalid `<newprefix>` character.'});
								break;
							}
						
							mapa.set('_PREFIX', args[1]);
							fs.writeFile(path + '\\' + 'data.th', JSON.stringify([...mapa]) , function(err) {
								 if(err) console.log(err)
							});

							bot.sendMessage({to: channelID,
									message: 'Prefix changed to `' + args[1] + '`.'});
							break;

/*** ADDRLIST COMMAND: ***/
/* Creates a new list of random pulling for the server */
						case 'addrlist':

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
							if(!(/^[a-z0-9]+$/i.test(args[1]))){
								bot.sendMessage({to: channelID,
									message: '`<listname>` must only contain alphanumeric values.'});
								break;
							}
							var lname = args[1];

							/* SECURITY CHECK */
							if(Number(bot.id) === Number(lname) || lname === '_PREFIX'){
								bot.sendMessage({to: channelID,
									message: 'Cannot make a list with that name.'});
								return;
							}
							/* SECURITY CHECK */

						
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
								if(!fs.existsSync(path + '\\map' + i + '.th')){
									mapa.set(lname, i);
									mapa.set(Number(bot.id), mapa.get(Number(bot.id))+1);
									fs.writeFile(path + '\\' + 'data.th', JSON.stringify([...mapa]) , function(err) {
										 if(err) console.log(err)
									});
									var list = new Array();		
									fs.writeFile(path + '\\map' + i + '.th', JSON.stringify([...list]) , function(err) {
										 if(err) console.log(err)
									});
									bot.sendMessage({to: channelID,
									message: 'Added random list `'+ lname + '`.'});
									return;
								}
							}
							break;

/*** ADDTORLIST COMMAND: ***/
/* Adds a response to a random list */
						case 'addtorlist':

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

							if(args.length < 3){
								bot.sendMessage({to: channelID,
									message: 'Command `addtorlist` must be run using `addtorlist <listname> <response>`.'});
								break;
							}
							var lname = args[1];
							var response = message.substring(3 + args[0].length + args[1].length);

							/* SECURITY CHECK */		
							if(/^[\\\"\']+$/.test(response)){
								bot.sendMessage({to: channelID,
									message: '`<response>` must not contain special characters.'});
								break;
							}
							if(Number(bot.id) === Number(lname) || lname === '_PREFIX'){
								bot.sendMessage({to: channelID,
									message: 'Cannot access a list with that name.'});
								return;
							}
							/* SECURITY CHECK */

							if(!mapa.has(lname)){
								bot.sendMessage({to: channelID,
								message: 'List `' + lname + '` does not exist.'});
								return;
							}

							var nfile = mapa.get(lname);

							fs.readFile(path + '\\map' + nfile + '.th', function(err, data) {
								if(err){
									bot.sendMessage({to: channelID,
									message: 'Corrupted local server data, please contact `' + ANAME + '`.'});
									return;
								}
								list = JSON.parse(data);
								if(list.length >= MAX_RLIST_TERMS){
									bot.sendMessage({to: channelID,
									message: 'List is already full.'});
									return;
								}
								list.push(response);
								fs.writeFile(path + '\\map' + nfile + '.th', JSON.stringify([...list]) , function(err) {
										 if(err) console.log(err)
								});
								bot.sendMessage({to: channelID,
									message: 'Added to list `' + lname + '`.'});
								return;
							});
		
							break;

/*** CLEARRLIST COMMAND: ***/
/* Clears a random pulling list */
						case 'clearrlist':
							if(args.length !== 2){
								bot.sendMessage({to: channelID,
								message: 'Command `clearrlist` must be run using `clearrlist <listname>`.'});
								break;
							}

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

							/* SECURITY CHECK */
							if(Number(bot.id) === Number(args[1]) || args[1] === '_PREFIX'){
								bot.sendMessage({to: channelID,
								message: 'That list does not exist.'});
								break;
							}
							/* SECURITY CHECK */

							var lname = args[1];

							if(!mapa.has(lname)){
								bot.sendMessage({to: channelID,
								message: 'List not found.'});
								return;
							}	
							var nfile = mapa.get(lname);
							var list = new Array();
							fs.writeFile(path + '\\map' + nfile + '.th', JSON.stringify([...list]) , function(err) {
								if(err) console.log(err)
							});
							bot.sendMessage({to: channelID,
							message: 'Succesfully cleared the list `' + lname + '`.'});
							break;

/*** DELETERLIST COMMAND: ***/
/* Deletes a random pulling list */
						case 'deleterlist':
							if(args.length !== 2){
								bot.sendMessage({to: channelID,
								message: 'Command `deleterlist` must be run using `deleterlist <listname>`.'});
								break;
							}

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

							/* SECURITY CHECK */
							if(Number(bot.id) === Number(args[1]) || args[1] === '_PREFIX'){
								bot.sendMessage({to: channelID,
								message: 'That list does not exist.'});
								break;
							}
							/* SECURITY CHECK */

							var lname = args[1];

							if(!mapa.has(lname)){
								bot.sendMessage({to: channelID,
								message: 'List not found.'});
								return;
							}	
							var nfile = mapa.get(lname);
							var list = new Array();
							mapa.delete(lname);
							mapa.set(Number(bot.id), mapa.get(Number(bot.id))-1);						
							fs.writeFile(path + '\\data.th', JSON.stringify([...mapa]) , function(err) {
								if(err) console.log(err)
			
								fs.unlink(path + '\\map' + nfile + '.th', function(err) {
									if(err) console.log(err)
				
									bot.sendMessage({to: channelID,
									message: 'Succesfully deleted the list `' + lname + '`.'});
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
								path='head2head\\'+game;
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
								path='head2head\\'+game;
								fs.exists(path, (exists) => {
								  if (!exists)
									fs.mkdirSync(path);
								});
								var usersc=0;
								var opponent=0;
								fs.exists(path + '\\' + userID + '.th', (exists) => {
								  	if (!exists){
										opponent=0;
										fs.exists(path + '\\' + mention.id + '.th', (exi) => {
											if(!exi){
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

						default:


/*** RLIST COMMAND RESPONSE CHECK: ***/
/* Checks whether or not the user is trying */
/* to pull a response from a random list    */

							if(cmd === '_PREFIX') return;
							if(mapa.has(cmd)){
								var nfile = mapa.get(cmd);
								fs.readFile(path + '\\map' + nfile + '.th', function(err, data) {
									if(err) return;
									d = JSON.parse(data);
									if(d.length === 0) return;
									bot.sendMessage({to: channelID,
									message: d[Math.floor(Math.random() * d.length)]});
									return;
								});
							}
/*** RLIST COMMAND RESPONSE CHECK: ***/
		

							break;

						    // Just add any case commands if you want to..
						 }
					}
			});
		});
	
	});
});
