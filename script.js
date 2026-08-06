const BASE_DEST = "https://cbrowse.github.io/browse/taskreceives.html";
const GTRAFFIC_KEY = "54ed5096b0af4edc8c5dd31dfb5b2502";

const defaultProds = [
  { id: 1, name: "Super Watering Can", points: 5, img: "https://thumbsnap.com/i/jvbvSUcZ.jpg", category: "GROW A GARDEN 2", type: "roblox", status: "in_stock" },
  { id: 2, name: "Super Sprinkler", points: 5, img: "https://thumbsnap.com/i/dXdSNpk5.jpg", category: "GROW A GARDEN 2", type: "roblox", status: "in_stock" },
  { id: 3, name: "Dragon Breath", points: 15, img: "https://thumbsnap.com/i/viTZPv6v.jpg", category: "GROW A GARDEN 2", type: "roblox", status: "in_stock" },
  { id: 4, name: "Star Fruit", points: 30, img: "https://thumbsnap.com/i/937fNiTC.jpg", category: "GROW A GARDEN 2", type: "roblox", status: "in_stock" },
  { id: 8, name: "UgPhone Trial", points: 20, img: "https://thumbsnap.com/i/8Ntd9Gf5.png", category: "CLOUD PHONE", type: "account", status: "in_stock" }
];

let userDB = {}, activeUser = "ronnei.htk7", logHistory = [], products = [], cloudStock = [], isLoginMode = true, currentCopy = "";

function initSystem() {
  try {
    let u = localStorage.getItem("gU"); if (u) userDB = JSON.parse(u);
    let sa = localStorage.getItem("gA"); if (sa) activeUser = sa;
    let l = localStorage.getItem("gL"); if (l) logHistory = JSON.parse(l);
    let p = localStorage.getItem("gP"); products = p ? JSON.parse(p) : defaultProds;
    let c = localStorage.getItem("gC"); cloudStock = c ? JSON.parse(c) : [];
  } catch (e) { userDB = {}; logHistory = []; products = defaultProds; cloudStock = []; }
  
  userDB["ronnei.htk7"] = { password: "123", points: 999999, role: "admin", recipient: "ronnei.htk7", history: userDB["ronnei.htk7"]?.history || [] };
  userDB["HowellThang"] = { password: "123", points: 999999, role: "admin", recipient: "HowellThang", history: userDB["HowellThang"]?.history || [] };

  if (!userDB[activeUser]) activeUser = "ronnei.htk7";
  
  checkUrlReturn(); saveData(); renderProducts(); renderCloudStock(); updateAccProductDropdown(); updateAdminUserDropdown();
}

function saveData() {
  localStorage.setItem("gU", JSON.stringify(userDB));
  localStorage.setItem("gA", activeUser);
  localStorage.setItem("gP", JSON.stringify(products));
  localStorage.setItem("gC", JSON.stringify(cloudStock));
  localStorage.setItem("gL", JSON.stringify(logHistory));
}

function checkUrlReturn() {
  const p = new URLSearchParams(window.location.search);
  if (p.get("status") === "completed") {
    userDB[activeUser].points = (userDB[activeUser].points || 0) + 5;
    const t = new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    if (!userDB[activeUser].history) userDB[activeUser].history = [];
    const taskInfo = { type: "task", title: "Vượt Link Gtraffic", copyText: `Vượt link thành công: +5 ĐC (${t})`, time: t };
    userDB[activeUser].history.unshift(taskInfo);
    addLog(activeUser, "Vượt Link (+5Đ)", "-", 5);
    saveData();
    window.history.replaceState({}, document.title, window.location.pathname);
    openResultModal("🎉 NHẬN ĐIỂM THÀNH CÔNG!", `<div class="text-emerald-400 font-bold">Vượt link hoàn tất!</div><div class="text-amber-300 mt-1">+5 Điểm (ĐC) đã được cộng.</div>`, taskInfo.copyText);
  }
}

