document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const currentDateElement = document.getElementById("currentDate");
  const currentTimeElement = document.getElementById("currentTime");
  const daysCounterElement = document.getElementById("daysCounter");

  // 设置2025年农历新年开始日期 (2025年1月29日)
  const lunarNewYear2025 = new Date(2025, 0, 29);

  // 数字转中文大写函数
  function numberToChinese(num) {
    const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];
    
    if (num === 0) return '零';
    if (num < 10) return chineseNumbers[num];
    
    let result = '';
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
        if (result[result.length - 1] !== '零' && i < len - 1) {
          result += '零';
        }
      }
    }
    
    // 移除末尾的零
    if (result.endsWith('零')) {
      result = result.slice(0, -1);
    }
    
    return result;
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

    // 计算农历新年已过天数
    const diffTime = Math.abs(now - lunarNewYear2025);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 如果当前日期在农历新年之前，则显示0
    const dayCount = now < lunarNewYear2025 ? 0 : diffDays;
    daysCounterElement.textContent = numberToChinese(dayCount);
  }

  // 初始更新
  updateDateTime();

  // 每秒更新一次时间
  setInterval(updateDateTime, 1000);
});
