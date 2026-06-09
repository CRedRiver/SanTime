// ============================================
// SANTIME – Mock Data
// ============================================

const SPORTS_TYPES = {
  football: { name: 'Bóng đá', icon: '⚽', color: '#00E676' },
  badminton: { name: 'Cầu lông', icon: '🏸', color: '#00B0FF' },
  volleyball: { name: 'Bóng chuyền', icon: '🏐', color: '#FF6D00' },
  basketball: { name: 'Bóng rổ', icon: '🏀', color: '#FF5252' },
  tennis: { name: 'Tennis', icon: '🎾', color: '#FFD600' },
};

const DISTRICTS = [
  'Hai Bà Trưng', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân',
  'Hoàng Mai', 'Bắc Từ Liêm', 'Nam Từ Liêm', 'Hà Đông',
  'Long Biên', 'Ba Đình'
];

const COURTS_DATA = [
  {
    id: 1,
    name: 'Sân Bách Khoa Arena',
    sport: 'football',
    ownerPhone: '0935352253',
    address: '1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    price: 350000,
    rating: 4.8,
    reviews: 124,
    image: null,
    facilities: ['Đèn chiếu sáng', 'Phòng thay đồ', 'Gửi xe miễn phí', 'Nước uống'],
    description: 'Sân bóng đá 5 người chất lượng cao ngay cạnh ĐH Bách Khoa. Mặt sân cỏ nhân tạo thế hệ mới, hệ thống đèn LED hiện đại.',
    openTime: '06:00',
    closeTime: '23:00',
    status: 'available',
    fields: 4,
    type: '5 người'
  },
  {
    id: 2,
    name: 'Green Field Cầu Giấy',
    sport: 'football',
    ownerPhone: '0941585578',
    address: '25 Nguyễn Khánh Toàn, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    price: 400000,
    rating: 4.6,
    reviews: 98,
    image: null,
    facilities: ['Đèn chiếu sáng', 'Phòng thay đồ', 'Canteen', 'WiFi'],
    description: 'Cụm sân bóng đá mini với 6 sân 5 người và 2 sân 7 người. Vị trí thuận tiện gần nhiều trường đại học.',
    openTime: '05:30',
    closeTime: '23:30',
    status: 'available',
    fields: 8,
    type: '5-7 người'
  },
  {
    id: 3,
    name: 'Cầu Lông Thịnh Quang',
    sport: 'badminton',
    ownerPhone: '0990046844',
    address: '12 Thái Hà, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    price: 120000,
    rating: 4.5,
    reviews: 87,
    image: null,
    facilities: ['Điều hòa', 'Phòng thay đồ', 'Cho thuê vợt', 'Nước uống'],
    description: 'Nhà thi đấu cầu lông trong nhà với 8 sân tiêu chuẩn. Sàn gỗ chuyên dụng, hệ thống thông gió tốt.',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'available',
    fields: 8,
    type: 'Đơn/Đôi'
  },
  {
    id: 4,
    name: 'Sân Bóng Chuyền Thanh Xuân',
    sport: 'volleyball',
    ownerPhone: '0907576389',
    address: '45 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    price: 200000,
    rating: 4.3,
    reviews: 56,
    image: null,
    facilities: ['Đèn chiếu sáng', 'Lưới tiêu chuẩn', 'Gửi xe', 'Nước uống'],
    description: 'Sân bóng chuyền ngoài trời với mặt sân đạt chuẩn thi đấu. Lưới và cột chuyên dụng.',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'busy',
    fields: 3,
    type: '6 người'
  },
  {
    id: 5,
    name: 'Victory Football Center',
    sport: 'football',
    ownerPhone: '0940502924',
    address: '88 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    price: 500000,
    rating: 4.9,
    reviews: 203,
    image: null,
    facilities: ['Đèn LED', 'Phòng thay đồ VIP', 'Canteen', 'WiFi', 'Camera livestream', 'Bãi xe rộng'],
    description: 'Trung tâm bóng đá hàng đầu Hà Nội với sân cỏ nhân tạo FIFA Quality. Hệ thống camera livestream trận đấu.',
    openTime: '05:00',
    closeTime: '00:00',
    status: 'available',
    fields: 10,
    type: '5-7-11 người'
  },
  {
    id: 6,
    name: 'Cầu Lông Olympia',
    sport: 'badminton',
    ownerPhone: '0971536860',
    address: '120 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    price: 150000,
    rating: 4.7,
    reviews: 132,
    image: null,
    facilities: ['Điều hòa', 'Phòng thay đồ', 'Pro shop', 'Huấn luyện viên'],
    description: 'Trung tâm cầu lông chuyên nghiệp với sàn Yonex chính hãng. Có HLV hướng dẫn cho người mới.',
    openTime: '06:00',
    closeTime: '22:30',
    status: 'available',
    fields: 12,
    type: 'Đơn/Đôi'
  },
  {
    id: 7,
    name: 'Sân Bóng Đại Học Xây Dựng',
    sport: 'football',
    ownerPhone: '0969762329',
    address: '55 Giải Phóng, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    price: 300000,
    rating: 4.4,
    reviews: 78,
    image: null,
    facilities: ['Đèn chiếu sáng', 'Gửi xe', 'Nước uống'],
    description: 'Sân bóng đá trong khuôn viên ĐH Xây Dựng. Giá sinh viên ưu đãi, thuận tiện cho sinh viên cụm Bách-Kinh-Xây.',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'available',
    fields: 3,
    type: '5 người'
  },
  {
    id: 8,
    name: 'Sport Zone Long Biên',
    sport: 'basketball',
    ownerPhone: '0960950024',
    address: '200 Nguyễn Văn Cừ, Long Biên, Hà Nội',
    district: 'Long Biên',
    price: 250000,
    rating: 4.6,
    reviews: 67,
    image: null,
    facilities: ['Đèn LED', 'Phòng thay đồ', 'Rổ tiêu chuẩn NBA', 'Nước uống'],
    description: 'Sân bóng rổ ngoài trời với 4 sân full-court tiêu chuẩn NBA. Mặt sân acrylic chất lượng cao.',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'available',
    fields: 4,
    type: '5v5 / 3v3'
  },
  {
    id: 9,
    name: 'Mega Star Futsal',
    sport: 'football',
    ownerPhone: '0954552574',
    address: '15 Trường Chinh, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    price: 380000,
    rating: 4.5,
    reviews: 91,
    image: null,
    facilities: ['Điều hòa', 'Phòng thay đồ', 'Canteen', 'Camera'],
    description: 'Sân futsal trong nhà điều hòa mát mẻ. Phù hợp chơi quanh năm không lo thời tiết.',
    openTime: '07:00',
    closeTime: '23:00',
    status: 'busy',
    fields: 5,
    type: '5 người'
  },
  {
    id: 10,
    name: 'Bóng Chuyền Hà Đông',
    sport: 'volleyball',
    ownerPhone: '0978950308',
    address: '30 Quang Trung, Hà Đông, Hà Nội',
    district: 'Hà Đông',
    price: 180000,
    rating: 4.2,
    reviews: 43,
    image: null,
    facilities: ['Đèn chiếu sáng', 'Lưới tiêu chuẩn', 'Bãi xe', 'Nước uống'],
    description: 'Cụm sân bóng chuyền ngoài trời rộng rãi. Có sân cát cho bóng chuyền bãi biển.',
    openTime: '06:00',
    closeTime: '21:30',
    status: 'available',
    fields: 4,
    type: '6 người / Bãi biển'
  },
  {
    id: 11,
    name: 'Tennis Club Ba Đình',
    sport: 'tennis',
    ownerPhone: '0950277730',
    address: '8 Hoàng Diệu, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    price: 300000,
    rating: 4.8,
    reviews: 76,
    image: null,
    facilities: ['Đèn LED', 'Phòng thay đồ', 'Pro shop', 'Quầy bar', 'HLV'],
    description: 'Câu lạc bộ tennis cao cấp với sân đất nện và sân cứng. Không gian sang trọng, dịch vụ chuyên nghiệp.',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'available',
    fields: 6,
    type: 'Đơn/Đôi'
  },
  {
    id: 12,
    name: 'Kick Arena Hoàng Mai',
    sport: 'football',
    ownerPhone: '0951771876',
    address: '72 Giáp Bát, Hoàng Mai, Hà Nội',
    district: 'Hoàng Mai',
    price: 320000,
    rating: 4.3,
    reviews: 65,
    image: null,
    facilities: ['Đèn chiếu sáng', 'Phòng thay đồ', 'Gửi xe', 'Nước uống'],
    description: 'Sân bóng đá giá rẻ cho sinh viên. Cỏ nhân tạo mới, hệ thống thoát nước tốt.',
    openTime: '06:00',
    closeTime: '22:30',
    status: 'available',
    fields: 4,
    type: '5-7 người'
  },
];