function renderProducts() {
  const c = document.getElementById("productListContainer"); if (!c) return; c.innerHTML = "";
  const cats = ["GROW A GARDEN 2", "CLOUD PHONE"], isAdmin = userDB[activeUser]?.role === "admin";
  
  cats.forEach(cat => {
    const list = products.filter(p => (p.category || "GROW A GARDEN 2") === cat);
    if (list.length) {
      let h = `<div class="pt-2"><h2 class="text-xs font-bold text-gray-300 uppercase mb-3"><i class="fa-solid ${cat === 'CLOUD PHONE' ? 'fa-mobile-screen-button' : 'fa-seedling'} text-emerald-400 mr-1.5"></i>${cat}</h2></div>`;
      list.forEach(i => {
        const isOutOfStock = i.status === "out_of_stock";
        const statusTag = isOutOfStock 
          ? `<span class="text-[11px] font-bold text-red-500 flex items-center"><i class="fa-solid fa-circle-xmark mr-1 text-[10px]"></i>Hết hàng</span>`
          : `<span class="text-[11px] font-bold text-emerald-400 flex items-center"><i class="fa-solid fa-circle-check mr-1 text-[10px]"></i>Còn hàng</span>`;

        h += `<div class="glow-card p-3.5 rounded-2xl flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="item-img-box"><img src="${i.img}"></div>
            <div>
              <h3 class="font-bold text-sm text-white">${i.name}</h3>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">${i.points} Điểm</span>
                ${statusTag}
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-1">
            <button onclick="redeemItem('${i.name}',${i.points})" class="${isOutOfStock ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white'} text-xs font-bold px-3 py-2 rounded-xl border-none">${isOutOfStock ? 'Hết Hàng' : 'Đổi Quà'}</button>
            ${isAdmin ? `<button onclick="adminDeleteProduct(${i.id})" class="text-[10px] text-red-400 underline border-none bg-transparent">Xóa SP</button>` : ''}
          </div>
        </div>`;
      });
      c.innerHTML += h;
    }
  });
}

function switchTab(t) {
  if (t === 'admin' && userDB[activeUser]?.role !== 'admin') { alert("⚠️ Chỉ dành cho Admin!"); return; }
  ['Shop', 'Getlink', 'Admin'].forEach(k => {
    const sk = k.toLowerCase();
    document.getElementById("section" + k)?.classList.toggle("hidden", sk !== t);
    document.getElementById("topTab" + k)?.classList.toggle("active", sk === t);
    document.getElementById("bottomNav" + k)?.classList.toggle("active", sk === t);
  });
}

function updateUI() {
  const role = userDB[activeUser]?.role || "user", isAdmin = role === "admin";
  document.getElementById("activeUsername").innerText = activeUser;
  document.getElementById("headerPoints").innerText = `${userDB[activeUser]?.points || 0} ĐC`;
  document.getElementById("bottomUserName").innerText = activeUser;
  document.getElementById("robloxRecipientInput").value = userDB[activeUser]?.recipient || "";
  document.getElementById("topTabAdmin")?.classList.toggle("hidden", !isAdmin);
  document.getElementById("bottomNavAdmin")?.classList.toggle("hidden", !isAdmin);
  
  const b = document.getElementById("roleBadge");
  if (b) {
    b.innerText = isAdmin ? "ADMIN TOÀN QUYỀN" : "THÀNH VIÊN";
    b.className = isAdmin ? "text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-bold" : "text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-bold";
  }

  checkAndShowAdminNote();
  renderUserHistory(); renderLogs(); renderProducts(); updateAccProductDropdown(); updateAdminUserDropdown();
}

function checkAndShowAdminNote() {
  const note = userDB[activeUser]?.adminNote;
  if (note) {
    const toast = document.getElementById("adminNoteToast");
    const textEl = document.getElementById("adminNoteText");
    const timerEl = document.getElementById("noteTimer");

    textEl.innerText = note;
    toast.classList.remove("hidden");

    let count = 10;
    timerEl.innerText = `${count}s`;
    
    delete userDB[activeUser].adminNote;
    saveData();

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        timerEl.innerText = `${count}s`;
      } else {
        clearInterval(interval);
        toast.classList.add("hidden");
      }
    }, 1000);
  }
}

