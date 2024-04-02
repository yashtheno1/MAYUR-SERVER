const dbpool = require(".")

var users = `CREATE TABLE IF NOT EXISTS Users(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  isAttendance BOOLEAN DEFAULT TRUE,
  isDaily BOOLEAN DEFAULT FALSE
);`;

var enquiries = `CREATE TABLE IF NOT EXISTS Enquiries(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  About TEXT,
  isSolved BOOLEAN DEFAULT FALSE
);`;

var agent_profile = `CREATE TABLE IF NOT EXISTS Agent_profile(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  DisplayName TEXT,
  RegisteredName TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  PhoneNumber VARCHAR(15),
  ImageId INT,
  Address TEXT,
  Notes TEXT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UserId INT,
  CONSTRAINT fk_user_for_agent_profile
  FOREIGN KEY (UserId)
  REFERENCES Users(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  DUE INT
);`;

var user_profile = `CREATE TABLE IF NOT EXISTS User_profile(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  DisplayName VARCHAR(50),
  RegisteredName VARCHAR(50),
  isActive BOOLEAN DEFAULT TRUE,
  isCompleted BOOLEAN DEFAULT FALSE,
  PhoneNumber VARCHAR(15),
  ImageId INT,
  Address TEXT,
  Notes TEXT,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  AgentId INT,
  CONSTRAINT fk_agent_for_user_profile
  FOREIGN KEY (AgentId)
  REFERENCES Agent_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  UserId INT,
  CONSTRAINT fk_user_for_user_profile
  FOREIGN KEY (UserId)
  REFERENCES Users(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  DUE INT
);`;


var enrollments = `CREATE TABLE IF NOT EXISTS Enrollments(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Type VARCHAR(15),
  SubType VARCHAR(15),
  Cost INT,
  TotalTime FLOAT,
  isRenewal BOOLEAN DEFAULT FALSE,
  User_profile_ID INT,
  CONSTRAINT fk_user_profile_for_enrollment
  FOREIGN KEY (User_profile_ID)
  REFERENCES User_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
);`;

var attendance = `CREATE TABLE IF NOT EXISTS Attendance(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  User_profile_ID INT,
  Enrollment_ID INT,
  Type TEXT,
  isPresent BOOLEAN DEFAULT TRUE,
  isCompleted BOOLEAN DEFAULT FALSE,
  inTime TIMESTAMP,
  Vehicle_ID INT,
  CONSTRAINT fk_user_profile_for_attendance
  FOREIGN KEY (User_profile_ID)
  REFERENCES User_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_for_attendance
  FOREIGN KEY (Enrollment_ID)
  REFERENCES Enrollments(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  CONSTRAINT fk_vehicle_for_attendance
  FOREIGN KEY (Vehicle_ID)
  REFERENCES Vehicles(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
);`;


var vehicles = `CREATE TABLE IF NOT EXISTS Vehicles(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  VehicleNumber VARCHAR(20),
  UserId INT,
  CONSTRAINT fk_user_for_vehicle
  FOREIGN KEY (UserId)
  REFERENCES Users(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
);`;

var bills = `CREATE TABLE IF NOT EXISTS Bills(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Agent_ID INT,
  User_profile_ID INT,
  Enrollment_ID INT,
  Date DATE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  Amount INT,
  Notes TEXT,
  CONSTRAINT fk_agent_for_bills
  FOREIGN KEY (Agent_ID)
  REFERENCES Agent_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  CONSTRAINT fk_user_profile_for_bills
  FOREIGN KEY (User_profile_ID)
  REFERENCES User_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_for_bills
  FOREIGN KEY (Enrollment_ID)
  REFERENCES Enrollments(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
);`;

var activity = `CREATE TABLE IF NOT EXISTS Activity(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  User_profile_ID INT,
  Agent_ID INT,
  Note TEXT,
  Activity TEXT,
  CONSTRAINT fk_user_profile_for_activity
  FOREIGN KEY (User_profile_ID)
  REFERENCES User_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE,
  CONSTRAINT fk_agent_for_activity
  FOREIGN KEY (Agent_ID)
  REFERENCES Agent_profile(ID)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
);`;

var notifications = `CREATE TABLE IF NOT EXISTS Notifications(
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Notification TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

dbpool.getConnection(async (err, connection) => {
  if (err) {
    connection.release()
    console.log('database connection failed' + err)
  } else {
    connection.query(
      // users 
      // enquiries 
      //  agent_profile 
      user_profile 
      //  enrollments 
      // attendance 
      // vehicles 
      //  bills 
      //  activity 
      //  notifications
      ,
      async (error, results) => {
      if (error) {
      connection.release();
      console.log(error);
      } else {
      connection.release();
      console.log(results);
      }
      }
    );
  }
})
