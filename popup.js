document.addEventListener("DOMContentLoaded", () => {
  const runReplyButton = document.getElementById("run-reply");
  const stopReplyButton = document.getElementById("stop-reply");

  if (!runReplyButton || !stopReplyButton) {
    console.error("Không tìm thấy các phần tử cần thiết trong giao diện.");
    return;
  }

  // Nút bắt đầu Auto Reply
  runReplyButton.addEventListener("click", async () => {
    try {
      // Cập nhật trạng thái autoReply trong storage
      await chrome.storage.sync.set({ autoReply: true });
      showToast("✅ Auto Reply đã được bật.", "success");

      // Gửi tin nhắn đến content script để bắt đầu autoReply
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              files: ["content.js"], // Chèn content.js nếu chưa được tải
            },
            () => {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                  console.log("Auto Reply đang được kích hoạt...");
                  if (typeof autoReply === "function") {
                    autoReply();
                  } else {
                    console.error("Hàm autoReply không được định nghĩa.");
                  }
                },
              });
            }
          );
        }
      });
    } catch (error) {
      console.error("Error starting Auto Reply:", error);
    }
  });

  // Nút Tắt Auto Reply
  stopReplyButton.addEventListener("click", async () => {
    try {
      // Cập nhật trạng thái autoReply trong storage
      await chrome.storage.sync.set({ autoReply: false });
      showToast("🛑 Đã tắt Auto Reply.", "info");
    } catch (error) {
      console.error("Error stopping Auto Reply:", error);
    }
  });

  // Đồng bộ chế độ phản hồi từ lưu trữ
  chrome.storage.sync.get(["autoReply"], (result) => {
    const autoReplyMode = document.getElementById("autoReplyMode");
    const onlyFillMode = document.getElementById("onlyFill");

    if (!autoReplyMode || !onlyFillMode) {
      console.error("Không tìm thấy các phần tử radio để đồng bộ chế độ.");
      return;
    }

    if (result.autoReply) {
      autoReplyMode.checked = true;
    } else {
      onlyFillMode.checked = true;
    }
  });
});

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.error("Không tìm thấy phần tử Toast.");
    return;
  }

  toast.innerText = message;
  toast.classList.add("show");

  clearTimeout(toast.timeout); // Xóa timeout cũ nếu có
  toast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}