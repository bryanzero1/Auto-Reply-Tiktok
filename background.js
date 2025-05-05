let history = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.comment && msg.reply) {
    history.unshift({ comment: msg.comment, reply: msg.reply });
    console.log("Phản hồi đã lưu:", msg);
  }
});

if (history.length > 50) {
  history.pop(); // Xóa mục cũ nhất
}

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url === "https://seller-vn.tiktok.com/product/rating?shop_region=VN") {
    // Trang đã tải xong, chạy tiện ích của bạn ở đây
    console.log("Trang đã tải xong, bắt đầu chạy tiện ích...");
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      function: autoReply, // Gọi hàm autoReply từ content script
    });
  }
});