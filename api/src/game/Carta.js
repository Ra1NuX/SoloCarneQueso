class Carta {
    
    #nickname;
    #idCarta;
    #idChall;
    #rol; 
    #morePlayedChampion; 
    #icono;
    #fotoPro;

    constructor(idChall){
        //hace una peticion a la base de datos de challenger ( nuestra ) para hacer las peticiones: 
        /*
        nickname = bd.challenger_id.nickname; //buscamos por el idChall que nos han pasado dentro de nuestra base de datos de jugadores.
        idCarta = 0 - 65.536;
        idChallenger = idChall; 
        rol = bd.challenger_id.rol; //buscamos por el idChall el rol del jugador.
        morePlayedChampion = bd.callenger_id.morePlayedChampion; //po lo mismo, busca en la base de datos por el idChall.
        icono = bd.challenger_id.icono; //buscamos por el idChall el icono.
        fotoPro = ;:;:; //no lo se la verdad, solo se que por default va a ser una foto de una silueta de una persona.
        */         
    }


    getNickname(){
        return this.nickname;
    }
    setNickname(nickname){
        Nickname = nickname.trim(); 
        if(Nickname != ""){
            this.nickname = Nickname;
        } 
    }


    getRol(){
        return this.rol;
    }
    setRol(rol){
        switch(rol){
            case 'TOP','JNG','MID','ADC',"SUPP":{
                this.rol = rol; 
            }break;
            default: {
                this.rol = 'Undefined';
            }break; 
        }
    }
}
module.exports = Carta;