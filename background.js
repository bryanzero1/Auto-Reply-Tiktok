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