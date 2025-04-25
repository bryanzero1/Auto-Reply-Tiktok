// Hàm để hiển thị thông báo trên màn hình
function showToast(message, type = "info", duration = 3000) {
  const existing = document.querySelector(".custom-toast");
  if (existing) existing.remove();

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
      transition: "opacity 0.3s ease, transform 0.3s ease"
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
}

// Hàm tạo phản hồi tự động với trễ ngẫu nhiên
function generateReply(sentiment, stars) {
  const replies = {
      positive: [
          "Mặc đồ bộ xinh xinh mà còn để lại feedback dễ thương nữa, cảm ơn bạn nhiều nha 💕",
          "Nhìn comment mà muốn gói thêm yêu thương gửi đến bạn luôn nè 😘",
          "Đồ bộ đẹp - người mặc xinh - khách đáng yêu quá trời luôn 💖",
          "Feedback này làm shop vui muốn xỉu luôn đó bạn ơi ✨",
          "Cảm ơn nàng xinh đã luôn tin tưởng đồ bộ nhà em nha 🌸🌸",
          "Không gì hạnh phúc hơn là thấy khách mặc đồ xinh rồi còn hài lòng nữa 💖",
          "Mặc đồ bộ xinh xinh mà còn để lại feedback dễ thương nữa, cảm ơn bạn nhiều nha 💕",
          "Nhìn comment mà muốn gói thêm yêu thương gửi đến bạn luôn nè 😘",
          "Đồ bộ đẹp - người mặc xinh - khách đáng yêu quá trời luôn 💖",
          "Feedback này làm shop vui muốn xỉu luôn đó bạn ơi ✨",
          "Cảm ơn nàng xinh đã luôn tin tưởng đồ bộ nhà em nha 🌸🌸",
          "Không gì hạnh phúc hơn là thấy khách mặc đồ xinh rồi còn hài lòng nữa 💖",
          "Ở nhà mà vẫn xinh, vẫn chill là nhờ nàng đó nhaaa 💃💕",
          "Mỗi feedback như thế này là một bông hoa cho tụi em đó 🌸",
          "Giao đồ bộ mà nhận lại nụ cười - cảm ơn bạn thiệt nhiều 💝",
          "Shop mong mỗi lần mặc bộ này bạn đều cảm thấy thật nhẹ nhàng và xinh đẹp 🌿",
          "Phản hồi này làm tụi em muốn tặng thêm 10 bộ nữa luôn á 😄",
          "Cảm ơn vì đã chọn tụi em để 'lên đồ' mỗi ngày tại gia nha 👗💫",
          "U là trời! Feedback này làm shop muốn nhảy múa luôn đó 🕺💃",
          "Cảm ơn bạn thật nhiều 💖 Đơn sau nhớ quay lại với shop nha!",
          "Đọc bình luận của bạn mà tim muốn tan chảy luôn 💖",
          "Trời ơi iu quá đi mất! Cảm ơn bạn đã luôn ủng hộ shop nè 💕",
          "Nhận được phản hồi của bạn là niềm vui lớn với shop đó ạ 🌈",
          "Cảm ơn bạn khách dễ thương nè! Hẹn bạn lần mua sau thiệt xịn nữa nha ✨",
          "Bạn đáng yêu quá đi! Feedback vậy là tụi mình có thêm động lực lớn ghê đó💝💝💝 ",
          "Không biết nói gì ngoài 2 chữ: TUYỆT VỜI! 💯 Cảm ơn bạn nhiều thiệt nhiều!",
          "Shop cảm ơn bạn vì đã chia sẻ trải nghiệm đáng yêu thế này nhen 🌸",
          "Đọc bình luận mà lòng nhẹ tênh luôn ạ 🌸 Cảm ơn bạn đã tin tưởng tụi mình!",
          "Shop chúc bạn một ngày thật rực rỡ như comment của bạn vậy 🌞",
          "Feedback như nắng mai vậy đó! Shop cảm ơn bạn nha ☀️",
          "Vì bạn vui là shop vui! Gửi bạn 1000 trái tim nè 💝💝💝",
          "Quá xuất sắc luôn! Cảm ơn bạn đã lan tỏa năng lượng tích cực tới shop 🕺💃",
          "Shop cảm ơn bạn nhiều lắm ạ! ❤️",
          "Cảm ơn bạn đã ủng hộ đồ bộ nhà em nha 🥰",
          "Bạn ưng là tụi mình vui rồi ❤️",
          "Đội ơn bạn iu, cảm ơn bạn đã đánh giá 5 sao nhé ✨",
          "Lời động viên của bạn là động lực lớn với shop ạ 🌟",
          "Shop chúc bạn luôn xinh đẹp và rạng rỡ nha 😘",
          "Cảm ơn bạn đã tin tưởng và lựa chọn tụi mình 💕",
          "Rất vui vì bạn hài lòng, cảm ơn bạn nha 😍",
          "Shop sẽ cố gắng hơn nữa để không làm bạn thất vọng 💪",
          "Cảm ơn bạn iu đã để lại đánh giá dễ thương quá trời 💝"
      ],
      neutral: [
          "Cảm ơn bạn đã góp ý. Chúng tôi sẽ cải thiện để phục vụ bạn tốt hơn!💝",
          "Chúng tôi rất trân trọng ý kiến của bạn, cảm ơn bạn rất nhiều!💝",
          "Ý kiến của bạn rất quý giá với shop 💌",
          "Mong lần sau bạn sẽ hài lòng hơn ❤️",
          "Cảm ơn bạn đã góp ý 🌟 Shop sẽ cải thiện để phục vụ tốt hơn!",
          "Bạn nói đúng á, tụi mình sẽ cố gắng nhiều hơn nè 💪",
          "Ý kiến của bạn rất quý giá với shop 💝",
          "Cảm ơn bạn đã đánh giá, tụi mình sẽ cải thiện thêm ạ!",
          "Góp ý của bạn là điều rất quý giá với shop 💌",
          "Shop sẽ cố gắng tốt hơn trong lần tới nhé!",
          "Mong lần sau bạn sẽ hài lòng hơn ❤️",
      ],
      negative: [
        "Thật sự xin lỗi bạn 😢 Shop sẽ xử lý ngay và khắc phục triệt để.",
        "Mình không muốn bạn buồn đâu 😔 Inbox shop để được hỗ trợ tốt hơn nhé!",
        "Cảm ơn bạn đã phản hồi, dù buồn nhưng tụi mình ghi nhận rất nghiêm túc 🙏",
        "Shop rất tiếc vì bạn chưa hài lòng 💔",
        "Tụi mình xin lỗi và sẽ kiểm tra lại đơn hàng kỹ hơn.",
        "Mình sẽ cải thiện ngay lập tức. Mong được bạn thông cảm!",
        "Cảm ơn bạn đã phản hồi, shop cam kết khắc phục 🌱",
        "Rất mong có cơ hội phục vụ bạn tốt hơn lần sau ạ!"
      ]
  };

  if (stars === 5) {
      // Phản hồi cho đánh giá 5 sao (tích cực)
      return replies["positive"][Math.floor(Math.random() * replies["positive"].length)];
  }

  // Kiểm tra phản hồi tiêu cực
  if (stars <= 2) {
      return replies["negative"][Math.floor(Math.random() * replies["negative"].length)];
  }

  // Nếu không phải 5 sao hoặc 1-2 sao, trả về trung lập
  return replies["neutral"][Math.floor(Math.random() * replies["neutral"].length)];
}

