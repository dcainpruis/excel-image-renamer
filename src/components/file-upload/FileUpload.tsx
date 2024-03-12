import { useState } from "react";
import { Group, Text, rem } from "@mantine/core";
import "./FileUpload.css";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconUpload, IconFile, IconX } from "@tabler/icons-react";

interface FileUploadProps {
	acceptedFileTypes: string[];
	setFile: (file: FileWithPath) => void;
	fileType: string;
}

export function FileUpload({ acceptedFileTypes, setFile, fileType }: FileUploadProps) {
	const [fileName, setFileName] = useState<string | undefined>(undefined);

	function onDropAccepted(files: FileWithPath[]) {
		if (files.length > 0) {
			setFile(files[0]);
			setFileName(files[0].name);
		}
	}

	function UploadFileDisplay() {
		return (
			<div>
				<Text size="xl" inline>
					Drag file here or click to select file
				</Text>
				<Text size="sm" c="dimmed" inline mt={7}>
					Attach a single {fileType} file
				</Text>
			</div>
		);
	}

	function FileNameDisplay() {
		return (
			<div>
				<Text size="xl" inline>
					{fileName}
				</Text>
				<Text size="sm" c="dimmed" inline mt={7}>
					Drag file here or click to select a different file
				</Text>
			</div>
		);
	}

	return (
		<Dropzone
			onDrop={onDropAccepted}
			onReject={(files) => console.log("rejected files", files)}
			accept={acceptedFileTypes}
			maxFiles={1}
		>
			<Group justify="left" gap="xl" mah={150} style={{ pointerEvents: "none" }}>
				<Dropzone.Accept>
					<IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
					<p>HI</p>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
				</Dropzone.Reject>
				<Dropzone.Idle>
					<IconFile style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
				</Dropzone.Idle>

				{fileName == undefined ? <UploadFileDisplay /> : <FileNameDisplay />}
			</Group>
		</Dropzone>
	);
}
