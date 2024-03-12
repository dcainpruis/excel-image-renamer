//import { useState } from "react";

import { FileWithPath } from "@mantine/dropzone";
import * as XLSX from "xlsx";
import { FileUpload } from "../file-upload/FileUpload";
import { MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";

interface ExcelUploaderProps {
	setExcelData: (names: string[][]) => void;
}

export function ExcelUploader({ setExcelData }: ExcelUploaderProps) {
	async function setExcelFile(excelFile: FileWithPath) {
		const buffer = await excelFile.arrayBuffer();

		const wb = XLSX.read(buffer, { type: "binary" });
		/* Get first worksheet */
		const wsname = wb.SheetNames[0];
		const ws = wb.Sheets[wsname];

		/* Convert array of arrays */
		const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
		/* Update state */

		setExcelData(data);
	}

	return <FileUpload setFile={setExcelFile} acceptedFileTypes={MS_EXCEL_MIME_TYPE} fileType="excel" />;
}
