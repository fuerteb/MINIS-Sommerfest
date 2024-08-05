function startConnect(){

    clientID = "clientID - "+parseInt(Math.random() * 100);

    host = "test.mosquitto.org";   
    port = 8080;  
    userId  = "";  
    passwordId = "";  

    document.getElementById("messages").innerHTML += "<span> Connecting to " + host + "on port " +port+"</span><br>";
    document.getElementById("messages").innerHTML += "<span> Using the client Id " + clientID +" </span><br>";

    client = new Paho.MQTT.Client(host,Number(port),clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
        //userName: userId,
        //passwordId: passwordId
    });
}


function onConnect(){
    topic =  "MINIS/Sub"

    //document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";

    //client.subscribe(topic);


    // Resetten des Timers
    resetTimer();
    // Starten des Timers
    var display = document.getElementById("countdown"),
        timer = 600; // Hier den Timerwert in Sekunden einstellen
    startTimer(timer, display);
}



function onConnectionLost(responseObject){
    document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
    if(responseObject !=0){
        document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
    }
}

function onMessageArrived(message){
    console.log("OnMessageArrived: "+message.payloadString);
    document.getElementById("messages").innerHTML += "Message received: \""+message.payloadString + "\" </span><br>";
}

function startDisconnect(){
    client.disconnect();
    document.getElementById("messages").innerHTML += "<span> Disconnected. </span><br>";
    resetTimer();
}

function publishMessage(msg){
//msg = "Fließband start";
topic = "MINIS/Sub"

Message = new Paho.MQTT.Message(msg);
Message.destinationName = topic;

client.send(Message);
document.getElementById("messages").innerHTML += "<span> Message \"" + msg + "\" is sent </span><br>";
}

var timerInterval;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;

    // Funktion zum Aktualisieren und Anzeigen der verbleibenden Zeit
    function updateTimer() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
    }

    // Timer starten und das Interval-Objekt speichern
    timerInterval = setInterval(function () {
        updateTimer(); // Timer aktualisieren und anzeigen

        if (--timer < 0) {
            clearInterval(timerInterval); // Timer stoppen, wenn er abgelaufen ist
            // Aktion ausführen, wenn der Timer abgelaufen ist
            startDisconnect();
        }
    }, 1000);

    // Timer anzeigen
    updateTimer();
}
    
// Funktion zum Zurücksetzen des Timers
function resetTimer() {
    clearInterval(timerInterval); // Timer stoppen
    var display = document.getElementById("countdown");
    display.textContent = "00:00"; // Timer-Anzeige zurücksetzen auf 10 Sekunden
    //var timer = 10; // Timer zurücksetzen auf 10 Sekunden
    //startTimer(timer, display); // Timer neu starten
}