const PLAYERS_DATA = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    age: 22,
    sport: 'football',
    position: 'Tiền đạo',
    level: 'Trung bình khá',
    rating: 4.5,
    matches: 45,
    district: 'Hai Bà Trưng',
    avatar: null,
    bio: 'Sinh viên ĐH Bách Khoa, đam mê bóng đá từ nhỏ. Thích chơi vị trí tiền đạo.',
    available: true
  },
  {
    id: 2,
    name: 'Trần Thị Hương',
    age: 21,
    sport: 'badminton',
    position: 'Đôi nữ',
    level: 'Khá',
    rating: 4.7,
    matches: 62,
    district: 'Đống Đa',
    avatar: null,
    bio: 'Yêu cầu lông, thường chơi vào buổi tối. Tìm bạn chơi đôi nữ hoặc đôi nam nữ.',
    available: true
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    age: 24,
    sport: 'football',
    position: 'Thủ môn',
    level: 'Giỏi',
    rating: 4.9,
    matches: 128,
    district: 'Cầu Giấy',
    avatar: null,
    bio: 'Thủ môn kinh nghiệm, từng chơi cho đội ĐH Kinh tế Quốc dân.',
    available: true
  },
  {
    id: 4,
    name: 'Phạm Quốc Đạt',
    age: 23,
    sport: 'volleyball',
    position: 'Chủ công',
    level: 'Trung bình khá',
    rating: 4.3,
    matches: 34,
    district: 'Thanh Xuân',
    avatar: null,
    bio: 'Chơi bóng chuyền phong trào cuối tuần. Cao 1m82, thích chơi vị trí chủ công.',
    available: false
  },
  {
    id: 5,
    name: 'Hoàng Minh Tuấn',
    age: 20,
    sport: 'football',
    position: 'Tiền vệ',
    level: 'Trung bình',
    rating: 4.1,
    matches: 22,
    district: 'Hai Bà Trưng',
    avatar: null,
    bio: 'Sinh viên năm 2 ĐH Xây Dựng, mới bắt đầu chơi bóng đá phong trào.',
    available: true
  },
  {
    id: 6,
    name: 'Vũ Thị Mai',
    age: 22,
    sport: 'badminton',
    position: 'Đơn nữ',
    level: 'Giỏi',
    rating: 4.8,
    matches: 95,
    district: 'Cầu Giấy',
    avatar: null,
    bio: 'Cựu VĐV cầu lông trẻ Hà Nội. Hiện đang tìm đối thủ luyện tập.',
    available: true
  },
  {
    id: 7,
    name: 'Đỗ Anh Kiệt',
    age: 25,
    sport: 'football',
    position: 'Hậu vệ',
    level: 'Khá',
    rating: 4.6,
    matches: 78,
    district: 'Long Biên',
    avatar: null,
    bio: 'Nhân viên văn phòng, chơi bóng đá mỗi tối sau giờ làm. Chuyên vị trí hậu vệ.',
    available: true
  },
  {
    id: 8,
    name: 'Nguyễn Thanh Sơn',
    age: 21,
    sport: 'basketball',
    position: 'Point Guard',
    level: 'Trung bình khá',
    rating: 4.4,
    matches: 38,
    district: 'Long Biên',
    avatar: null,
    bio: 'Đam mê bóng rổ, thường chơi 3v3 vào cuối tuần.',
    available: true
  },
  {
    id: 9,
    name: 'Bùi Văn Thắng',
    age: 26,
    sport: 'football',
    position: 'Tiền đạo',
    level: 'Giỏi',
    rating: 4.7,
    matches: 156,
    district: 'Đống Đa',
    avatar: null,
    bio: 'Đội trưởng FC Bách Khoa. Tìm đối bóng giao lưu mỗi tuần.',
    available: true
  },
  {
    id: 10,
    name: 'Trần Quang Huy',
    age: 23,
    sport: 'football',
    position: 'Tiền vệ',
    level: 'Khá',
    rating: 4.5,
    matches: 67,
    district: 'Thanh Xuân',
    avatar: null,
    bio: 'Chơi bóng đá 7 người thường xuyên. Kỹ thuật tốt, thích chuyền bóng.',
    available: false
  },
  {
    id: 11,
    name: 'Lý Hải Đăng',
    age: 20,
    sport: 'volleyball',
    position: 'Libero',
    level: 'Trung bình',
    rating: 4.0,
    matches: 15,
    district: 'Hoàng Mai',
    avatar: null,
    bio: 'Mới chơi bóng chuyền được 6 tháng, muốn tìm nhóm chơi phong trào.',
    available: true
  },
  {
    id: 12,
    name: 'Ngô Minh Phương',
    age: 24,
    sport: 'badminton',
    position: 'Đôi nam',
    level: 'Khá',
    rating: 4.6,
    matches: 82,
    district: 'Ba Đình',
    avatar: null,
    bio: 'Chơi cầu lông 3 năm, thích đánh đôi nam. Tìm partner lâu dài.',
    available: true
  },
  {
    id: 13,
    name: 'Phan Thị Ngọc',
    age: 22,
    sport: 'tennis',
    position: 'Đơn nữ',
    level: 'Trung bình',
    rating: 4.2,
    matches: 28,
    district: 'Ba Đình',
    avatar: null,
    bio: 'Mới tập tennis được 1 năm. Tìm bạn chơi cùng trình độ.',
    available: true
  },
  {
    id: 14,
    name: 'Đinh Công Vinh',
    age: 27,
    sport: 'football',
    position: 'Thủ môn',
    level: 'Trung bình khá',
    rating: 4.3,
    matches: 54,
    district: 'Hà Đông',
    avatar: null,
    bio: 'Giáo viên thể dục, chơi thủ môn rất tốt. Available tối T3-T5-T7.',
    available: true
  },
  {
    id: 15,
    name: 'Cao Bá Quốc',
    age: 21,
    sport: 'football',
    position: 'Tiền vệ cánh',
    level: 'Trung bình',
    rating: 4.0,
    matches: 19,
    district: 'Bắc Từ Liêm',
    avatar: null,
    bio: 'Sinh viên ĐH Sư phạm. Nhanh nhẹn, thích chạy cánh.',
    available: true
  },
  {
    id: 16,
    name: 'Lê Thị Hạnh',
    age: 23,
    sport: 'volleyball',
    position: 'Phụ công',
    level: 'Khá',
    rating: 4.5,
    matches: 47,
    district: 'Thanh Xuân',
    avatar: null,
    bio: 'Đội bóng chuyền nữ ĐH Thương mại. Tìm đội giao lưu nữ.',
    available: true
  },
  {
    id: 17,
    name: 'Trần Đức Lộc',
    age: 22,
    sport: 'badminton',
    position: 'Đơn nam',
    level: 'Giỏi',
    rating: 4.8,
    matches: 110,
    district: 'Đống Đa',
    avatar: null,
    bio: 'Top 10 giải cầu lông sinh viên Hà Nội. Tìm đối thủ mạnh để nâng cao trình độ.',
    available: true
  },
  {
    id: 18,
    name: 'Nguyễn Hữu Tâm',
    age: 28,
    sport: 'football',
    position: 'Hậu vệ',
    level: 'Giỏi',
    rating: 4.7,
    matches: 200,
    district: 'Nam Từ Liêm',
    avatar: null,
    bio: 'Kinh nghiệm 10 năm chơi bóng phong trào. Tổ chức đội bóng FC Weekend.',
    available: true
  },
  {
    id: 19,
    name: 'Vũ Hoàng Long',
    age: 19,
    sport: 'basketball',
    position: 'Center',
    level: 'Trung bình',
    rating: 3.9,
    matches: 12,
    district: 'Cầu Giấy',
    avatar: null,
    bio: 'Cao 1m90, mới chơi bóng rổ. Muốn tìm nhóm tập luyện.',
    available: true
  },
  {
    id: 20,
    name: 'Hoàng Thị Lan',
    age: 25,
    sport: 'badminton',
    position: 'Đôi nam nữ',
    level: 'Trung bình khá',
    rating: 4.4,
    matches: 55,
    district: 'Hai Bà Trưng',
    avatar: null,
    bio: 'Chơi cầu lông giải trí, thích đánh đôi nam nữ vui vẻ.',
    available: true
  },
];