function redeemItem(name, cost) {
  const prod = products.find(p => p.name.toLowerCase() === name.toLowerCase());
  
  if (prod && prod.status === "out_of_stock") {
    alert(`⚠️ Sản phẩm "${name}" hiện tại đã HẾT HÀNG!`);
    return;
  }

  const isAccType = prod ? prod.type === "account" : (name.toLowerCase().includes("cloud") || name.toLowerCase().includes("ugphone"));
  const pts = userDB[activeUser]?.points || 0;

  if (pts < cost) { alert(`⚠️ Cần ${cost} ĐC nhưng bạn chỉ có ${pts} ĐC.`); return; }

  const t = new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

  if (isAccType) {
    const accIndex = cloudStock.findIndex(a => a.prodName && a.prodName.toLowerCase() === name.toLowerCase());
    if (accIndex === -1) { 
      alert(`⚠️ Sản phẩm "${name}" hiện tại đã hết nick trong kho!`); 
      return; 
    }
    
    const acc = cloudStock.splice(accIndex, 1)[0];
    userDB[activeUser].points -= cost;
    if (!userDB[activeUser].history) userDB[activeUser].history = [];
    
    const noteTxt = acc.note ? ` | Note: ${acc.note}` : "";
    const str = `Sản phẩm: ${name} | TK: ${acc.user} | MK: ${acc.pass}${noteTxt}`;
    
    userDB[activeUser].history.unshift({ type: "cloud", title: name, user: acc.user, pass: acc.pass, note: acc.note, copyText: str, time: t });
    saveData(); updateUI(); renderCloudStock(); addLog(activeUser, `Đổi ${name}`, "-", -cost);
    
    openResultModal(`ĐỔI QUÀ: ${name.toUpperCase()}`, 
      `<div class="text-amber-400 font-bold mb-1">🎉 MUA TÀI KHOẢN THÀNH CÔNG!</div>
       <div class="bg-gray-900 p-2 rounded border border-gray-700 text-xs">
         Sản phẩm: <span class="text-amber-300 font-bold">${name}</span><br>
         Tk: <span class="text-emerald-400 font-mono font-bold">${acc.user}</span><br>
         Mk: <span class="text-amber-300 font-mono font-bold">${acc.pass}</span><br>
         <span class="text-gray-400 italic">Ghi chú: ${acc.note || 'Không có'}</span>
       </div>`, 
      str
    );
    return;
  }

  const rec = userDB[activeUser]?.recipient?.trim();
  if (!rec) { alert("⚠️ Vui lòng nhập Tên Roblox và bấm Lưu!"); document.getElementById("robloxRecipientInput").focus(); return; }

  userDB[activeUser].points -= cost;
  if (!userDB[activeUser].history) userDB[activeUser].history = [];
  const str = `Đã đổi quà '${name}' cho nick Roblox: ${rec}`;
  userDB[activeUser].history.unshift({ type: "roblox", title: name, recipient: rec, copyText: str, time: t });
  saveData(); updateUI(); addLog(activeUser, `Đổi ${name}`, rec, -cost);
  openResultModal("THÔNG BÁO ĐỔI QUÀ", `<div class="text-emerald-400 font-bold mb-1">🎉 ĐỔI QUÀ THÀNH CÔNG!</div><div class="bg-gray-900 p-2 rounded border border-gray-700">Vật phẩm: <b>${name}</b><br>Nhận bởi: <b class="text-amber-300">${rec}</b></div>`, str);
}

