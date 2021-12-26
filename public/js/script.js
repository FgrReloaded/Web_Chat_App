// const port = process.env.PORT;


const socket = io('http://localhost:4000', {
    transports: ['websocket', 'polling']
});

const form = document.getElementById('send');
const messageInp = document.getElementById('msginp');
const msgBox = document.querySelector('.content');
const usern = document.getElementById('user');
const text = document.getElementById('text');
const sendBox = document.getElementById('send-box1');
let typing = document.getElementById('typing');
let userList = document.getElementById('userList');
let alertN = document.getElementById('alertN');



socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});



if (typing.innerHTML == '') {
    typing.style.display = 'none';
} else {
    typing.style.display = 'block';
}

function start() {
    if(text.value == ''){
        alertN.classList.remove('d-none');
        setTimeout(() => {
            alertN.classList.add('d-none');
        }, 2500);
    }else{
        const names = text.value;
        socket.emit('new-user-joined', names);
        socket.on('user-joined', names => {
            append(`${names} Joined the Chat`, 'align-self-center');
        });
        text.style.display = 'none';
        usern.style.display = 'none';
        socket.on('left', names => {
            append(`${names} left`, 'align-self-center');
            typing.style.display = 'none';
    
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let message = messageInp.value;
            append(`You: ${message}`, 'align-self-end');
            socket.emit('send', message);
            messageInp.value = '';
        });


        socket.on('receive', data => {
            append(`${data.names}: ${data.message}`, 'align-self-start');
            typing.style.display = 'none';
        });
        

       
        messageInp.addEventListener('input', ()=> {
            socket.emit('typing', names);
        });
        socket.on('typing', names => {
            typing.style.display = 'block';
            typing.innerHTML = `${names} is typing...`;
        });

        sendBox.classList.remove('d-none');
        socket.on('user-list', user=>{
            userList.innerHTML = "";
            userArr = Object.values(user);
            for (let i = 0; i < userArr.length; i++) {
                let h5 = document.createElement('h5');
                userArr[i].charAt(0).toUpperCase()
                h5.innerHTML += userArr[i];
                h5.innerHTML.toUpperCase();
                userList.appendChild(h5);
            };
            let userText = document.getElementById('offcanvasExampleLabel');
            userText.innerText = `Active Users (${userArr.length})`;
        });
    }
    
};
const append = (message, position, replied) => {
    var messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('msg', 'mx-2', 'mb-2', 'user-select-all');
    messageElement.classList.add(position);
    msgBox.append(messageElement);
    if(messageElement.innerHTML.includes('Joined')){
        messageElement.style.boxShadow = 'none';
        messageElement.style.background = 'antiquewhite';
        messageElement.classList.remove('user-select-all');
    }else if(messageElement.innerHTML.includes('left')){
        messageElement.style.boxShadow = 'none';
        messageElement.style.background = 'lightcoral';
        messageElement.classList.remove('user-select-all');
    }
};



