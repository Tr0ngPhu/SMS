const ClassRoom = require('../models/ClassRoomSchema');

const ClassRoomContronller= {
    createClassRoom: async(req, res)=>{
        try {
            const newClassRoom = new ClassRoom({
                classroom_id: req.body.classroom_id,
                classroom_name: req.body.classroom_name,
                room_type: req.body.room_type
            });
            console.log(newClassRoom)
            const classRoomSaved = await newClassRoom.save();
            
            res.status(200).json(classRoomSaved);
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getClassRoom: async (req, res)=>{
        try {
            const classRoom = await ClassRoom.find();
            res.status(200).json(classRoom);
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteClassRoom: async(req, res )=>{
        const id = req.params.id
        try {
            await ClassRoom.findOneAndDelete(id)
            res.status(200).json({message: 'Xóa thành công'})
        } catch (error) {
            res.status(500).json(error)
        }
    },
    // tìm kiếm phòng học bằng id 
    findClassRoomById: async(req, res,next)=>{
        const classRoomId= req.body.classroom

        try {
            const classRoomInstance = await ClassRoom.findOne({classroom_id:classRoomId});
            if(!classRoomInstance){
                return res.status(404).json({message:'Không tìm thấy phòng học'});
            }
            req.classRoomInstance= classRoomInstance;
            next();
        } catch (error) {
            res.status(500).json(error);
        }
    }

};

module.exports= ClassRoomContronller