function openResultModal(title, html, copyTxt) {
  document.getElementById("resTitle").innerText = title;
  document.getElementById("resBody").innerHTML = html;
  currentCopy = copyTxt;
  document.getElementById("resultOverlay").classList.add("active");
}
function closeResultModal() { document.getElementById("resultOverlay").classList.remove("active"); }
function copyResultText() { if (currentCopy) copyToClipboard(currentCopy); }
function copyToClipboard(txt) {
  navigator.clipboard.writeText(txt).then(() => alert("✅ Đã sao chép:\n" + txt)).catch(() => {
    let i = document.createElement("input"); i.value = txt; document.body.appendChild(i); i.select(); document.execCommand("copy"); document.body.removeChild(i); alert("✅ Đã sao chép!");
  });
}

function renderUserHistory() {
  const b = document.getElementById("userHistoryList"); if (!b) return; b.innerHTML = "";
  const h = userDB[activeUser]?.history || [];
  if (!h.length) { b.innerHTML = `<div class="text-xs text-gray-500 italic text-center py-2">Chưa có lịch sử</div>`; return; }
  h.forEach(i => {
    let d = i.type === "task" ? `<span class="text-amber-300 font-bold">+5 Điểm Cấu</span>` : i.type === "cloud" ? `Tk: <b class="text-emerald-400">${i.user}</b> | Mk: <b class="text-amber-300">${i.pass}</b>${i.note ? ` | Note: <b>${i.note}</b>` : ''}` : `Tên nhận: <b class="text-amber-300">${i.recipient || i.pass}</b>`;
    b.innerHTML += `<div class="bg-gray-900/90 border border-emerald-500/20 p-2.5 rounded-xl flex items-center justify-between text-xs mb-2 space-x-2">
      <div class="flex-1 overflow-hidden">
        <div class="font-bold text-emerald-400">${i.title || i.name} <span class="text-[10px] text-gray-500 font-normal">(${i.time})</span></div>
        <div class="text-gray-300 mt-0.5 truncate">${d}</div>
      </div>
      <button onclick="copyToClipboard('${i.copyText}')" class="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-lg text-[10px] font-bold border-none"><i class="fa-solid fa-copy"></i> Copy</button>
    </div>`;
  });
}

function confirmRecipientName() {
  const v = document.getElementById("robloxRecipientInput").value.trim();
  if (!v) { alert("⚠️ Vui lòng nhập Tên Roblox!"); return; }
  userDB[activeUser].recipient = v; saveData(); alert(`✅ Đã lưu Tên Roblox: "${v}"`);
}

function openAuth() { document.getElementById("authOverlay").classList.add("active"); }
function closeAuth() { document.getElementById("authOverlay").classList.remove("active"); }
function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById("authTitle").innerText = isLoginMode ? "Đăng Nhập" : "Đăng Ký";
  document.getElementById("authSubmitBtn").innerText = isLoginMode ? "Đăng Nhập" : "Tạo Tài Khoản";
  document.getElementById("authSwitchBtn").innerText = isLoginMode ? "Đăng ký" : "Đăng nhập";
}

function handleLogin() {
  const u = document.getElementById("authUser").value.trim(), p = document.getElementById("authPass").value.trim();
  if (!u || !p) { alert("⚠️ Nhập đầy đủ thông tin!"); return; }
  
  if ((u === "ronnei.htk7" || u === "HowellThang") && p === "123") {
    userDB[u] = { password: p, points: 999999, role: "admin", recipient: u, history: userDB[u]?.history || [] };
    activeUser = u; alert("✅ Đăng nhập Admin thành công!");
  } else {
    if (!userDB[u]) { userDB[u] = { password: p, points: 0, role: "user", recipient: "", history: [] }; alert(`✅ Tạo tài khoản thành công!`); }
    else { if (userDB[u].password !== p && userDB[u].password !== "") { alert("❌ Mật khẩu không đúng!"); return; } alert(`✅ Đăng nhập thành công!`); }
    activeUser = u;
  }
  saveData(); updateUI(); closeAuth();
}
function handleBottomAuth() { openAuth(); }
      // NẠP DANH SÁCH THÀNH VIÊN VÀO ADMIN QUẢN LÝ
