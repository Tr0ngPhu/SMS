const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const registrationSettingsSchema = new mongoose.Schema({
  faculties: {
      type: [ObjectId],
      ref: 'Faculty',
  },
  start_date: {
    type: Date,
    required: false
  },
  end_date: {
    type: Date,
    required: false
  },
}, {
    timestamps: true 
});

// Tạo TTL index với expireAfterSeconds để tự động xóa tài liệu sau một khoảng thời gian tính theo giây (giờ)
// registrationSettingsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // 3600 giây = 1 giờ



module.exports = mongoose.model('RegistrationSetting', registrationSettingsSchema)