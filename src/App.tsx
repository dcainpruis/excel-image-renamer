import { useState } from "react";
import "./App.css";
import { ExcelUploader } from "./components/excel-uploader/ExcelUploader";
import { ZipUploader } from "./components/zip-uploader/ZipUploader";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { saveAs } from "file-saver";
import JSZip from "jszip";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import {
	MantineProvider,
	Button,
	Group,
	Title,
	Stack,
	Checkbox,
	NumberInput,
	ScrollArea,
	Text,
	Center,
	Loader,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

/**
 * TODO:
 * - Eventually validate if the set row to start or column > than the dimensions of excel spreadsheet
 * - Allow you to select what worksheet to use
 *
 */
function App() {
	const [excelData, setExcelData] = useState<string[][]>([[]]);
	const [uploadedZip, setUploadedZip] = useState<JSZip | undefined>(undefined);
	const [doubleSided, setDoubleSided] = useState<boolean>(false);
	const [canDownload, setCanDownload] = useState<boolean>(false);
	const [startRow, setStartRow] = useState<string | number>("");
	const [column, setColumn] = useState<string | number>("");
	const [newNames, setNewNames] = useState<string[][]>([[]]);
	const [creatingZip, setCreatingZip] = useState<boolean>(false);
	const [blob, setBlob] = useState<Blob | undefined>(undefined);

	function setZip(zip: JSZip) {
		setUploadedZip(zip);
		setCanDownload(false);
	}

	function setData(newData: string[][]) {
		setExcelData(newData);
		setCanDownload(false);
	}

	async function download() {
		if (blob) {
			saveAs(blob, "New.zip");
		}
	}

	function getDefaultStart(value: string | number) {
		return value ? parseInt(value as string) - 1 : 0;
	}

	function getNameList() {
		const row = getDefaultStart(startRow);
		const clm = getDefaultStart(column);

		return excelData.slice(row).map((r) => r[clm]);
	}

	/**
	 * Renames the images inside a zip folder using the names given in an excel document.
	 * The images inside the zip folder are expected to be in a sorted order.
	 * i.e. <common_name> - 01, <common_name> - 02
	 */
	async function rename() {
		if (!uploadedZip || !excelData.length) {
			return;
		}

		setCreatingZip(true);
		const newZip = JSZip();
		const entries: JSZip.JSZipObject[] = [];

		uploadedZip.forEach((_, zipEntry) => entries.push(zipEntry));

		const nameList = getNameList();
		const newNames: string[][] = [];

		entries.sort((a, b) => a.name.localeCompare(b.name));
		entries.forEach((zipEntry, index) => {
			let name = nameList[index];

			if (doubleSided) {
				name = nameList[Math.floor(index / 2)];

				if (index % 2) {
					name += " - 2";
				}
			}
			const mimeType = zipEntry.name.split(".")[1];
			newZip.file(name + "." + mimeType, zipEntry.async("arraybuffer"));
			newNames.push([zipEntry.name, name + "." + mimeType]);
		});

		const newBlob = await newZip.generateAsync({ type: "blob" });
		setBlob(newBlob);
		setNewNames(newNames);

		setCanDownload(true);
		setCreatingZip(false);
	}

	function resetForm() {
		setExcelData([]);
		setUploadedZip(undefined);
		setDoubleSided(false);
		setCanDownload(false);
		setColumn("");
		setStartRow("");
		setCreatingZip(false);
	}

	return (
		<MantineProvider>
			<Group h="100%">
				<div className="main">
					<Stack w={500}>
						<Title order={2}>Image Renamer</Title>
						<ExcelUploader setExcelData={setData} />
						<ZipUploader setZipFile={setZip} />
						<Group>
							<NumberInput
								label="Row to start"
								placeholder="Default: First row"
								value={startRow}
								onChange={setStartRow}
								min={1}
								allowNegative={false}
								w="48%"
							/>
							<NumberInput
								label="Column to use"
								placeholder="Default: First Column"
								value={column}
								onChange={setColumn}
								min={1}
								allowNegative={false}
								w="48%"
							/>
						</Group>
						<Checkbox
							checked={doubleSided}
							onChange={(event) => setDoubleSided(event.currentTarget.checked)}
							label="Double sided"
							size="md"
						/>
						<Button onClick={rename} disabled={!(uploadedZip && excelData.length)}>
							Rename
						</Button>
						{creatingZip ? (
							<Button loading loaderProps={{ type: "dots" }}>
								Loading button
							</Button>
						) : (
							<Button disabled={!canDownload} onClick={download} rightSection={<IconDownload size={14} />}>
								Download
							</Button>
						)}
						<Button onClick={resetForm}>Reset</Button>
					</Stack>
				</div>

				<aside className="sidebar">
					{creatingZip ? (
						<Center h="100%">
							<Loader size={50} />
						</Center>
					) : (
						<Stack h="100%">
							<Title order={3}>New Names</Title>
							<ScrollArea scrollbars="y" h="100%">
								{newNames.map((nameSet) => {
									return (
										<Stack gap="0.1" className="newName">
											<Text span>{nameSet[1]}</Text>
											<Text span size="sm" fs="italic">
												{nameSet[0]}
											</Text>
										</Stack>
									);
								})}
							</ScrollArea>
						</Stack>
					)}
				</aside>
			</Group>
		</MantineProvider>
	);
}

export default App;