function updateAdminUserDropdown() {
  const selUser = document.getElementById("admSelectUser");
  if (!selUser) return;
  selUser.innerHTML = "";
  
  const users = Object.keys(userDB);
  if (!users.length) {
    selUser.innerHTML = `<option value="">-- Chưa có thành viên --</option>`;
    return;
  }

  users.forEach(u => {
    const roleText = userDB[u].role === 'admin' ? ' [ADMIN]' : '';
    selUser.innerHTML += `<option value="${u}">👤 ${u} (${userDB[u].points || 0} ĐC)${roleText}</option>`;
  });

  onAdminSelectUserChange();
}

// KHI ADMIN CHỌN 1 THÀNH VIÊN TỪ MENU
function onAdminSelectUserChange() {
  const targetUser = document.getElementById("admSelectUser")?.value;
  if (!targetUser || !userDB[targetUser]) return;

  const uObj = userDB[targetUser];
  document.getElementById("admUserCurrentPts").innerText = `${uObj.points || 0} ĐC`;
  document.getElementById("admUserRoblox").innerText = uObj.recipient || "Chưa lưu";
  document.getElementById("admEditPointsInput").value = uObj.points || 0;

  const historyBox = document.getElementById("admSelectedUserHistory");
  if (historyBox) {
    historyBox.innerHTML = "";
    const h = uObj.history || [];
    if (!h.length) {
      historyBox.innerHTML = `<div class="text-gray-500 italic">Thành viên này chưa làm gì</div>`;
    } else {
      h.forEach(item => {
        historyBox.innerHTML += `<div class="bg-gray-900 p-1.5 rounded border border-gray-800">
          <span class="text-emerald-400 font-bold">${item.title || item.name}</span> 
          <span class="text-[10px] text-gray-500">(${item.time})</span>: 
          <span class="text-gray-300">${item.copyText || ''}</span>
        </div>`;
      });
    }
  }
}

// CHỈNH SỬA ĐIỂM SỐ CỦA THÀNH VIÊN
function adminSetUserPoints() {
  if (userDB[activeUser]?.role !== "admin") return;
  const targetUser = document.getElementById("admSelectUser")?.value;
  const newPts = parseInt(document.getElementById("admEditPointsInput").value);

  if (!targetUser || !userDB[targetUser]) { alert("⚠️ Chưa chọn thành viên!"); return; }
  if (isNaN(newPts)) { alert("⚠️ Vui lòng nhập số điểm hợp lệ!"); return; }

  const oldPts = userDB[targetUser].points || 0;
  userDB[targetUser].points = newPts;

  addLog(activeUser, `Sửa điểm ${targetUser}: ${oldPts} -> ${newPts}`, "-", 0);
  saveData(); updateUI();
  alert(`✅ Đã cập nhật điểm cho "${targetUser}" thành ${newPts} ĐC!`);
}

// TÍNH NĂNG MỚI: XÓA TÀI KHOẢN THÀNH VIÊN
function adminDeleteUser() {
  if (userDB[activeUser]?.role !== "admin") return;
  const targetUser = document.getElementById("admSelectUser")?.value;

  if (!targetUser || !userDB[targetUser]) { alert("⚠️ Chưa chọn thành viên!"); return; }
  if (targetUser === activeUser) { alert("⚠️ Không thể tự xóa tài khoản của chính mình!"); return; }
  if (userDB[targetUser].role === "admin") { alert("⚠️ Không thể xóa tài khoản Admin!"); return; }

  if (confirm(`⚠️ Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${targetUser}"?`)) {
    delete userDB[targetUser];
    addLog(activeUser, `Xóa tài khoản ${targetUser}`, "-", 0);
    saveData();
    updateAdminUserDropdown();
    updateUI();
    alert(`✅ Đã xóa thành công tài khoản "${targetUser}"!`);
  }
}

