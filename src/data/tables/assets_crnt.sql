CREATE TABLE assets (
	imageId INTEGER PRIMARY KEY AUTOINCREMENT,
	imageName TEXT NOT NULL,
	imageBase64 TEXT NOT NULL
, imageBytes BLOB);

CREATE UNIQUE INDEX assets_imageName_IDX ON assets (imageName);