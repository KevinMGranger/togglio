CREATE TABLE users (
	userID INTEGER PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(128) NOT NULL,
	hash VARCHAR(255) NOT NULL
);

CREATE TABLE status (
	statusID INTEGER PRIMARY KEY AUTO_INCREMENT,
	statusName VARCHAR(255) NOT NULL,
  resourceID INTEGER NOT NULL
);

CREATE TABLE resources (
	resourceID INTEGER PRIMARY KEY AUTO_INCREMENT,
	userID INTEGER NOT NULL,
	resourceName VARCHAR(255),
	statusID INTEGER NOT NULL,

	FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (statusID) REFERENCES status(statusID)
);

ALTER TABLE status ADD CONSTRAINT FOREIGN KEY (resourceID) REFERENCES resources (resourceID);

CREATE TABLE hooks (
  hookID INTEGER PRIMARY KEY AUTO_INCREMENT,
  url VARCHAR(255) NOT NULL,
  resourceID INTEGER NOT NULL,

  FOREIGN KEY (resourceID) REFERENCES resources(resourceID)
);