// GỬI NOTE NỔI 10 GIÂY CHO THÀNH VIÊN
function adminSendNoteToUser() {
  if (userDB[activeUser]?.role !== "admin") return;
  const targetUser = document.getElementById("admSelectUser")?.value;
  const noteText = document.getElementById("admSendNoteInput").value.trim();

  if (!targetUser || !userDB[targetUser]) { alert("⚠️ Chưa chọn thành viên!"); return; }
  if (!noteText) { alert("⚠️ Vui lòng nhập lời nhắn!"); return; }

  userDB[targetUser].adminNote = noteText;
  saveData();
  document.getElementById("admSendNoteInput").value = "";
  alert(`✅ Đã gửi Note cho "${targetUser}"! Lần tới khi TV này đăng nhập/mở ứng dụng, Note sẽ nổi lên màn hình trong 10s.`);
}

function updateAccProductDropdown() {
  const selEdit = document.getElementById("admSelectExistProd");
  if (selEdit) {
    selEdit.innerHTML = `<option value="NEW">➕ -- Tạo Sản Phẩm Mới --</option>`;
    products.forEach(p => {
      const st = p.status === 'out_of_stock' ? ' [HẾT HÀNG]' : ' [CÒN HÀNG]';
      selEdit.innerHTML += `<option value="${p.id}">📦 ${p.name} (${p.points} ĐC)${st}</option>`;
    });
  }

  const selAcc = document.getElementById("admAccTargetProd");
  if (selAcc) {
    selAcc.innerHTML = "";
    const accProds = products.filter(p => p.type === "account" || p.category === "CLOUD PHONE");
    if (!accProds.length) {
      selAcc.innerHTML = `<option value="">-- Chưa có sản phẩm loại Tài Khoản --</option>`;
    } else {
      accProds.forEach(p => {
        selAcc.innerHTML += `<option value="${p.name}">Gán vào: ${p.name}</option>`;
      });
    }
  }
}

function onAdminSelectProductChange() {
  const selVal = document.getElementById("admSelectExistProd").value;
  if (selVal === "NEW") {
    document.getElementById("admProdName").value = "";
    document.getElementById("admProdPoints").value = "";
    document.getElementById("admProdImg").value = "";
    document.getElementById("admProdStatus").value = "in_stock";
    return;
  }

  const prod = products.find(p => p.id == selVal);
  if (prod) {
    document.getElementById("admProdName").value = prod.name;
    document.getElementById("admProdPoints").value = prod.points;
    document.getElementById("admProdImg").value = prod.img;
    document.getElementById("admProdCategory").value = prod.category || "GROW A GARDEN 2";
    document.getElementById("admProdType").value = prod.type || "roblox";
    document.getElementById("admProdStatus").value = prod.status || "in_stock";
  }
}

function adminSaveProduct() {
  if (userDB[activeUser]?.role !== "admin") return;
  const n = document.getElementById("admProdName").value.trim();
  const pts = parseInt(document.getElementById("admProdPoints").value);
  const img = document.getElementById("admProdImg").value.trim();
  const cat = document.getElementById("admProdCategory").value;
  const type = document.getElementById("admProdType").value;
  const status = document.getElementById("admProdStatus").value;

  if (!n || isNaN(pts) || !img) { alert("⚠️ Nhập đầy đủ thông tin!"); return; }
  
  const idx = products.findIndex(p => p.name.toLowerCase() === n.toLowerCase());
  if (idx >= 0) { 
    products[idx].points = pts; 
    products[idx].img = img; 
    products[idx].category = cat; 
    products[idx].type = type;
    products[idx].status = status;
  } else { 
    products.push({ id: Date.now(), name: n, points: pts, img, category: cat, type, status }); 
  }
  
  saveData(); renderProducts(); updateAccProductDropdown();
  document.getElementById("admProdName").value = ""; 
  document.getElementById("admProdPoints").value = ""; 
  document.getElementById("admProdImg").value = "";
  alert("✅ Đã cập nhật sản phẩm và trạng thái!");
}

