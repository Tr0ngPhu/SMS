const mongoose = require('mongoose');
const Score = require('../models/ScoreSchema');
const ScoreTable = require('../models/ScoreTableSchema'); 
const Subject = require('../models/SubjectSchema');
const User = require('../models/User');
const Semester = require('../models/SemesterSchema');
const ObjectId = mongoose.Types.ObjectId;

const scoreController = {
    findStudentById: async (req, res, next) => {
        const studentId = req.body.vnu_id; 
        console.log('Student ID:', studentId);
        try {
            const instanceUser = await User.findOne({ vnu_id: studentId });
            if (!instanceUser) {
                return res.status(404).json({ message: "Không tìm thấy thông tin sinh viên." });
            }
    
            console.log('Instance Student:', instanceUser);
            req.instanceUser = instanceUser;
            return next();
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Lỗi server khi tìm kiếm thông tin sinh viên.", error: error.message });
        }
    },

    checkTargetAddScoreExist: async (req, res, next) => {
        const instanceUser = req.instanceUser;
        const subjectCode = req.body.subject_code;
        const semesterId = req.body.semester_id;
        
        try {
            const instanceSubject = await Subject.findOne({ subject_code: subjectCode });
            console.log('subject:', instanceSubject)
            const instanceSemester = await Semester.findOne({semester_id: semesterId });

            if (!instanceSubject || !instanceSemester) {
                return res.status(404).json({ message: "Không tìm thấy môn học" });
            }
            req.instanceSubject = instanceSubject;
            req.instanceSemester = instanceSemester;
            console.log(instanceSemester)

            let instanceTable = await ScoreTable.findOne({ user: instanceUser._id , semester: instanceSemester._id});

            if (!instanceTable) {
                instanceTable = new ScoreTable({
                    user: instanceUser._id,
                    scores: [],
                    semester: instanceSemester._id
                });
                await instanceTable.save();
                req.instanceTable = instanceTable;
                return next();
            }

            req.instanceTable = instanceTable;
            
            await instanceTable.populate({
                path: 'scores',
                populate: {
                    path: 'subject'
                }
            });

            console.log('Populated Score Table:', instanceTable);

            let subjectScoreExisted = instanceTable.scores.some(score => score.subject.subject_code === instanceSubject.subject_code);

            if (!subjectScoreExisted) {
                return next(); 
            } else {
                return res.status(400).json({ message: "Điểm cho môn học này đã tồn tại trong bảng điểm." });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Lỗi server khi kiểm tra điểm sinh viên.", error: error.message });
        }
    },

    addScoreToScoreTable: async (req, res) => {
        const { score } = req.body;
        const { instanceUser, instanceSubject, instanceTable, instanceSemester } = req;
        try {
            console.log('Adding new score:', { score, instanceSubject, instanceSemester });

            const newScore = new Score({
                score,
                subject: instanceSubject._id,
            });
            await newScore.save();

            console.log('New score saved:', newScore);

            // Đẩy điểm mới vào mảng scores của ScoreTable
            instanceTable.scores.push(newScore._id);
            await instanceTable.save();
            return res.status(200).json({ message: `Đã thêm điểm môn học vào bảng điểm.` });
        } catch (error) {
            console.error('Error when adding score:', error);
            return res.status(400).json({ message: "Lỗi khi thêm điểm vào bảng điểm.", error: error.message });
        }
    },
    findSubjectAndSemester: async (req, res, next)=>{
        const subjectCode = req.body.subject_code;
        const semesterId = req.body.semester_id;

        try {
            const instanceSubject = await Subject.findOne({ subject_code: subjectCode });
            console.log('subject:', instanceSubject)
            const instanceSemester = await Semester.findOne({semester_id: semesterId });

            if (!instanceSubject || !instanceSemester) {
                return res.status(404).json({ message: "Không tìm thấy môn học" });
            }
            req.instanceSubject = instanceSubject;
            req.instanceSemester = instanceSemester;
            next();
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getScoreClass: async (req, res) => {

        try {
            const classInstance = req.classInstance;
            const students = classInstance.students;
            const instanceSemester = req.instanceSemester
            const instanceSubject = req.instanceSubject

            const scores = await User.aggregate([
                {
                    $match: {
                        _id: { $in: students.map(student => new ObjectId(student)) }
                    }
                },
                {
                    $lookup: {
                        from: 'scoretables',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$user', '$$userId'] },
                                            { $eq: ['$semester', new ObjectId(instanceSemester._id)] }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: 'scores',
                                    let: { scoreIds: '$scores' },
                                    pipeline: [
                                        { $match: { $expr: { $in: ['$_id', '$$scoreIds'] } } },
                                        { $match: { subject: new ObjectId(instanceSubject._id) } }
                                    ],
                                    as: 'scores'
                                }
                            }
                        ],
                        as: 'scoreTable'
                    }
                },
                {
                    $addFields: {
                        scores: { $arrayElemAt: ['$scoreTable.scores', 0] }
                    }
                },
                {
                    $project: {
                        'scoreTable': 0,
                        'password': 0,
                        'salt': 0
                    }
                }
            ]);
    
            console.log("Scores:", scores);
    
            res.status(200).json(scores);
        } catch (error) {
            console.error("Error in getScoreClass:", error);
            res.status(404).json(error);
        }
    },
     getMyScorebyId : async (req, res) => {
        try {
            const usertoken = req.user;
            const { semesterId } = req.body;
    
            if (usertoken.role === 'student') {
                let query = { user:new ObjectId (usertoken.id) };
                if (semesterId) {
                    query.semester = semesterId;
                }
    
                const scores = await ScoreTable.find(query).populate({
                    path: 'scores',
                    populate: {
                        path: 'subject'
                    }
                }).populate({path:'user',
                    path:'semester'});
                if (scores) {
                    return res.status(200).json(scores);
                } else {
                    return res.status(404).json({ message: 'No scores found' });
                }
            } else {
                return res.status(400).json({ message: 'Người dùng không phải sinh viên' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getScoreStudentById: async(req, res)=>{
        try {
            const { studentId } = req.body;
            const scores = await ScoreTable.find({user: studentId}).populate({
                path: 'scores',
                populate: {
                    path: 'subject'
                }
            }).populate({path:'user',
                path:'semester'});
            res.status(200).json(scores)
              
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = scoreController;