const TIME_SLOTS = [
  { time: '06:00 - 07:30', label: 'Sáng sớm' },
  { time: '07:30 - 09:00', label: 'Sáng' },
  { time: '09:00 - 10:30', label: 'Sáng muộn' },
  { time: '10:30 - 12:00', label: 'Trưa' },
  { time: '14:00 - 15:30', label: 'Chiều sớm' },
  { time: '15:30 - 17:00', label: 'Chiều' },
  { time: '17:00 - 18:30', label: 'Chiều tối' },
  { time: '18:30 - 20:00', label: 'Tối' },
  { time: '20:00 - 21:30', label: 'Tối muộn' },
  { time: '21:30 - 23:00', label: 'Khuya' },
];

const BOOKINGS_DATA = [
  {
    id: 1,
    courtId: 1,
    courtName: 'Sân Bách Khoa Arena',
    sport: 'football',
    date: '2026-05-28',
    timeSlot: '18:30 - 20:00',
    status: 'confirmed',
    players: [1, 5, 7, 9, 3],
    totalPrice: 350000,
    paymentMethod: 'MoMo'
  },
  {
    id: 2,
    courtId: 3,
    courtName: 'Cầu Lông Thịnh Quang',
    sport: 'badminton',
    date: '2026-05-29',
    timeSlot: '20:00 - 21:30',
    status: 'pending',
    players: [2, 6],
    totalPrice: 120000,
    paymentMethod: 'VNPay'
  },
  {
    id: 3,
    courtId: 5,
    courtName: 'Victory Football Center',
    sport: 'football',
    date: '2026-05-30',
    timeSlot: '17:00 - 18:30',
    status: 'confirmed',
    players: [1, 3, 7, 9, 10, 14, 15],
    totalPrice: 500000,
    paymentMethod: 'MoMo'
  },
  {
    id: 4,
    courtId: 4,
    courtName: 'Sân Bóng Chuyền Thanh Xuân',
    sport: 'volleyball',
    date: '2026-05-27',
    timeSlot: '15:30 - 17:00',
    status: 'completed',
    players: [4, 11, 16],
    totalPrice: 200000,
    paymentMethod: 'Tiền mặt'
  },
  {
    id: 5,
    courtId: 6,
    courtName: 'Cầu Lông Olympia',
    sport: 'badminton',
    date: '2026-06-01',
    timeSlot: '18:30 - 20:00',
    status: 'confirmed',
    players: [12, 17],
    totalPrice: 150000,
    paymentMethod: 'VNPay'
  },
];