function adminDeleteProduct(id) {
  if (userDB[activeUser]?.role !== "admin") return;
  if (confirm("Xóa sản phẩm này?")) { 
    products = products.filter(p => p.id !== id); 
    saveData(); renderProducts(); updateAccProductDropdown(); 
  }
}

function adminAddCloudAcc() {
  if (userDB[activeUser]?.role !== "admin") return;
  const prodName = document.getElementById("admAccTargetProd")?.value;
  const u = document.getElementById("admAccUser").value.trim();
  const p = document.getElementById("admAccPass").value.trim();
  const note = document.getElementById("admAccNote")?.value.trim();
  
  if (!prodName) { alert("⚠️ Vui lòng tạo sản phẩm loại Tài Khoản trước!"); return; }
  if (!u || !p) { alert("⚠️ Nhập đủ Tk và Mk!"); return; }
  
  cloudStock.push({ id: Date.now(), prodName, user: u, pass: p, note: note || "Không có ghi chú" }); 
  saveData(); renderCloudStock();
  
  document.getElementById("admAccUser").value = ""; 
  document.getElementById("admAccPass").value = ""; 
  if (document.getElementById("admAccNote")) document.getElementById("admAccNote").value = "";
  alert(`✅ Đã thêm nick vào sản phẩm: "${prodName}"`);
}

function renderCloudStock() {
  const b = document.getElementById("cloudAccList"); if (!b) return; b.innerHTML = "";
  if (!cloudStock.length) { b.innerHTML = `<div class="text-xs text-gray-500 italic">Kho trống</div>`; return; }
  cloudStock.forEach(a => {
    b.innerHTML += `<div class="flex items-center justify-between bg-gray-900 p-2 rounded-lg text-xs mb-1 border border-gray-800">
      <div>
        <div class="text-[10px] text-amber-400 font-bold uppercase">📦 ${a.prodName || 'Gói Chung'}</div>
        <div><span class="text-emerald-400 font-mono font-bold">${a.user}</span> | <span class="text-amber-300 font-mono">${a.pass}</span></div>
        <div class="text-[10px] text-gray-400 italic mt-0.5">📌 Note: ${a.note || 'Không có'}</div>
      </div>
      <button onclick="adminDeleteCloudAcc(${a.id})" class="text-red-400 border-none bg-transparent ml-2"><i class="fa-solid fa-trash"></i></button>
    </div>`;
  });
}

function adminDeleteCloudAcc(id) {
  if (userDB[activeUser]?.role !== "admin") return;
  cloudStock = cloudStock.filter(a => a.id !== id); saveData(); renderCloudStock();
}

function addLog(username, action, recipient = "-", points = 0) {
  let t = new Date().toLocaleTimeString("vi-VN", { hour12: false });
  logHistory.unshift({ time: t, username, recipient, action, points });
  if (logHistory.length > 100) logHistory.pop();
  saveData(); renderLogs();
}

function renderLogs() {
  const e = document.getElementById("logBody"); if (!e) return; e.innerHTML = "";
  logHistory.forEach(t => {
    e.innerHTML += `<tr><td class="text-gray-500">${t.time}</td><td class="font-semibold text-white">${t.username}</td><td class="text-amber-300 font-bold">${t.recipient || '-'}</td><td class="text-amber-400 font-bold">${t.action} (${t.points}Đ)</td></tr>`;
  });
}

function clearLogs() {
  if (userDB[activeUser]?.role !== "admin") return;
  if (confirm("Xóa log?")) { logHistory = []; saveData(); renderLogs(); }
}

function startGtrafficTask() {
  const dest = `${BASE_DEST}?status=completed&user=${encodeURIComponent(activeUser)}&t=${Date.now()}`;
  window.location.href = `https://gtraffic.io/st?apikey=${GTRAFFIC_KEY}&url=${encodeURIComponent(dest)}`;
}

document.addEventListener("DOMContentLoaded", () => { initSystem(); updateUI(); });
  
