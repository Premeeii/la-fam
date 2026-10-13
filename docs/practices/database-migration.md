# Database Structure

LaFam's Database schema defined by flyway migrate file in migration folder. Its include migration script from version 1 to current version. used docker container to be able to access postgresql db.

# Why might I need a migration?

Database migrations transform the state of La FAM database when we need to add, remove, or modify columns, tables, or other database objects. When we need to change the database schema, we need to create a migration script to update the database schema.

# How to write migration file

## Initial Migration

Migrations should be carefully planned and written as one of the first steps of any new feature or database change. They provide a clear, version-controlled record of schema evolution and enable consistent database state across environments.

### Migration Versioning

Flyway uses a versioned migration system. Each migration file has a version number and a description. The version number is a four-digit number (e.g., V1, V2, V3) and the description is a human-readable name for the migration. and can't change older version file name or detail, because flyway will track version that already applied to the database.

### When Flyway migration execute?

Flyway migration only work when the application start, it will check the database schema version and compare it with the migration files in the migration folder. If the database schema version is lower than the migration files, it will apply the migration files to the database.
