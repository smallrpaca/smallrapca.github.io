const express = require('express');
const app = express(); // express 설정
const path = require('path'); // <== path 추가

const port = process.env.port || 8080; // 포트 설정

process.env.NODE_ENV = "development";

// 추가
if(process.env.NODE_ENV === "production") { // prod 모드일때
    // 정적파일을 불러오기위한 폴더 지정
    app.use(express.static(path.join(__dirname, 'client/build')));
} else if (process.env.NODE_ENV === "development") { // dev 모드일때
    console.log("Development Mode");
}

// app.use(express.static(path.join(__dirname, 'client/build')));

// app.get("/", (req, res) => { // client/build/index.html 을 불러옴
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

// 웹 소켓 서버를 실행
const server = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio.listen(server);

// 서버 실행시 포트 번호 확인
server.listen(port, () => 
    console.log(`Listenig on port ${port}`));

// socket 용 user
var user = {
    id: null,
    nickname: null,
    gender: null,
    wishgender: null
};
const MMroom = 'Mroom_';
const FFroom = 'Froom_';
const FMroom = 'FMroom_';

var MMroomNo = 1;
var FFroomNo = 1;
var FMroomNo = 1;

var MainRoom = {};

var socketRoom = [];
// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    console.log('사용자 접속:', socket.client.id);

    // 접속한 사용자 num 확인.
    console.log(socket.client.conn.server.clientsCount);

    socket.emit('Now', {
        now: socket.client.conn.server.clientsCount
    })

    // Meet page
    socket.on('setRooms', data => {
        console.log(data);
        // io.sockets.adapter.delAll(socket.id); // 방 초기화
        console.log('남은 방 확인 : ', io.sockets.adapter.rooms);
    })

    // 클라이언트 정보 서버에 입력
    socket.on('start', (data) => {
        user.id = data.id // 아이디 확인
        user.nickname = data.nickname // 닉네임 확인
        user.gender = data.gender // 성별 확인
        user.wishgender = data.wishgender // 원하는 성별 확인

        const rooms = io.sockets.adapter.rooms;
        // 방을 골라줄게요.
        switch(user.wishgender){ // 먼저 원하는 성별을 확인.
            case 'Male': // 남자를 원해?
                switch(user.gender){ // 나의 성별 확인.
                    case 'Male': // 남자 인가요?
                        MainRoom = MMroom + MMroomNo;
                        JoinRoom(MainRoom);
                        if(rooms[MainRoom].length === 2){
                            MMroomNo++;
                        }
                        break;
                    case 'Female': // 여자 인가요?
                        MainRoom = FMroom + FMroomNo;
                        JoinRoom(MainRoom);
                        if(rooms[MainRoom].length === 2){
                            FMroomNo++;
                        }
                        break;
                    default: // 성별이 없나요...;
                        console.log('성별이 없음');
                        break;
                }
                break;

            case 'Female': // 여자를 원해?
                switch(user.gender){
                    case 'Male': // 남자 인가요?
                        MainRoom = FMroom + FMroomNo;
                        JoinRoom(MainRoom);
                        if(rooms[MainRoom].length === 2){
                            FMroomNo++;
                        }
                        break;
                    case 'Female': // 여자 인가요?
                        MainRoom = FFroom + FFroomNo;
                        JoinRoom(MainRoom);
                        if(rooms[MainRoom].length === 2){
                            FFroomNo++;
                        }
                        break;
                    default: // 성별이 없나요..
                        console.log('성별이 없음');
                        break;
                }
                break;
        }
        console.log('선택 된 방 : ', MainRoom);

        console.log(io.sockets.adapter.rooms);
        return MainRoom;
    });

    function JoinRoom (data) {
        socket.join(data);
        socket.emit('roomName', {
            roomName: data
        })
        console.log('조인 룸: ', data);
    }

    socket.on('ChatSend', (data) => {
        // const rooms = io.sockets.adapter.rooms;

        console.log('message : ', data.msg);
        
        io.sockets.in(data.roomName).emit('ChatSend', {
            id: data.id,
            nickname: data.nickname,
            gender: data.gender,
            msg: data.msg
        });
    });

    socket.on('RoomExit', (data) => {

        socket.leave(data.roomName, () => {
            console.log('나간놈 : ', socket.id);
            io.sockets.in(data.roomName).emit('exitmsg', {
                nickname: socket.id,
                msg: '님이 나가셨습니다.'
            })
        });
        console.log('나간 방: ', data.roomName);
        // if(rooms[data.roomName].length === 1){
        //     socket.in(data.roomName).emit('Exitmsg', {
        //         msg: socket.id + '님이 나가셨습니다.'
        //     })
        // }
    })

    socket.on('disconnect', () => {
        console.log(socket.adapter.sids);

        socket.leave(socket.id);
        // users.splice(users.indexOf(user.id), 1);
        
        // console.log(users);
    })
})


        // //방 인원 확인하기
        // var rooms = io.sockets.adapter.rooms;
        // for(var key in rooms){
        //     console.log('key값 : ', key);
        //     if(key == ''){
        //         console.log('1번방방방ㅂ아')
        //         continue;
        //     } else if(rooms[key].length === 1){
        //         var roomKey = key.replace('/','');
        //         console.log('룸키 : ', roomKey);
        //         console.log('2번째 방 : ', rooms[key]);
        //         socketRoom[MainRoom] = roomKey;
        //         console.log('소켓 룸[]:', socketRoom[MainRoom]);
        //     }
        // }