// Hàm để mô phỏng hành vi người thật trong việc nhập văn bản
function typeText(element, text, speed = 100) {
  return new Promise(resolve => {
      let i = 0;
      function typeNextChar() {
          if (i < text.length) {
              element.value += text.charAt(i);
              i++;
              setTimeout(typeNextChar, Math.random() * speed + 50); // Thêm độ trễ ngẫu nhiên
          } else {
              resolve();  // Khi đã nhập xong
          }
      }
      typeNextChar();
  });
}

// Hàm để mô phỏng hành động di chuyển chuột ngẫu nhiên
function moveMouseRandomly() {
  const mouseX = Math.floor(Math.random() * window.innerWidth);
  const mouseY = Math.floor(Math.random() * window.innerHeight);
  const event = new MouseEvent('mousemove', {
      clientX: mouseX,
      clientY: mouseY
  });
  document.dispatchEvent(event);
}



// Hàm xử lý phản hồi tự động
async function autoReply() {
  // Kiểm tra nếu chế độ autoReply bị tắt
  if (window.__replyMode__ === null) {
      showToast("🛑 Không có phản hồi nào từ khách cần xử lý.", "error");  // Thông báo khi không có phản hồi
      return;  // Dừng lại nếu chế độ tự động phản hồi bị tắt
  }

  const allButtons = [...document.querySelectorAll(".text-p3-semibold.text-brand")];
  const replyButtons = allButtons.filter(btn => btn.innerText?.trim().toLowerCase() === "phản hồi");

  if (!replyButtons.length) {
      showToast("🛑 Không có phản hồi nào từ khách cần xử lý.", "error");
      return;  // Dừng lại nếu không có phản hồi nào
  }

  // Duyệt qua tất cả các phản hồi
  for (let index = 0; index < replyButtons.length; index++) {
      const btn = replyButtons[index];
      const container = btn.closest(".ratingListItem-pYOYoL");
      if (!container) continue;

      const comment = container.querySelector(".reviewText-f3ry9k");
      if (!comment) continue;

      const commentText = comment.innerText;
      const stars = container.querySelectorAll("svg.activeStar-OiHELX").length;  // Kiểm tra sao đánh giá
      const sentiment = detectFinalSentiment(container, commentText);  // Xác định tình cảm (positive, negative, neutral)
      const reply = generateReply(sentiment, stars);  // Tạo phản hồi dựa trên tình cảm và sao

      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      btn.click();

      await new Promise(r => setTimeout(r, Math.random() * 1500 + 1000));  // Thêm trễ ngẫu nhiên

      const textarea = document.querySelector("textarea.core-textarea.pulse-input-textarea");
      const sendBtn = document.querySelector("button.core-btn.core-btn-primary");

      if (textarea) {
          // Nhập văn bản vào ô phản hồi một cách tự nhiên
          await typeText(textarea, reply, 150);  // Thời gian nhập mỗi ký tự
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.focus();

          // Nếu ở chế độ "send" (Tự động gửi phản hồi)
          if (window.__replyMode__ === "send" && sendBtn) {
              await new Promise(r => setTimeout(r, Math.random() * 1000 + 500)); // Thêm trễ ngẫu nhiên trước khi gửi
              sendBtn.click();  // Gửi phản hồi

              // Gửi thông báo và lưu lịch sử phản hồi
              chrome.runtime?.sendMessage?.({ comment: commentText, reply: reply });
              showToast(`📦 Đã xử lý ${index + 1}/${replyButtons.length} phản hồi`, "success");
          } else {
              showToast(`✍️ Đã điền phản hồi ${index + 1}/${replyButtons.length}`, "info"); // Chỉ điền sẵn
          }
      }

      await new Promise(r => setTimeout(r, Math.random() * 3000 + 1500));  // Thêm trễ ngẫu nhiên giữa các phản hồi
  }

  showToast("✅ Đã hoàn thành phản hồi cho tất cả khách hàng.", "success");
}

// Kiểm tra trạng thái tự động từ storage
chrome.storage.sync.get(["autoReply"], (result) => {
  if (result.autoReply) {
      setTimeout(() => autoReply(), 2500); // Tự động phản hồi sau khi bật
  }
});