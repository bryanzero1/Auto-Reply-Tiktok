// Đảm bảo chỉ khai báo một lần
let isAutoReplyRunning = false; // Biến toàn cục để kiểm soát trạng thái

// Hàm để hiển thị thông báo trên màn hình
function showToast(message, type = "info", duration = 3000) {
  try {
    const existing = [...document.querySelectorAll(".custom-toast")].find(
      (toast) => toast.innerText === message
    );
    if (existing) return; // Nếu thông báo đã tồn tại, không tạo thêm

    const toast = document.createElement("div");
    toast.className = "custom-toast toast-" + type;
    toast.innerHTML = `<span>${message}</span>`;

    Object.assign(toast.style, {
      position: "fixed",
      top: "280px",
      right: "20px",
      background: type === "error" ? "#ff4d4f" : type === "success" ? "#52c41a" : "#1890ff",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: "9999",
      fontSize: "14px",
      opacity: "0",
      transform: "translateY(20px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  } catch (error) {
    console.error("Error in showToast:", error);
  }
}

// Hàm tạo phản hồi tự động với trễ ngẫu nhiên
async function getRandomReply(fileName) {
  try {
    const response = await fetch(chrome.runtime.getURL(fileName));
    const text = await response.text();
    const replies = text.split("\n").filter((line) => line.trim() !== "");
    return replies[Math.floor(Math.random() * replies.length)];
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return null;
  }
}

async function generateAIReply(commentText, sentiment) {
  const apiKey = "sk-oTNySx8lcyWnGVSS6b66C0Aa35944379A60e98B0EeF73eBb"; // Thay bằng API Key của bạn
  const baseUrl = "https://api.sv2.llm.ai.vn/v1/chat/completions"; // Base URL chính xác
  const modelName = "openai:gpt-4o"; // Model Name

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`, // Sử dụng Bearer token
      },
      body: JSON.stringify({
        model: modelName, // Model bạn muốn sử dụng
        temperature: 0.7, // Mức độ sáng tạo
        max_tokens: 100, // Số lượng token tối đa

      
        messages: [
          {
            role: "user",
            content: `Hãy tạo một phản hồi ${sentiment} cho đánh giá sau: "${commentText}". 
Giới hạn phản hồi từ 60 đến 90 từ. Đừng vượt quá giới hạn này. Hãy sử dụng ngôn ngữ tự nhiên và thân thiện, thêm một vài biểu tượng cảm xúc phù hợp với cảm xúc của phản hồi.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData); // Log chi tiết lỗi
      return null;
    }

    const data = await response.json();
    console.log("API Response:", data); // Log phản hồi từ API
    return data.choices[0].message.content.trim(); // Trả về nội dung phản hồi
  } catch (error) {
    console.error("Error in generateAIReply:", error);
    return null;
  }
}

// Hàm để tạo phản hồi tự động cho các đánh giá
// Sử dụng AI để tạo phản hồi cho các đánh giá tích cực và tiêu cực
// Nếu không có phản hồi từ AI, sử dụng các file tĩnh để tạo phản hồi cho các đánh giá trung tính
async function generateReply(sentiment, stars, commentText) {
  try {
    console.log("Gọi generateReply cho phản hồi:", { commentText, stars });
    const aiReply = await generateAIReply(commentText, sentiment);
    if (aiReply) {
      const wordCount = aiReply.split(" ").length;
      console.log(`Phản hồi từ API có ${wordCount} từ:`, aiReply);
    }
    if (!aiReply) {
      console.warn("API không trả về phản hồi. Chuyển sang sử dụng file tĩnh.");
    } else {
      return formatReply(aiReply, sentiment);
    }
  } catch (error) {
    console.warn("AI không hoạt động, chuyển sang sử dụng file tĩnh:", error);
  }

  try {
    let reply;
    if (sentiment === "positive" && stars === 5) {
      reply = (await getRandomReply("positive.txt")) || "Cảm ơn bạn đã để lại đánh giá tích cực! 💖";
    } else if (stars <= 2) {
      reply = (await getRandomReply("negative.txt")) || "Shop rất tiếc vì bạn chưa hài lòng 💔";
    } else {
      reply = (await getRandomReply("neutral.txt")) || "Cảm ơn bạn đã góp ý. Chúng tôi sẽ cải thiện để phục vụ bạn tốt hơn! 💝";
    }
    return formatReply(reply, sentiment);
  } catch (error) {
    console.error("Error in generateReply (file tĩnh):", error);
    return null;
  }
}

