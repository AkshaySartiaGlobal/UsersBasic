/**Function to create query builder for insert */
import { DataTypes } from "sequelize";
export const createQueryBuilder = (model, requestBody) => {
  if (!model) {
    throw new Error("Model is undefined or null.");
  }
  requestBody = JSON.parse(JSON.stringify(requestBody));
  const columns = Object.keys(model.rawAttributes);
  const filteredColumns = columns.filter((column) => {
    return (
      requestBody.hasOwnProperty(column) &&
      requestBody[column] !== undefined &&
      requestBody[column] !== null &&
      requestBody[column] !== "" && // Exclude empty strings
      !(
        model.rawAttributes[column].allowNull === false && !requestBody[column]
      ) && // Check if required field is missing
      !model.rawAttributes[column].primaryKey &&
      !model.rawAttributes[column].autoIncrement
    );
  });
  const placeholders = Array.from(
    { length: filteredColumns.length },
    () => `?`
  ).join(", ");
  const columnNames = filteredColumns.join(", ");
  const query = `INSERT INTO ${model.tableName}(${columnNames}) VALUES (${placeholders})`;
  const values = filteredColumns.map((column) => {
    const attributeType = model.rawAttributes[column].type;
    if (
      (attributeType instanceof DataTypes.JSON ||
        attributeType instanceof DataTypes.TEXT) &&
      (typeof requestBody[column] === "object" ||
        Array.isArray(requestBody[column]))
    ) {
      return JSON.stringify(requestBody[column]);
    }
    return requestBody[column];
  });
  return {
    query: query,
    values: values,
  };
};

/**Function to make query builder for update*/
export const updateQueryBuilder = (model, requestBody, customWhere = null) => {
  if (!model) {
    throw new Error("Model is undefined or null.");
  }
  requestBody = JSON.parse(JSON.stringify(requestBody));
  const columns = Object.keys(model.rawAttributes);
  // Identify primary keys and auto increment keys
  const primaryKeyColumns = columns.filter(
    (column) =>
      model.rawAttributes[column].primaryKey ||
      model.rawAttributes[column].autoIncrement
  );
  // Filter columns to update, excluding primary keys, auto increment keys, and the 'created_by' column
  const filteredColumns = columns.filter((column) => {
    return (
      column !== "created_by" && // Exclude the 'created_by' column
      requestBody.hasOwnProperty(column) &&
      requestBody[column] !== undefined &&
      requestBody[column] !== null &&
      requestBody[column] !== "" &&
      !model.rawAttributes[column].primaryKey &&
      !model.rawAttributes[column].autoIncrement
    );
  });
  // Generate SET part of the update query
  const setStatements = filteredColumns
    .map((column) => `${column} = ?`)
    .join(", ");
  // Determine columns for the WHERE part of the update query
  const whereColumns =
    customWhere && Object.keys(customWhere).length > 0
      ? Object.keys(customWhere)
      : primaryKeyColumns;
  const whereClauses = whereColumns
    .filter((column) => requestBody.hasOwnProperty(column))
    .map((column) => `${column} = ?`);
  if (whereClauses.length === 0) {
    throw new Error("No columns provided for the WHERE clause.");
  }
  const whereClause = whereClauses.join(" AND ");
  const query = `UPDATE ${model.tableName} SET ${setStatements} WHERE ${whereClause}`;
  const values = filteredColumns.map((column) => {
    const attributeType = model.rawAttributes[column].type;
    if (
      (attributeType instanceof DataTypes.JSON ||
        attributeType instanceof DataTypes.TEXT) &&
      (typeof requestBody[column] === "object" ||
        Array.isArray(requestBody[column]))
    ) {
      return JSON.stringify(requestBody[column]);
    }
    return requestBody[column];
  });
  // Append WHERE clause values to the values array
  if (customWhere) {
    whereColumns.forEach((column) => {
      //   if (customWhere.hasOwnProperty(column)) {
      values.push(customWhere[column]);
      //   }
    });
  } else {
    primaryKeyColumns.forEach((column) => {
      if (requestBody.hasOwnProperty(column)) {
        values.push(requestBody[column]);
      }
    });
  }
  return {
    query: query,
    values: values,
  };
};