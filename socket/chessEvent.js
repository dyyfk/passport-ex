const ChessRecord = require('../models/ChessRecord');
const chessRecord = require('../chessUtils/chessrecord');

// castToMongoose = async (room_chessrecord, record) => {
//     room_chessrecord.chessArr = record.chessArr
//     room_chessrecord.nextRound = record.nextRound
//     room_chessrecord.record = record.record;
//     room_chessrecord.joinedChess = record.joinedChess;
//     room_chessrecord.ko = record.ko;
//     await room_chessrecord.save();
//     console.log(room_chessrecord);
//     return room_chessrecord;
// }

// castToJs = (room_chessrecord, record) => {
//     let record = new chessRecord();
//     record.chessArr = room_chessrecord.chessArr;
//     record.nextRound = room_chessrecord.nextRound;
//     record.record = room_chessrecord.record;
//     record.joinedChess = room_chessrecord.joinedChess;
//     record.ko = room_chessrecord.ko;
//     return record;
// }


const initChessEvent = function (io, room_id) {
    io.of('/matchroom').on('connection', socket => {



        // .then(room_record => {

        //      = room_record.record;

        //     let newRecord = Object.assign(room_chessrecord, new chessRecord());
        //     console.log(newRecord)
        // }).catch(e => console.log(e));


        // try {
        socket.on('click', chess => {

            ChessRecord.findOne({ room_id }).then(room_chessrecord => {
                let record = new ChessRecord();
                record = Object.assign(record, room_chessrecord.record).record;

                let color = chess.color === "black" ? 1 : -1; // Todo: need to change the data structure

                let promise = record.addChess(chess.row, chess.col, color);
                promise.then(async chessArr => {
                    room_chessrecord['record'] = record;
                    await room_chessrecord.save();

                    // await ChessRecord.findOneAndUpdate({ room_id }, {
                    //     $set: {
                    //         'record': record
                    //     }
                    // }, {}, function (err) {
                    //     console.log(err)
                    // })



                    console.log(record, "record");
                    console.log(room_chessrecord.record, "db");

                    io.of('/matchroom').emit('updateChess', chessArr);



                    // room_chessrecord.markModified('record');
                    // room_chessrecord.update(
                    //     {
                    //         record: record
                    //     });
                    // console.log(room_chessrecord.record);



                }).catch(err => console.log(err));
            }).catch(err => console.log(err));

        });
        // } catch (e) {
        // console.log(e);
        // socket.emit('errors', 'Something went wrong, try again later');
        // }

    })
}


module.exports = function (io, room_id) {
    initChessEvent(io, room_id);
};