// Hàm định dạng phản hồi (giới hạn từ và thêm biểu tượng cảm xúc)
function formatReply(reply, sentiment) {
  // Giới hạn phản hồi trong 60-90 từ
  const words = reply.split(" ");
  const trimmedReply = words.slice(0, 90).join(" "); // Giới hạn tối đa 90 từ

  // Nếu số từ ít hơn 60, thêm thông báo cảnh báo
  if (words.length < 60) {
    console.warn("Phản hồi có ít hơn 60 từ. Hãy kiểm tra lại prompt hoặc API.");
  }

  // Thêm biểu tượng cảm xúc phù hợp
  const emoji = sentiment === "positive" ? "😊" : sentiment === "negative" ? "😔" : "🤗";
  return `${trimmedReply} ${emoji}`;
}

// Hàm để mô phỏng hành vi người thật trong việc nhập văn bản
async function typeText(element, text, speed = 100) {
  element.value = ""; // Xóa nội dung cũ
  for (let i = 0; i < text.length; i++) {
    element.value += text[i];
    element.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, speed)); // Thêm trễ giữa các ký tự
  }
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("blur", { bubbles: true }));
  console.log("Hoàn thành việc điền nội dung:", element.value);
}

function getReplyButtons() {
  const allButtons = [...document.querySelectorAll(".text-p3-semibold.text-brand")];
  console.log("Tất cả các nút tìm thấy:", allButtons);

  // Lọc các nút "Phản hồi" và loại bỏ trùng lặp
  const replyButtons = allButtons
    .filter((btn) => btn.innerText?.trim().toLowerCase() === "phản hồi")
    .filter((btn, index, self) => self.indexOf(btn) === index);

  console.log("Các nút 'Phản hồi' tìm thấy:", replyButtons);
  return replyButtons;
}

async function processReply(btn, index, total) {
  const container = btn.closest(".ratingListItem-pYOYoL");
  if (!container) {
    console.warn(`Không tìm thấy container cho phản hồi thứ ${index + 1}`);
    return false;
  }

  const comment = container.querySelector(".reviewText-f3ry9k");
  if (!comment) {
    console.warn(`Không tìm thấy comment cho phản hồi thứ ${index + 1}`);
    return false;
  }

  const commentText = comment.innerText;
  const stars = parseInt(container.querySelectorAll("svg.activeStar-OiHELX").length, 10);
  console.log(`Phản hồi thứ ${index + 1}: comment="${commentText}", stars=${stars}`);

  const reply = await generateReply(
    stars === 5 ? "positive" : stars <= 2 ? "negative" : "neutral",
    stars,
    commentText
  );

  if (!reply) {
    console.error("Không thể tạo phản hồi. Bỏ qua phản hồi này.");
    showToast("❌ Không thể tạo phản hồi. Vui lòng kiểm tra lại.", "error");
    return false;
  }

  btn.scrollIntoView({ behavior: "smooth", block: "center" });
  btn.click();

  await new Promise((r) => setTimeout(r, Math.random() * 1500 + 1000));

  const textarea = document.querySelector("textarea.core-textarea.pulse-input-textarea");
  const sendBtn = document.querySelector("button.core-btn.core-btn-primary");

  if (!textarea) {
    console.error("Không tìm thấy ô nhập văn bản, dừng xử lý phản hồi.");
    showToast("❌ Không tìm thấy ô nhập phản hồi. Vui lòng kiểm tra giao diện.", "error");
    return false;
  }

  console.log("Nội dung phản hồi:", reply);
  console.log("Textarea value trước khi điền:", textarea.value);

  // Sử dụng hàm typeText để mô phỏng hành vi người dùng
  await typeText(textarea, reply, 50);

  console.log("Textarea value sau khi điền:", textarea.value);

  if (window.__replyMode__ === "send" && sendBtn) {
    console.log("Nhấn nút gửi...");
    await new Promise((r) => setTimeout(r, Math.random() * 1000 + 500));
    sendBtn.click();
    showToast(`📦 Đã xử lý phản hồi ${index + 1}/${total}`, "success");
  } else {
    showToast(`✍️ Đã điền phản hồi ${index + 1}/${total}. Đợi người dùng gửi.`, "info");
  }

  return true;
}

