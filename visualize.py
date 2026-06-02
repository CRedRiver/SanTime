import matplotlib.pyplot as plt
import os

output_dir = r"C:\Users\Admin\.gemini\antigravity\brain\fc50d784-e8b9-4477-9f93-7ff9409819f0"

# Set up matplotlib for better aesthetics
plt.style.use('ggplot')

# 1. Platforms used
platforms = ['Facebook', 'Zalo', 'LinkedIn', 'Diễn đàn SV', 'FB Groups', 'Bạn bè']
counts_plat = [13, 9, 9, 9, 6, 5]

plt.figure(figsize=(10, 6))
bars = plt.bar(platforms, counts_plat, color='skyblue')
plt.title('Các nền tảng được sử dụng nhiều nhất', fontsize=14)
plt.ylabel('Số lượng người dùng', fontsize=12)
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2.0, yval + 0.2, int(yval), ha='center', va='bottom')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'platforms.png'))
plt.close()

# 2. Most expected features
features = ['Đánh giá\nuy tín/review', 'Ghép cặp\ntheo kỹ năng', 'Tìm người theo\nthời gian', 'Trạng thái\nonline/offline', 'Chat trong\nhệ thống']
counts_feat = [46, 46, 45, 38, 35]

plt.figure(figsize=(10, 6))
bars = plt.bar(features, counts_feat, color='lightgreen')
plt.title('Các tính năng được mong đợi nhất', fontsize=14)
plt.ylabel('Số lượt bình chọn', fontsize=12)
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2.0, yval + 0.5, int(yval), ha='center', va='bottom')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'features.png'))
plt.close()

# 3. Experience priority
priorities = ['Phản hồi nhanh', 'Cân bằng tốc độ\nvà chính xác', 'Chính xác']
counts_prio = [29, 26, 15]

plt.figure(figsize=(8, 8))
plt.pie(counts_prio, labels=priorities, autopct='%1.1f%%', startangle=140, colors=['#ff9999','#66b3ff','#99ff99'])
plt.title('Ưu tiên về trải nghiệm người dùng', fontsize=14)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, 'experience.png'))
plt.close()
