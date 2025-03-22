import { useState } from "react";
import * as XLSX from "xlsx";
import guestService from "../services/guestService.ts";
import { Gender } from "../types/types.ts";
import React from "react";

const UploadGuestsForm = ({ onFileUpload }: { onFileUpload: (file: File) => Promise<void> }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file).catch((error) => console.error("File upload error:", error));
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
    </div>
  );
};

const uploadGuestsFile = async (file: File) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const binaryString = e.target?.result;
    const wb = XLSX.read(binaryString, { type: "binary" });

    // קוראים את הגיליון הראשון
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // עכשיו 'data' מכיל את כל השורות של הקובץ
    const guestsData = data.slice(1).map((row: any) => ({
      name: row[0],
      mail: row[1],
      gender: row[2] === "male" ? Gender.male : Gender.female, // המרה מפורשת
      groupId: row[3],
    }));

    // עכשיו נוכל להוסיף את האורחים לטבלה
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

export { UploadGuestsForm, uploadGuestsFile };