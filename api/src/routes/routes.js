const express = require('express');
const cors = require('cors');
var CronJob = require('cron').CronJob;

const RIOT_API = "RGAPI-8b6bd88a-a4ec-4a7d-9b74-50b9a90b9f06";

const app = express;
const router = app.Router();

router.use(cors());
const twisted = require('twisted');
const { Queues, Regions } = require('twisted/dist/constants');

const Carta = require("../game/Carta.js");
const Rol = require('../game/ROL.js');

const api = new twisted.LolApi({
    key: RIOT_API
});

var mysql = require('mysql');

var conexion = mysql.createConnection({
    host: 'localhost',
    database: 'sqdb',
    user: 'root',
    password: 'Usuario_1234',
});
conexion.connect(function (err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
});


router.get('/', async (req, res) => {

    let ChallengerList ,playerinfo

    ChallengerList = await (await api.League.getChallengerLeaguesByQueue(Queues.RANKED_SOLO_5x5, Regions.EU_WEST)).response.entries;
    ChallengerList.sort((a, b) => b.leaguePoints - a.leaguePoints);

    for (let i = 0; i < ChallengerList.length; i++) {
        numero = i + 1 + ". ";
        console.log(numero, ChallengerList[i].summonerName.padEnd(25).padStart(3), " | ", ChallengerList[i].leaguePoints, " LPs", ChallengerList[i].summonerId)
        

        conexion.query(`INSERT INTO challengerplayer (idChallengerPlayer, nombre, LP) values ("${ChallengerList[i].summonerId}", "${ChallengerList[i].summonerName}", ${ChallengerList[i].leaguePoints} )`,
            (err, result, fields) => {
                if (err.errno != 1062 && err.errno != 1054) {
                    console.log(err)
                };
            })
        conexion.end();
        playerinfo = await (await api.Summoner.getById(ChallengerList[i].summonerId, Regions.EU_WEST)).response;
        conexion.query(`INSERT INTO challengerplayer (icon) values ("${playerinfo.profileIconId}") WHERE idChallengerPlayer == ${ChallengerList[i].summonerId}`,
            (err, result, fields) => {
                if (err.errno != 1062 && err.errno != 1054) {
                    console.log(err)
                };
            })
        conexion.end();    
    }
    

    // var job = new CronJob('0 * * * * *', async function() { 
    //     ChallengerList =  await (await api.League.getChallengerLeaguesByQueue(Queues.RANKED_SOLO_5x5, Regions.EU_WEST)).response.entries;
    //     ChallengerList.sort((a,b) => b.leaguePoints - a.leaguePoints);
    //     for (let i = 0; i < ChallengerList.length; i++) {
    //         numero = i+1 + ". " ; 
    //         console.log(numero,  ChallengerList[i].summonerName.padEnd(25).padStart(3), " | ", ChallengerList[i].leaguePoints, " LPs", ChallengerList[i].summonerId)

    //     }
    //   }, null, true, 'America/Los_Angeles');

    // job.start();


    carta = new Carta(ChallengerList[0].summonerName, Rol.ADC);
    console.log(carta);

})

module.exports = router;