const REVIEWS_DATA = [
  {
    courtId: 1,
    userId: 1,
    userName: 'Nguyễn Văn Minh',
    rating: 5,
    comment: 'Sân rất đẹp, cỏ mới, đèn sáng. Staff thân thiện. Sẽ quay lại!',
    date: '2026-05-20'
  },
  {
    courtId: 1,
    userId: 9,
    userName: 'Bùi Văn Thắng',
    rating: 4,
    comment: 'Chất lượng sân tốt, giá hợp lý cho sinh viên. Bãi xe hơi chật vào giờ cao điểm.',
    date: '2026-05-18'
  },
  {
    courtId: 5,
    userId: 3,
    userName: 'Lê Hoàng Nam',
    rating: 5,
    comment: 'Sân đẹp nhất Hà Nội! Camera livestream rất hay, gia đình ở nhà có thể xem trận.',
    date: '2026-05-22'
  },
  {
    courtId: 3,
    userId: 2,
    userName: 'Trần Thị Hương',
    rating: 5,
    comment: 'Nhà thi đấu sạch sẽ, điều hòa mát. Sàn gỗ đạt chuẩn, rất thích.',
    date: '2026-05-19'
  },
  {
    courtId: 6,
    userId: 12,
    userName: 'Ngô Minh Phương',
    rating: 4,
    comment: 'Sân chất lượng, có HLV kèm riêng rất tốt. Giá hơi cao so với sinh viên.',
    date: '2026-05-21'
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Hoàng Bảo Huy',
    role: 'Full-stack Developer',
    description: 'Kỹ sư phát triển phần mềm (Frontend & Backend Developer), xây dựng kiến trúc hệ thống.',
    icon: '💻'
  },
  {
    name: 'Lê Minh Đức',
    role: 'Marketing',
    description: 'Nghiên cứu thị trường, tham khảo ý kiến, phản hồi của khách hàng với sản phẩm MVP, lập kế hoạch và triển khai các chiến dịch Marketing.',
    icon: '📊'
  },
  {
    name: 'Nguyễn Trọng Thế Anh',
    role: 'Product Researcher',
    description: 'Tìm hiểu các đối thủ trên thị trường, nghiên cứu và đưa ra giải pháp giá trị phù hợp với dự án và đối tượng khách hàng chính.',
    icon: '🔍'
  },
  {
    name: 'Vương Toàn Quyền',
    role: 'UI Designer & HR',
    description: 'Phụ trách điều hành nhân sự được thuê, hỗ trợ công việc công nghệ, thiết kế giao diện (UI).',
    icon: '🎨'
  },
  {
    name: 'Thân Gia Bảo',
    role: 'Vận hành',
    description: 'Phụ trách mảng vận hành, trực tiếp làm việc và đàm phán với các đối tác chủ sân.',
    icon: '🤝'
  },
  {
    name: 'Trần Hồng Hà',
    role: 'Project Manager',
    description: 'Quản lý tiến độ, điều phối công việc chung, định hướng chiến lược kinh doanh.',
    icon: '🎯'
  }
];

