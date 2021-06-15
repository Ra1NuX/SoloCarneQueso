
const cors = require('cors');
var CronJob = require('cron').CronJob;

const RIOT_API = "RGAPI-d8ff0ca8-fd12-4887-9395-990a226c2a4d";


const twisted = require('twisted');

const { Queues, Regions } = require('twisted/dist/constants');

const Carta = require("./Carta.js");
const Rol = require('./ROL.js');

const api = new twisted.LolApi({
    key: RIOT_API
});

const conexion = require("../databaseConnection");


let ChallengerList, playerinfo;
let exist = false;

                    // s m h d m y
var job = new CronJob('0 0 0 * * *', async function () {
    ChallengerList = await (await api.League.getChallengerLeaguesByQueue(Queues.RANKED_SOLO_5x5, Regions.EU_WEST)).response.entries;
    ChallengerList.sort((a, b) => b.leaguePoints - a.leaguePoints);

    for (let i = 0; i < ChallengerList.length; i++) {
        numero = i + 1 + ". ";
        console.log(numero, ChallengerList[i].summonerName.padEnd(25).padStart(3), " | ", ChallengerList[i].leaguePoints, " LPs", ChallengerList[i].summonerId)

        conexion.query('SELECT idChallengerPlayer from challengerplayer', (err, result, fields) => {
            if (result.length > 0) {
                result.forEach(e => {
                    if (e.idChallengerPlayer == ChallengerList[i].summonerId) {
                        exist = true;
                        conexion.query(`UPDATE challengerPlayer set nombre = '${ChallengerList[i].summonerName}', LP = '${ChallengerList[i].leaguePoints}' WHERE idChallengerPlayer = '${e.idChallengerPlayer}'`);
                    }
                });
                if (!exist) {
                    conexion.query(`INSERT INTO challengerplayer (idChallengerPlayer, nombre, LP) values ("${ChallengerList[i].summonerId}", "${ChallengerList[i].summonerName}", ${ChallengerList[i].leaguePoints} )`, (err, result) => {
                        if (err) {
                            console.log("entro en err")
                        } else if (result) {
                            console.log("entro en result");
                            console.log(result)
                        }
                    });
                }
            }
            else {
                console.log('no hay nada en la base de datos')
            }
        })
    }
}, null, true, 'Europe/Madrid');
job.start();
var j = 0;
job2 = new CronJob('0 0/2 * * *', async function () {
    for (j = j; j < j + 100; j++) {
        if (j < 300) {
            playerinfo = await (await api.Summoner.getById(ChallengerList[j].summonerId, Regions.EU_WEST)).response;
            conexion.query(`INSERT INTO challengerplayer (icon) values ("${playerinfo.profileIconId}") WHERE idChallengerPlayer == ${ChallengerList[j].summonerId}`,
                (err, result, fields) => {
                    if (err.errno != 1062 && err.errno != 1054) {
                        console.log(err)
                    };
                })
            conexion.end();
        }
    }
}, null, true, 'Europe/Madrid');
job2.start();




// carta = new Carta(ChallengerList[0].summonerName, Rol.ADC);
// console.log(carta);