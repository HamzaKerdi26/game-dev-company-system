
CREATE ROLE admin NOLOGIN;
CREATE ROLE developer NOLOGIN;
CREATE ROLE tester NOLOGIN;

-- ===========================
-- CREATE TABLES
-- ===========================
CREATE TABLE client (
    clientid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(100)
);

CREATE TABLE employee (
    employeeid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    department VARCHAR(50),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE tool (
    toolid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    licensestatus VARCHAR(50)
);

CREATE TABLE game (
    gameid SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    releasedate DATE,
    clientid INT REFERENCES client(clientid)
);

CREATE TABLE project (
    projectid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gameid INT REFERENCES game(gameid),
    startdate DATE,
    enddate DATE,
    status VARCHAR(50)
);

CREATE TABLE asset (
    assetid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    projectid INT REFERENCES project(projectid),
    createdby INT REFERENCES employee(employeeid)
);

CREATE TABLE task (
    taskid SERIAL PRIMARY KEY,
    description TEXT,
    status VARCHAR(50),
    projectid INT REFERENCES project(projectid),
    assignedto INT REFERENCES employee(employeeid),
    duedate DATE
);

CREATE TABLE bugreport (
    bugid SERIAL PRIMARY KEY,
    description TEXT,
    severity VARCHAR(20),
    projectid INT REFERENCES project(projectid),
    reportedby INT REFERENCES employee(employeeid),
    status VARCHAR(50)
);

CREATE TABLE employeetool (
    employeeid INT REFERENCES employee(employeeid),
    toolid INT REFERENCES tool(toolid),
    PRIMARY KEY (employeeid, toolid)
);

CREATE TABLE DBUser (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    employeeid INT REFERENCES employee(employeeid),
    loginattempts INT DEFAULT 0,
    maxloginattempts INT DEFAULT 3,
    isactive BOOLEAN DEFAULT TRUE
);

-- ===========================
-- SAMPLE DATA 
-- ===========================

-- Clients
INSERT INTO client (name, contact) VALUES
('Epic Games', 'contact@epicgames.com'),
('Ubisoft', 'info@ubisoft.com'),
('Activision', 'support@activision.com'),
('Valve', 'admin@valvesoftware.com'),
('EA Games', 'contact@ea.com');

-- Employees (MATCHING DATABASE USERS)
INSERT INTO employee (name, role, department, email) VALUES
('Admin User', 'Admin', 'Management', 'admin@hamzainteractive.com'),
('Hamza', 'Developer', 'Development', 'hamza@hamzainteractive.com'),
('Sara', 'Developer', 'Development', 'sara@hamzainteractive.com'),
('Lina', 'Tester', 'QA', 'lina@hamzainteractive.com'),
('Omar', 'Developer', 'Development', 'omar@hamzainteractive.com'),
('Maya', 'Tester', 'QA', 'maya@hamzainteractive.com');

-- Tools
INSERT INTO tool (name, version, licensestatus) VALUES
('Unity', '2023.2', 'Licensed'),
('Unreal Engine', '5.3', 'Licensed'),
('Blender', '4.0', 'Free'),
('Maya', '2024', 'Licensed'),
('Photoshop', '2024', 'Licensed'),
('Visual Studio', '2022', 'Licensed'),
('Git', '2.42', 'Free');

-- Games
INSERT INTO game (title, genre, releasedate, clientid) VALUES
('CyberNova', 'Action RPG', '2025-12-15', 1),
('Quantum Shift', 'Sci-Fi FPS', '2025-11-20', 2),
('Shadow Realm', 'Horror Adventure', '2025-10-31', 3),
('Neural Link', 'Puzzle Strategy', '2025-09-10', 4);

-- Projects
INSERT INTO project (name, gameid, startdate, enddate, status) VALUES
('CyberNova Development', 1, '2025-01-15', '2025-12-15', 'In Progress'),
('Quantum Shift Alpha', 2, '2025-02-01', '2025-11-20', 'In Progress'),
('Shadow Realm Beta', 3, '2025-03-10', '2025-10-31', 'Testing Phase'),
('Neural Link Prototype', 4, '2025-04-01', '2025-09-10', 'Planning');

-- Tasks for HAMZA (Developer - employeeid 2)
INSERT INTO task (description, status, projectid, assignedto, duedate) VALUES
('Implement player combat system', 'In Progress', 1, 2, '2025-11-15'),
('Design inventory UI', 'Completed', 1, 2, '2025-10-20'),
('Optimize rendering pipeline', 'In Progress', 1, 2, '2025-11-30'),
('Create weapon mechanics', 'Pending', 2, 2, '2025-11-25');

-- Tasks for SARA (Developer - employeeid 3)
INSERT INTO task (description, status, projectid, assignedto, duedate) VALUES
('Build AI pathfinding system', 'In Progress', 2, 3, '2025-11-18'),
('Implement multiplayer networking', 'In Progress', 2, 3, '2025-12-01'),
('Design level architecture', 'Completed', 3, 3, '2025-10-15');

-- Tasks for OMAR (Developer - employeeid 5)
INSERT INTO task (description, status, projectid, assignedto, duedate) VALUES
('Create puzzle mechanics', 'In Progress', 4, 5, '2025-08-20'),
('Develop save system', 'Pending', 4, 5, '2025-08-30');

-- Assets for HAMZA (created by employeeid 2)
INSERT INTO asset (name, type, projectid, createdby) VALUES
('Player Character Model', '3D Model', 1, 2),
('Sword Animation Set', 'Animation', 1, 2),
('Combat VFX Pack', 'Visual Effects', 1, 2),
('Weapon Textures', 'Texture', 2, 2);

-- Assets for SARA (created by employeeid 3)
INSERT INTO asset (name, type, projectid, createdby) VALUES
('Enemy AI Controller', 'Script', 2, 3),
('Level Environment Pack', '3D Model', 3, 3),
('Network Manager', 'Script', 2, 3);

-- Assets for OMAR (created by employeeid 5)
INSERT INTO asset (name, type, projectid, createdby) VALUES
('Puzzle Logic System', 'Script', 4, 5),
('UI Icons Collection', '2D Asset', 4, 5);

-- Bug Reports for LINA (Tester - employeeid 4)
INSERT INTO bugreport (description, severity, projectid, reportedby, status) VALUES
('Player falls through floor in Level 3', 'Critical', 1, 4, 'Open'),
('Inventory duplication exploit', 'High', 1, 4, 'In Progress'),
('Audio not playing after death', 'Medium', 1, 4, 'Open'),
('FPS drops in multiplayer mode', 'High', 2, 4, 'Open');

-- Bug Reports for MAYA (Tester - employeeid 6)
INSERT INTO bugreport (description, severity, projectid, reportedby, status) VALUES
('Enemy AI gets stuck on walls', 'Medium', 2, 6, 'In Progress'),
('UI overlaps in main menu', 'Low', 3, 6, 'Open'),
('Save game corruption bug', 'Critical', 4, 6, 'Open');

-- Employee Tools Assignment
INSERT INTO employeetool (employeeid, toolid) VALUES
(2, 1), (2, 3), (2, 5), (2, 6),  -- Hamza: Unity, Blender, Photoshop, VS
(3, 2), (3, 6), (3, 7),          -- Sara: Unreal, VS, Git
(5, 1), (5, 6), (5, 7),          -- Omar: Unity, VS, Git
(4, 1), (4, 2), (4, 7),          -- Lina: Unity, Unreal, Git
(6, 1), (6, 2), (6, 7);          -- Maya: Unity, Unreal, Git

-- Database Users with Password: 123456 (hashed with bcrypt)
-- ALL USER PASSWORD 123456
-- ALL USER PASSWORD 123456
INSERT INTO DBUser (username, password, role, employeeid) VALUES
('admin', '$2b$10$vFoUmirrSWac06.HuFB1x.tiV.VbJyBeb6UmKnmqSkpAxN.oy2dXm', 'admin', 1),
('hamza', '$2b$10$TeZ9enlpw6fPLW3MmWSzeOQrDkRIGJj3FTmu5MYPs1ZlQ9zuhU90C', 'developer', 2),
('sara', '$2b$10$FboB8rn1GWIhfYsbPNYfqO.GfMcVt6Dp4wjq4UQx5VSI5haf5oKoK', 'developer', 3),
('lina', '$2b$10$9YFPVH0mi1.UK8DH6c67n.b8FcGFsd9vZyepMtsxyv0l7JPXv5ON6', 'tester', 4),
('omar', '$2b$10$TeZ9enlpw6fPLW3MmWSzeOQrDkRIGJj3FTmu5MYPs1ZlQ9zuhU90C', 'developer', 5),
('maya', '$2b$10$9YFPVH0mi1.UK8DH6c67n.b8FcGFsd9vZyepMtsxyv0l7JPXv5ON6', 'tester', 6);

-- Admin
CREATE USER admin WITH PASSWORD '123456';

-- Developers
CREATE USER hamza WITH PASSWORD '123456';

CREATE USER sara WITH PASSWORD '123456';

CREATE USER omar WITH PASSWORD '123456';

-- Testers
CREATE USER lina WITH PASSWORD '123456';

CREATE USER maya WITH PASSWORD '123456';


-- Add more tasks for all developers
INSERT INTO task (description, status, projectid, assignedto, duedate) VALUES
('Create main menu UI', 'In Progress', 1, 2, '2025-11-10'),
('Implement save/load system', 'Pending', 1, 2, '2025-11-22'),
('Design character customization', 'In Progress', 2, 3, '2025-11-12'),
('Build tutorial level', 'Completed', 2, 3, '2025-10-05'),
('Optimize game performance', 'In Progress', 3, 5, '2025-10-28'),
('Create sound effects', 'Pending', 4, 5, '2025-09-05');

-- Add more assets for all developers  
INSERT INTO asset (name, type, projectid, createdby) VALUES
('UI Button Pack', '2D Asset', 1, 2),
('Character Animations', 'Animation', 1, 2),
('Level Blueprint', 'Blueprint', 2, 3),
('Particle Effects', 'VFX', 2, 3),
('Game Logic Scripts', 'Script', 3, 5),
('Audio Manager', 'Script', 4, 5);

-- Add more bug reports for all testers
INSERT INTO bugreport (description, severity, projectid, reportedby, status) VALUES
('Camera clips through walls', 'Medium', 1, 4, 'Open'),
('Game crashes on boss fight', 'Critical', 1, 4, 'In Progress'),
('Lighting glitch in cave area', 'Low', 3, 6, 'Open'),
('Collision detection issues', 'High', 3, 6, 'In Progress'),
('Menu buttons not responsive', 'Medium', 4, 6, 'Open');

-- ===========================
-- TRIGGERS(i tried to use this bcuz postgre doesnt have Profile like in oracle
-- to provide maximum login attempt 3 attempt as provided in tp2)
-- ===========================
CREATE OR REPLACE FUNCTION enforce_max_login()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.loginattempts >= NEW.maxloginattempts THEN
        NEW.isactive := FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_max_login
BEFORE UPDATE OF loginattempts ON DBUser
FOR EACH ROW
EXECUTE FUNCTION enforce_max_login();

-- ===========================
-- IMPROVED VIEWS - USER-SPECIFIC
-- ===========================

-- Admin: Complete Project Overview
CREATE OR REPLACE VIEW admin_projectoverview AS
SELECT
    p.projectid,
    p.name AS projectname,
    g.title AS gametitle,
    p.status,
    TO_CHAR(p.startdate, 'YYYY-MM-DD') AS startdate,
    TO_CHAR(p.enddate, 'YYYY-MM-DD') AS enddate,
    c.name AS clientname,
    COUNT(DISTINCT t.taskid) AS totaltasks,
    COUNT(DISTINCT b.bugid) AS totalbugs,
    COUNT(DISTINCT a.assetid) AS totalassets
FROM project p
JOIN game g ON p.gameid = g.gameid
JOIN client c ON g.clientid = c.clientid
LEFT JOIN task t ON p.projectid = t.projectid
LEFT JOIN bugreport b ON p.projectid = b.projectid
LEFT JOIN asset a ON p.projectid = a.projectid
GROUP BY p.projectid, g.title, c.name, p.name, p.status, p.startdate, p.enddate
ORDER BY p.projectid;

-- Developer: My Tasks (filtered by username)
CREATE OR REPLACE VIEW developer_mytasks AS
SELECT
    u.username,
    t.taskid,
    t.description,
    t.status,
    TO_CHAR(t.duedate, 'YYYY-MM-DD') AS duedate,
    p.name AS projectname,
    g.title AS gametitle
FROM task t
JOIN employee e ON t.assignedto = e.employeeid
JOIN DBUser u ON e.employeeid = u.employeeid
JOIN project p ON t.projectid = p.projectid
JOIN game g ON p.gameid = g.gameid
WHERE e.role ILIKE '%developer%'
ORDER BY t.duedate;

-- Developer: My Assets (filtered by username)
CREATE OR REPLACE VIEW developer_assets AS
SELECT
    u.username,
    a.assetid,
    a.name AS assetname,
    a.type AS assettype,
    p.name AS projectname
FROM asset a
JOIN employee e ON a.createdby = e.employeeid
JOIN DBUser u ON e.employeeid = u.employeeid
JOIN project p ON a.projectid = p.projectid
WHERE e.role ILIKE '%developer%'
ORDER BY a.assetid;


-- Tester: My Bug Reports (filtered by username)
CREATE OR REPLACE VIEW tester_bugreports AS
SELECT
    u.username,
    b.bugid,
    b.description,
    b.severity,
    b.status,
    p.name AS projectname,
    g.title AS gametitle
FROM bugreport b
JOIN employee e ON b.reportedby = e.employeeid
JOIN DBUser u ON e.employeeid = u.employeeid
JOIN project p ON b.projectid = p.projectid
JOIN game g ON p.gameid = g.gameid
WHERE e.role ILIKE '%tester%'
ORDER BY 
    CASE b.severity 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
    END,
    b.bugid;

-- ===========================
-- GRANTS
-- ===========================
GRANT SELECT ON admin_projectoverview TO admin;
GRANT SELECT ON developer_mytasks TO developer;
GRANT SELECT ON developer_assets TO developer;
GRANT SELECT ON tester_bugreports TO tester;

GRANT SELECT ON employee, project, task, bugreport, asset, game, client, tool TO admin, developer, tester;

-- ===========================
-- TEST QUERIES
-- ===========================

-- Test Admin View
SELECT * FROM admin_projectoverview;

-- Test Developer Views (for specific user)
SELECT * FROM developer_mytasks WHERE username = 'hamza';
SELECT * FROM developer_assets WHERE username = 'hamza';

SELECT * FROM developer_mytasks WHERE username = 'sara';
SELECT * FROM developer_assets WHERE username = 'sara';

-- Test Tester Views (for specific user)
SELECT * FROM tester_bugreports WHERE username = 'lina';
SELECT * FROM tester_bugreports WHERE username = 'maya';

-- ===========================
-- SUMMARY INFO (to see user and their role)
-- ===========================
SELECT 'Database Setup Complete!' AS status;
SELECT 'Login Credentials (All passwords: 123456)' AS info;
SELECT 
    username,
    role,
    CASE 
        WHEN role = 'admin' THEN 'View all project stats'
        WHEN role = 'developer' THEN 'View your tasks & assets'
        WHEN role = 'tester' THEN 'View your bug reports'
    END as access_level
FROM DBUser
ORDER BY role, username;

-- ===========================
-- TEST QUERIES - RUN THESE TO CHECK
-- ===========================

-- Test: Check if hamza has tasks
SELECT 'Testing hamza tasks:' AS test;
SELECT * FROM developer_mytasks WHERE username = 'hamza';

-- Test: Check if hamza has assets
SELECT 'Testing hamza assets:' AS test;
SELECT * FROM developer_assets WHERE username = 'hamza';

-- Test: Check if sara has tasks
SELECT 'Testing sara tasks:' AS test;
SELECT * FROM developer_mytasks WHERE username = 'sara';

-- Test: Check if sara has assets
SELECT 'Testing sara assets:' AS test;
SELECT * FROM developer_assets WHERE username = 'sara';

-- Test: Check if lina has bug reports
SELECT 'Testing lina bugs:' AS test;
SELECT * FROM tester_bugreports WHERE username = 'lina';

-- Test: Check if maya has bug reports
SELECT 'Testing maya bugs:' AS test;
SELECT * FROM tester_bugreports WHERE username = 'maya';

-- Test: Check admin overview
SELECT 'Testing admin overview:' AS test;
SELECT * FROM admin_projectoverview;

-- ===========================
-- VERIFY ALL DATA
-- ===========================
SELECT 
    'VERIFICATION COMPLETE' AS status,
    (SELECT COUNT(*) FROM developer_mytasks) AS total_dev_tasks,
    (SELECT COUNT(*) FROM developer_assets) AS total_dev_assets,
    (SELECT COUNT(*) FROM tester_bugreports) AS total_tester_bugs,
    (SELECT COUNT(*) FROM admin_projectoverview) AS total_projects;


--putting index on most used foreign keys 
CREATE INDEX idx_task_assignedto ON task(assignedto);
CREATE INDEX idx_task_projectid ON task(projectid);

CREATE INDEX idx_asset_projectid ON asset(projectid);
CREATE INDEX idx_asset_createdby ON asset(createdby);

CREATE INDEX idx_bug_projectid ON bugreport(projectid);
CREATE INDEX idx_bug_reportedby ON bugreport(reportedby);

--testing the index 
EXPLAIN SELECT * FROM task WHERE assignedto = 2;





CREATE TABLE error_log (
    logid SERIAL PRIMARY KEY,
    procedure_name VARCHAR(100) NOT NULL,
    err_message TEXT NOT NULL,
    old_employee INT,
    new_employee INT,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--procedure
CREATE OR REPLACE PROCEDURE reassign_tasks_safe(
    p_old_employee INT,
    p_new_employee INT,
    OUT p_tasks_updated INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    cur_tasks CURSOR FOR
        SELECT taskid
        FROM task
        WHERE assignedto = p_old_employee
          AND status IN ('Pending', 'In Progress')
        FOR UPDATE;

    v_taskid task.taskid%TYPE;
BEGIN
    -- Prevent assigning to same employee
    IF p_old_employee = p_new_employee THEN
        RAISE EXCEPTION 'Old and new employee IDs cannot be the same';
    END IF;

    p_tasks_updated := 0;

    OPEN cur_tasks;

    LOOP
        FETCH cur_tasks INTO v_taskid;
        EXIT WHEN NOT FOUND;

        UPDATE task
        SET assignedto = p_new_employee
        WHERE CURRENT OF cur_tasks;

        p_tasks_updated := p_tasks_updated + 1;
    END LOOP;

    CLOSE cur_tasks;

    IF p_tasks_updated = 0 THEN
        RAISE NO_DATA_FOUND;
    END IF;

    RAISE NOTICE
        'Reassigned % tasks from employee % to %',
        p_tasks_updated, p_old_employee, p_new_employee;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        INSERT INTO error_log(procedure_name, err_message, old_employee, new_employee)
        VALUES (
            'reassign_tasks_safe',
            'No pending or in-progress tasks found for old employee',
            p_old_employee,
            p_new_employee
        );
        RAISE NOTICE
            'Notice: No tasks found to reassign from employee %',
            p_old_employee;

    WHEN TOO_MANY_ROWS THEN
        INSERT INTO error_log(procedure_name, err_message, old_employee, new_employee)
        VALUES (
            'reassign_tasks_safe',
            'Too many rows affected unexpectedly',
            p_old_employee,
            p_new_employee
        );
        RAISE NOTICE
            'Error: Too many rows affected unexpectedly';

    WHEN unique_violation THEN
        INSERT INTO error_log(procedure_name, err_message, old_employee, new_employee)
        VALUES (
            'reassign_tasks_safe',
            'Duplicate key violation',
            p_old_employee,
            p_new_employee
        );
        RAISE NOTICE
            'Error: Duplicate key violation';

    WHEN OTHERS THEN
        INSERT INTO error_log(procedure_name, err_message, old_employee, new_employee)
        VALUES (
            'reassign_tasks_safe',
            SQLERRM,
            p_old_employee,
            p_new_employee
        );
        RAISE NOTICE
            'Error: %',
            SQLERRM;
END;
$$;


--now testing all exceptions for this procedure
DO $$
DECLARE
    v_tasks_updated INT;
BEGIN
    RAISE NOTICE '==== TEST 1: Normal reassignment (Hamza → Omar) ====';
    BEGIN
        CALL reassign_tasks_safe(2, 5, v_tasks_updated);
        RAISE NOTICE 'Tasks updated: %', v_tasks_updated;
    EXCEPTION
        WHEN TOO_MANY_ROWS THEN RAISE NOTICE 'Error: TOO_MANY_ROWS triggered in Test 1';
        WHEN NO_DATA_FOUND THEN RAISE NOTICE 'Error: NO_DATA_FOUND triggered in Test 1';
        WHEN unique_violation THEN  RAISE NOTICE 'Error: UNIQUE VIOLATION triggered in Test 1';
        WHEN OTHERS THEN  -- user-defined exception  RAISE NOTICE 'Error: User-defined exception triggered in Test 1: %', SQLERRM;
    END;
    RAISE NOTICE '==== TEST 2: No tasks found (NO_DATA_FOUND) ====';

    BEGIN
        CALL reassign_tasks_safe(99, 5, v_tasks_updated);
        RAISE NOTICE 'Tasks updated: %', v_tasks_updated;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE NOTICE 'Expected NO_DATA_FOUND in Test 2';
    END;

    RAISE NOTICE '==== TEST 3: Same employee (User-defined exception) ====';

    BEGIN
        CALL reassign_tasks_safe(5, 5, v_tasks_updated);
        RAISE NOTICE 'Tasks updated: %', v_tasks_updated;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Expected user-defined exception in Test 3: %', SQLERRM;
    END;

    RAISE NOTICE '==== TEST 4: Force UNIQUE VIOLATION ====';

    BEGIN
        -- Temporary table for safe testing
        CREATE TEMP TABLE temp_task_for_unique AS TABLE task;

        -- Add a temporary unique constraint for demonstration
        BEGIN
            ALTER TABLE temp_task_for_unique ADD CONSTRAINT tmp_unique_task UNIQUE (assignedto, taskid);
        EXCEPTION
            WHEN duplicate_object THEN NULL; -- ignore if exists
        END;

        -- Insert dummy task
        INSERT INTO temp_task_for_unique(taskid, description, status, projectid, assignedto, duedate)
        VALUES (9999, 'Dummy Task', 'Pending', 1, 5, '2025-12-31');

        -- Attempt to insert duplicate to trigger unique_violation
        BEGIN
            INSERT INTO temp_task_for_unique(taskid, description, status, projectid, assignedto, duedate)
            VALUES (9999, 'Dummy Task Duplicate', 'Pending', 1, 5, '2025-12-31');
        EXCEPTION
            WHEN unique_violation THEN
                RAISE NOTICE 'Caught UNIQUE VIOLATION in Test 4';
        END;

        DROP TABLE temp_task_for_unique;
    END;

    RAISE NOTICE '==== ALL TESTS COMPLETED ====';

END;
$$;


