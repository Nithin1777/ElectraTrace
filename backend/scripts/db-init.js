require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");

async function run() {
  const baseConfig = {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    multipleStatements: true,
  };

  const safeConfig = {
    ...baseConfig,
    password: baseConfig.password ? "***set***" : "***empty***",
  };

  console.log("Initializing database with config:", safeConfig);

  const schemaPath = path.join(__dirname, "..", "schema.sql");
  const seedPath = path.join(__dirname, "..", "seed.sql");

  const [schemaSql, seedSql] = await Promise.all([
    fs.readFile(schemaPath, "utf8"),
    fs.readFile(seedPath, "utf8"),
  ]);

  let connection;
  try {
    connection = await mysql.createConnection(baseConfig);
    await connection.query(schemaSql);
    console.log("✅ schema.sql applied");

    await connection.query(seedSql);
    console.log("✅ seed.sql applied");

    const dbName = process.env.DB_NAME ?? "ElectraTrace";
    const [tables] = await connection.query(
      "SELECT COUNT(*) AS total FROM information_schema.tables WHERE table_schema = ?",
      [dbName],
    );
    console.log(
      `✅ Database initialized. Table count in ${dbName}:`,
      tables[0].total,
    );
  } catch (error) {
    console.error("❌ DB init failed");
    console.error("Error code:", error.code || "UNKNOWN");
    console.error("Message:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

run();
