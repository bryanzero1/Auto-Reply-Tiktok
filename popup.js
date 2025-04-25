document.addEventListener("DOMContentLoaded", () => {
  // Nút bắt đầu Auto Reply
  document.getElementById("run-reply").addEventListener("click", async () => {
      const mode = document.querySelector('input[name="replyMode"]:checked')?.value || "send";
      const autoReplyChecked = mode === "send";

      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.storage.sync.set({ autoReply: autoReplyChecked });

      // Thực thi content.js với chế độ đã chọn
      await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
      });

      // Truyền chế độ vào content.js để điền sẵn hoặc gửi
      await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (mode) => {
              window.__replyMode__ = mode;
              if (typeof autoReply === "function") {
                  autoReply();
              }
          },
          args: [mode]
      });
  });

  // Nút Tắt Auto Reply
  document.getElementById("stop-reply").addEventListener("click", async () => {
      chrome.storage.sync.set({ autoReply: false });  // Tắt chế độ Auto Reply

      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Thực thi content.js và dừng việc phản hồi
      await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
              // Đặt biến chế độ là null để dừng các phản hồi tự động
              window.__replyMode__ = null;
              console.log("Auto Reply đã tắt.");
          }
      });

      // Hiển thị thông báo Toast
      const toast = document.getElementById("toast");
      toast.innerText = "🛑 Auto Reply has been stopped.";  // Hiển thị thông báo mới
      toast.classList.add("show");
      setTimeout(() => {
          toast.classList.remove("show");  // Ẩn sau 3 giây
      }, 3000);
  });

  // Đồng bộ chế độ phản hồi từ lưu trữ
  chrome.storage.sync.get(["autoReply"], (result) => {
      if (result.autoReply) {
          document.getElementById("autoReplyMode").checked = true;
      } else {
          document.getElementById("onlyFill").checked = true;
      }
  });
});
