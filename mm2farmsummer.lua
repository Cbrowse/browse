-- Khởi tạo Giao diện dưới CoreGui
local sg = Instance.new("ScreenGui")
sg.Name = "RonneiPremiumNotif"
sg.Parent = game:GetService("CoreGui")

-- Bảng nền chính (Chuyển sắc Neon)
local frame = Instance.new("Frame")
frame.Size = UDim2.new(0, 320, 0, 140) -- Chiều cao vừa vặn cho cả note
frame.Position = UDim2.new(0.5, -160, 0.5, -70) -- Căn giữa màn hình hoàn hảo
frame.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
frame.BorderSizePixel = 0
frame.ClipsDescendants = true
frame.Parent = sg

-- Hiệu ứng Bo góc
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = frame

-- Tạo màu nền Gradient huyền bí
local uigradient = Instance.new("UIGradient")
uigradient.Color = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(15, 12, 41)),    -- Xanh đen
    ColorSequenceKeypoint.new(0.5, Color3.fromRGB(48, 43, 99)),  -- Tím sẫm
    ColorSequenceKeypoint.new(1, Color3.fromRGB(36, 36, 62))     -- Tím xanh
})
uigradient.Parent = frame

-- Đường viền phát sáng (Neon Border)
local stroke = Instance.new("UIStroke")
stroke.Thickness = 2.5
stroke.Color = Color3.fromRGB(255, 0, 128) -- Hồng Neon mặc định
stroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
stroke.Parent = frame

-- Chữ TIKTOK:ronnei7.htk (Đậm và sắc nét)
local label = Instance.new("TextLabel")
label.Size = UDim2.new(1, 0, 0.4, 0)
label.Position = UDim2.new(0, 0, 0.1, 0)
label.BackgroundTransparency = 1
label.Text = "TIKTOK: ronnei7.htk"
label.TextColor3 = Color3.fromRGB(0, 255, 255) -- Xanh Cyan rực rỡ
label.Font = Enum.Font.GothamBold
label.TextSize = 22
label.TextStrokeTransparency = 0.5
label.TextStrokeColor3 = Color3.fromRGB(0, 0, 0)
label.Parent = frame

-- Note nhỏ đe dọa siêu lầy lội bên dưới
local noteLabel = Instance.new("TextLabel")
noteLabel.Size = UDim2.new(1, 0, 0.2, 0)
noteLabel.Position = UDim2.new(0, 0, 0.48, 0)
noteLabel.BackgroundTransparency = 1
noteLabel.Text = "follow đi ko t ✂️ 🐦🦋"
noteLabel.TextColor3 = Color3.fromRGB(255, 85, 85) -- Màu đỏ cảnh báo
noteLabel.Font = Enum.Font.GothamMedium
noteLabel.TextSize = 14
noteLabel.TextStrokeTransparency = 0.8
noteLabel.Parent = frame

-- Dòng trạng thái & Đếm ngược
local timerLabel = Instance.new("TextLabel")
timerLabel.Size = UDim2.new(1, 0, 0.2, 0)
timerLabel.Position = UDim2.new(0, 0, 0.72, 0)
timerLabel.BackgroundTransparency = 1
timerLabel.Text = "Khởi chạy sau 5 giây..."
timerLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
timerLabel.Font = Enum.Font.Gotham
timerLabel.TextSize = 12
timerLabel.Parent = frame

-- Hiệu ứng đổi màu RGB cho viền (Chạy song song)
local spawn = task.spawn(function()
    local counter = 0
    while sg.Parent do
        counter = counter + 0.01
        stroke.Color = Color3.fromHSV(counter % 1, 1, 1) -- Đổi màu cầu vồng liên tục
        task.wait(0.01)
    end
end)

-- Vòng lặp đếm ngược 5 giây chuẩn xác
for i = 5, 1, -1 do
    timerLabel.Text = "🔥 Khởi chạy sau " .. i .. " giây..."
    task.wait(1)
end

-- Hiệu ứng biến mất mượt mà (Fade out)
timerLabel.Text = "Đang tải Script..."
for opacity = 0, 1, 0.1 do
    frame.BackgroundTransparency = opacity
    label.TextTransparency = opacity
    noteLabel.TextTransparency = opacity
    timerLabel.TextTransparency = opacity
    stroke.Transparency = opacity
    task.wait(0.03)
end

-- Dọn dẹp UI
sg:Destroy()

-- Khởi chạy Script MM2 Autofarm Summer 2026 của bạn
loadstring(game:HttpGet("https://raw.githubusercontent.com/scriptmm2/summer2026/refs/heads/main/autofarm"))()
