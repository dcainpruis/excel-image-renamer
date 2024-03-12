import { MIME_TYPES } from "@mantine/dropzone";
import { FileWithPath } from "@mantine/dropzone";
import { FileUpload } from "../file-upload/FileUpload";
import JSZip from "jszip";

interface ZipUploaderProps {
	setZipFile: (zf: JSZip) => void;
}

export function ZipUploader({ setZipFile }: ZipUploaderProps) {
	async function setFile(zipFile: FileWithPath) {
		const buffer = await zipFile.arrayBuffer();

		const zf = await JSZip.loadAsync(buffer);

		setZipFile(zf);
	}

	return (
		<FileUpload setFile={setFile} acceptedFileTypes={[MIME_TYPES.zip, "application/x-zip-compressed"]} fileType="zip" />
	);
}