const TESTIMONIALS = [
  {
    name: 'Phạm Quốc Đạt',
    role: 'Sinh viên ĐH Xây Dựng',
    comment: 'Trước đây phải đăng bài trên Facebook rồi chờ cả ngày mới có người phản hồi. Giờ dùng SanTime ghép đội chỉ 30 giây là xong!',
    rating: 5,
    avatar: '🏐'
  },
  {
    name: 'Nguyễn Thị Lan',
    role: 'Nhân viên văn phòng',
    comment: 'Mình mới chuyển lên Hà Nội, không quen ai để chơi cầu lông cùng. SanTime giúp mình tìm được nhóm chơi thân thiện ngay tuần đầu tiên.',
    rating: 5,
    avatar: '🏸'
  },
  {
    name: 'Anh Tuấn',
    role: 'Chủ sân bóng Q. Cầu Giấy',
    comment: 'Từ khi lên SanTime, tỷ lệ lấp đầy sân tăng 40%, đặc biệt khung giờ thấp điểm. Hệ thống quản lý lịch rất tiện lợi.',
    rating: 5,
    avatar: '⚽'
  },
  {
    name: 'Trần Hải Long',
    role: 'Đội trưởng FC Weekend',
    comment: 'Tính năng ghép đối rất hay! Tìm được đối thủ cùng trình độ, trận đấu hấp dẫn hơn nhiều so với đăng bài trên group.',
    rating: 4,
    avatar: '🏆'
  },
];

