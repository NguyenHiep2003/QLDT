export function convertUTCtoAdjustedTime(dateTime: Date) {
  // Chuyển chuỗi datetime sang đối tượng Date
  const date = dateTime;

  // Cộng thêm số giờ
  date.setHours(date.getHours());

  // Định dạng lại chuỗi theo định dạng yêu cầu "YYYY-MM-DDTHH:mm:ss"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Kết quả
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

// Sử dụng hàm
//const originalDate = new Date("2024-12-18T13:17:00.000Z");
//const adjustedDate = convertUTCtoAdjustedTime(originalDate);
//console.log(adjustedDate); // Kết quả: "2024-12-18T20:17:00"
