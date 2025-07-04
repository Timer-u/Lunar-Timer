document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const currentDateElement = document.getElementById("currentDate");
  const currentTimeElement = document.getElementById("currentTime");
  const daysCounterElement = document.getElementById("daysCounter");

  // 设置2025年农历新年开始日期 (2025年1月29日)
  const lunarNewYear2025 = new Date(2025, 0, 29);

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
    daysCounterElement.textContent = now < lunarNewYear2025 ? 0 : diffDays;
  }

  // 初始更新
  updateDateTime();

  // 每秒更新一次时间
  setInterval(updateDateTime, 1000);
});
