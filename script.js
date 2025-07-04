document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const currentDateElement = document.getElementById("currentDate");
  const currentTimeElement = document.getElementById("currentTime");
  const daysCounterElement = document.getElementById("daysCounter");
  const generateWishBtn = document.getElementById("generateWishBtn");
  const wishOutput = document.getElementById("wishOutput");

  // 设置2025年农历新年开始日期 (2025年1月29日)
  const lunarNewYear2025 = new Date(2025, 0, 29);

  // 数字转中文大写函数
  function numberToChinese(num) {
    const chineseNumbers = [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
    ];
    const units = ["", "十", "百", "千"];

    if (num === 0) return "零";
    if (num < 10) return chineseNumbers[num];

    let result = "";
    let numStr = num.toString();
    let len = numStr.length;

    for (let i = 0; i < len; i++) {
      const digit = parseInt(numStr[i]);
      const unitIndex = len - i - 1;

      if (digit !== 0) {
        // 处理十位上的"一"省略情况 (如10读作"十"而不是"一十")
        if (!(unitIndex === 1 && digit === 1 && i === 0)) {
          result += chineseNumbers[digit];
        }
        result += units[unitIndex];
      } else {
        // 避免连续零和结尾零
        if (result[result.length - 1] !== "零" && i < len - 1) {
          result += "零";
        }
      }
    }

    // 移除末尾的零
    if (result.endsWith("零")) {
      result = result.slice(0, -1);
    }

    return result;
  }

  // 获取已过天数
  function getDaysPassed() {
    const now = new Date();
    const diffTime = Math.abs(now - lunarNewYear2025);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return now < lunarNewYear2025 ? 0 : diffDays;
  }

  // 更新时间和日期
  function updateDateTime() {
    const now = new Date();

    // 格式化日期
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    currentDateElement.textContent = now.toLocaleDateString("zh-CN", options);

    // 格式化时间
    const time = now.toLocaleTimeString("zh-CN");
    currentTimeElement.textContent = time;

    // 更新天数计数器
    const dayCount = getDaysPassed();
    daysCounterElement.textContent = dayCount;
  }

  // 生成祝福语
  function generateWish() {
    const daysPassed = getDaysPassed();
    const dayChinese = numberToChinese(daysPassed);
    const wishText = `新年第${dayChinese}天快乐~`;

    wishOutput.textContent = wishText;
    wishOutput.classList.remove("copied");
  }

  // 复制祝福语到剪贴板
  let copyTooltip = null;

  function createCopyTooltip() {
    if (!copyTooltip) {
      copyTooltip = document.createElement("div");
      copyTooltip.className = "copy-tooltip";
      copyTooltip.innerHTML = `
          <span class="material-symbols-outlined">check_circle</span>
          <span>已复制到剪贴板</span>
        `;
      document.body.appendChild(copyTooltip);
    }
    return copyTooltip;
  }

  // 显示复制提示
  function showCopyTooltip(success = true) {
    const tooltip = createCopyTooltip();

    if (success) {
      tooltip.innerHTML = `
          <span class="material-symbols-outlined">check_circle</span>
          <span>已复制到剪贴板</span>
        `;
    } else {
      tooltip.innerHTML = `
          <span class="material-symbols-outlined">error</span>
          <span>复制失败，请手动复制</span>
        `;
    }

    // 显示提示
    tooltip.classList.add("show");

    // 3秒后自动隐藏
    setTimeout(() => {
      tooltip.classList.remove("show");
    }, 3000);
  }

  // 复制祝福语到剪贴板
  function copyWishToClipboard() {
    if (wishOutput.textContent) {
      // 添加点击动画
      wishOutput.classList.add("copying");

      // 尝试使用现代 API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(wishOutput.textContent)
          .then(() => {
            showCopyTooltip(true);
          })
          .catch((err) => {
            console.error("复制失败:", err);
            fallbackCopy();
          });
      } else {
        // 降级方案
        fallbackCopy();
      }

      // 移除动画类
      setTimeout(() => {
        wishOutput.classList.remove("copying");
      }, 600);
    }
  }

  // 降级复制方案
  function fallbackCopy() {
    const textArea = document.createElement("textarea");
    textArea.value = wishOutput.textContent;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      showCopyTooltip(successful);
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showCopyTooltip(false);
    }

    document.body.removeChild(textArea);
  }

  // 添加长按支持（移动端）
  let pressTimer = null;

  wishOutput.addEventListener("touchstart", function (e) {
    pressTimer = setTimeout(() => {
      copyWishToClipboard();
      e.preventDefault();
    }, 500);
  });

  wishOutput.addEventListener("touchend", function () {
    clearTimeout(pressTimer);
  });

  wishOutput.addEventListener("touchmove", function () {
    clearTimeout(pressTimer);
  });

  // 事件监听
  generateWishBtn.addEventListener("click", generateWish);
  wishOutput.addEventListener("click", copyWishToClipboard);

  // 初始更新
  updateDateTime();

  // 每秒更新一次时间
  setInterval(updateDateTime, 1000);
});