// Helper functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

function getStatusText(status) {
  const map = {
    available: 'Còn trống',
    busy: 'Đông đúc',
    full: 'Hết chỗ',
    confirmed: 'Đã xác nhận',
    pending: 'Chờ xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  return map[status] || status;
}

function getStatusClass(status) {
  const map = {
    available: 'badge-success',
    busy: 'badge-warning',
    full: 'badge-error',
    confirmed: 'badge-primary',
    pending: 'badge-accent',
    completed: 'badge-secondary',
    cancelled: 'badge-error'
  };
  return map[status] || '';
}

function getLevelColor(level) {
  const map = {
    'Mới bắt đầu': '#94A3B8',
    'Trung bình': '#00B0FF',
    'Trung bình khá': '#00E676',
    'Khá': '#FFD600',
    'Giỏi': '#FF6D00',
    'Chuyên nghiệp': '#FF5252'
  };
  return map[level] || '#94A3B8';
}

function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<span class="star">★</span>';
    } else if (i - 0.5 <= rating) {
      stars += '<span class="star">★</span>';
    } else {
      stars += '<span class="star empty">☆</span>';
    }
  }
  return stars;
}

function generateAvatarSVG(name, size = 44) {
  const colors = ['#00E676', '#00B0FF', '#FF6D00', '#FF5252', '#FFD600', '#AA00FF', '#00BFA5'];
  const initials = name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const color = colors[colorIndex];
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size/2}" fill="${color}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#0A0E17" font-family="Inter, sans-serif" font-weight="700" font-size="${size * 0.38}">${initials}</text>
  </svg>`;
}

// --- AI Enhancements Injected Below ---
COURTS_DATA.forEach(court => {
  court.basePrice = court.price;
  court.dynamicPrice = court.price; // default
  
  if (court.id === 1) {
    court.dynamicPrice = 280000;
    court.aiPricingReason = 'Giảm 20% do khung giờ trưa vắng khách';
  } else if (court.id === 2) {
    court.dynamicPrice = 480000;
    court.aiPricingReason = 'Tăng 20% do giờ vàng (18h-20h) cháy sân';
  } else if (court.id === 4) {
    court.dynamicPrice = 150000;
    court.aiPricingReason = 'Flash Sale: Giảm 25% kích cầu người chơi mới';
  } else if (court.id === 6) {
    court.dynamicPrice = 105000;
    court.aiPricingReason = 'Giảm 30% do dự báo mưa lớn chiều nay';
  } else if (court.id === 11) {
    court.dynamicPrice = 350000;
    court.aiPricingReason = 'Tăng nhẹ do nhu cầu thi đấu giải cuối tuần cao';
  } else if (court.id === 12) {
    court.dynamicPrice = 250000;
    court.aiPricingReason = 'Giảm 22% giờ thấp điểm';
  }
});

PLAYERS_DATA.forEach(player => {
  if (player.id === 1) {
    player.playStyles = ['Máu lửa', 'Kỹ thuật', 'Tấn công'];
    player.aiInsight = 'Cầu thủ có xu hướng bám vòng cấm, cực kỳ nguy hiểm trong vòng 16m50. Hợp ghép với tiền vệ kiến thiết.';
  } else if (player.id === 2) {
    player.playStyles = ['Vui vẻ', 'Bền bỉ', 'Thích rally'];
    player.aiInsight = 'Chơi bao sân tốt, điều cầu bền bỉ. Hợp với người đánh lưới tốc độ cao.';
  } else if (player.id === 3) {
    player.playStyles = ['Kỷ luật', 'Chỉ huy', 'Phản xạ'];
    player.aiInsight = 'Điểm tựa vững chắc cho hàng thủ, hay chỉ đạo đội hình. Hợp đội bóng thiếu thủ lĩnh.';
  } else if (player.id === 4) {
    player.playStyles = ['Sức mạnh', 'Tập trung', 'Cống hiến'];
    player.aiInsight = 'Cánh chim đầu đàn trên lưới, đập bóng uy lực nhưng bước 1 hơi yếu. Cần ghép với Libero tốt.';
  } else if (player.id === 5) {
    player.playStyles = ['Vui vẻ', 'Giao lưu', 'Hòa đồng'];
    player.aiInsight = 'Người chơi mang tính giải trí cao, chạy cánh nhiệt tình. Rất hợp các trận đá đổ mồ hôi cuối tuần.';
  } else if (player.id === 6) {
    player.playStyles = ['Căng thẳng', 'Tấn công', 'Nhanh nhẹn'];
    player.aiInsight = 'Trình độ cực cao, nhịp độ trận đấu rất nhanh. Thích hợp tìm kiếm đối tác có rank Advanced.';
  } else if (player.id === 7) {
    player.playStyles = ['Cứng rắn', 'Kỷ luật', 'An toàn'];
    player.aiInsight = 'Hòn đá tảng hàng phòng ngự, ít khi mắc sai lầm. Cực kỳ hợp cạ với các tiền đạo cắm.';
  } else if (player.id === 8) {
    player.playStyles = ['Kiến tạo', 'Nhanh nhẹn', 'Sáng tạo'];
    player.aiInsight = 'Nhãn quan chiến thuật tốt, hay nhồi bóng. Hợp ghép đội với trung phong to cao.';
  } else if (player.id === 9) {
    player.playStyles = ['Chiến thuật', 'Điềm tĩnh', 'Thủ lĩnh'];
    player.aiInsight = 'Gà son dứt điểm, tỷ lệ ghi bàn cao. Cần được support bóng nhiều.';
  } else if (player.id === 10) {
    player.playStyles = ['Chuyền bóng', 'Kỹ thuật', 'Bao sân'];
    player.aiInsight = 'Ông chủ tuyến giữa, chạm bóng tinh tế. Hoàn hảo để build team passing-game.';
  }
});
