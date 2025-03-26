// src/utils/fileUtils.ts
import * as XLSX from "xlsx";
import guestService from "../services/guestService.ts";
import { saveAs } from "file-saver";
import { Gender } from "../types/types.ts";

export const downloadExcelTemplate = () => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["Name", "Email", "Gender", "GroupId"]
  ]);
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Guests");

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(file, "guests_template.xlsx");
};

export const uploadGuestsFile = async (file: File) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const binaryString = e.target?.result;
    if (!binaryString) {
      alert("Error reading file");
      return;
    }
    const wb = XLSX.read(binaryString, { type: 'binary' });

    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const guestsData = data.slice(1).map((row: any) => ({
      name: row[0] || "", 
      mail: row[1] || "",
      gender: row[2] === "male" ? Gender.male : Gender.female,
      groupId: row[3] || 0,
    }));

    try {
      for (const guest of guestsData) {
        await guestService.createGuest(guest);
      }
      alert("All guests uploaded successfully!");
    } catch (error) {
      console.error("Error uploading guests:", error);
      alert("An error occurred while uploading guests.");
    }
  };

  reader.readAsBinaryString(file);
};
