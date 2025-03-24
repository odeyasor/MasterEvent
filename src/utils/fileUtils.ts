// src/utils/fileUtils.ts
import * as XLSX from "xlsx";
import guestService from "../services/guestService.ts";
import { saveAs } from "file-saver";
import { Gender } from "../types/types.ts";
import groupService from "../services/groupService.ts";

export const downloadExcelTemplate = async () => {
  // שליפת רשימת קבוצות מהשרת
  const groups = await groupService.getAllGroups();
  const groupNames = groups.map(g => g.name); // שמות הקבוצות

  // גיליון ראשי עם כותרות
  const ws = XLSX.utils.aoa_to_sheet([
    ["Name", "Email", "Gender", "Group Name", "Available Groups"] // הוספת עמודה חמישית
  ]);

  // הוספת שמות הקבוצות בעמודה E (העמודה החמישית)
  groupNames.forEach((name, index) => {
    const cell = XLSX.utils.encode_cell({ r: index, c: 4 }); // עמודה E (עמודה 5)
    ws[cell] = { v: name, t: 's' };

    // הוספת הערה ליד כל שם קבוצה
    ws[cell].c = [{
      a: `Only select a group from the list.`, // הערה שתסביר מה לעשות
      t: "s"
    }];
  });

  // יצירת חוברת והוספת הגיליונות
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Guests");

  // הוספת Data Validation (קומבובוקס) בעמודת "Group Name" (עמודה D)
  const dataValidation = {
    type: "list",
    formula1: `'Guests'!$E$1:$E$${groupNames.length}`, // טווח שמות הקבוצות בעמודה E
    showDropdown: true, // הצגת הקומבובוקס
  };

  // הוספת Data Validation לכל השורות בעמודת "Group Name"
  for (let i = 2; i <= 100; i++) { // טווח מספיק לשורות
    const cellRef = `D${i}`; // עמודת Group Name (D)
    if (!ws["!dataValidation"]) ws["!dataValidation"] = [];
    ws["!dataValidation"].push({ sqref: cellRef, ...dataValidation });
  }

  // יצירת קובץ להורדה
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