async function autoReply() {
  if (isAutoReplyRunning) {
    console.warn("Auto Reply đang chạy, không thể khởi động lại.");
    return;
  }

  isAutoReplyRunning = true; // Đặt trạng thái là đang chạy
  try {
    console.log("Bắt đầu autoReply với chế độ:", window.__replyMode__);

    // Đợi một chút để giao diện tải xong
    await new Promise((r) => setTimeout(r, 2000));

    const replyButtons = getReplyButtons();
    if (!replyButtons.length) {
      showToast("🛑 Không có phản hồi nào từ khách cần xử lý.", "error");
      return;
    }

    for (let index = 0; index < replyButtons.length; index++) {
      const success = await processReply(replyButtons[index], index, replyButtons.length);
      if (!success) {
        console.error(`Phản hồi thứ ${index + 1} không được xử lý.`);
        showToast("❌ Có lỗi xảy ra khi xử lý phản hồi. Vui lòng kiểm tra lại.", "error");
        return; // Dừng lại nếu có lỗi
      }

      // Nếu chế độ là "fill", dừng lại sau khi điền phản hồi
      if (window.__replyMode__ === "fill") {
        console.log("Chế độ 'fill' được kích hoạt. Dừng lại sau khi điền phản hồi.");
        break;
      }

      await new Promise((r) => setTimeout(r, Math.random() * 3000 + 1500)); // Thêm trễ ngẫu nhiên giữa các phản hồi
    }

    showToast("✅ Đã hoàn thành phản hồi cho tất cả khách hàng.", "success");
  } catch (error) {
    console.error("Error in autoReply:", error);
    showToast(`❌ Lỗi: ${error.message}`, "error");
  } finally {
    isAutoReplyRunning = false; // Đặt trạng thái là không chạy
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const runReplyButton = document.getElementById("run-reply");
  const stopReplyButton = document.getElementById("stop-reply");

  if (!runReplyButton || !stopReplyButton) {
    console.error("Không tìm thấy các phần tử cần thiết trong giao diện.");
    return;
  }

  console.log("runReplyButton:", runReplyButton);
  console.log("stopReplyButton:", stopReplyButton);

  // Nút dừng Auto Reply
  stopReplyButton.addEventListener("click", async () => {
    try {
      stopReplyButton.disabled = true; // Vô hiệu hóa nút
      await chrome.storage.sync.set({ autoReply: false });
      console.log("🛑 Auto Reply đã được tắt.");
    } catch (error) {
      console.error("Error stopping Auto Reply:", error);
    } finally {
      stopReplyButton.disabled = false; // Kích hoạt lại nút
    }
  });

  // Nút chạy Auto Reply
  runReplyButton.addEventListener("click", async () => {
    try {
      runReplyButton.disabled = true;
      await chrome.storage.sync.set({ autoReply: true });
      console.log("✅ Auto Reply đã được bật.");

      const targetUrl = "https://seller-vn.tiktok.com/product/rating?shop_region=VN";
      if (!window.location.href.startsWith("http")) {
        alert("Vui lòng chuyển sang một tab website (không phải chrome://) trước khi bấm Start Auto Reply!");
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        if (tab && tab.url && tab.url.startsWith("http")) {
          chrome.tabs.update(tab.id, { url: targetUrl });
        } else {
          alert("Vui lòng chuyển sang một tab website (không phải chrome://) trước khi bấm Start Auto Reply!");
        }
      });
    } catch (error) {
      console.error("Error starting Auto Reply:", error);
    } finally {
      runReplyButton.disabled = false;
    }
  });
});

// Lắng nghe sự kiện khi trang đã tải xong
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url === "https://seller-vn.tiktok.com/product/rating?shop_region=VN") {
    // Trang đã tải xong, chạy tiện ích của bạn ở đây
    console.log("Trang đã tải xong, bắt đầu chạy tiện ích...");
    autoReply();
  }
});