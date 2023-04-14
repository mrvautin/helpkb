"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/menu";
exports.ids = ["pages/api/menu"];
exports.modules = {

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

module.exports = import("sequelize");;

/***/ }),

/***/ "(api)/./lib/db.js":
/*!*******************!*\
  !*** ./lib/db.js ***!
  \*******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"db\": () => (/* binding */ db),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sequelize */ \"sequelize\");\n/* harmony import */ var _lib_dbConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/dbConfig */ \"(api)/./lib/dbConfig.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([sequelize__WEBPACK_IMPORTED_MODULE_0__]);\nsequelize__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/* eslint-disable import/no-anonymous-default-export */ \n\nfunction db() {\n    return new sequelize__WEBPACK_IMPORTED_MODULE_0__.Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, _lib_dbConfig__WEBPACK_IMPORTED_MODULE_1__.dbConfig);\n}\n;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    db\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvZGIuanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFEQUFxRCxHQUNmO0FBQ0s7QUFFcEMsU0FBU0UsS0FBSztJQUNqQixPQUFPLElBQUlGLGdEQUFTQSxDQUNoQkcsUUFBUUMsR0FBRyxDQUFDQyxPQUFPLEVBQ25CRixRQUFRQyxHQUFHLENBQUNFLFdBQVcsRUFDdkJILFFBQVFDLEdBQUcsQ0FBQ0csV0FBVyxFQUN2Qk4sbURBQVFBO0FBRWhCLENBQUM7O0FBRUQsaUVBQWU7SUFDWEM7QUFDSixDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxwa2IvLi9saWIvZGIuanM/M2RjOSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tYW5vbnltb3VzLWRlZmF1bHQtZXhwb3J0ICovXG5pbXBvcnQgeyBTZXF1ZWxpemUgfSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IHsgZGJDb25maWcgfSBmcm9tICcuLi9saWIvZGJDb25maWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGIoKSB7XG4gICAgcmV0dXJuIG5ldyBTZXF1ZWxpemUoXG4gICAgICAgIHByb2Nlc3MuZW52LkRCX05BTUUsXG4gICAgICAgIHByb2Nlc3MuZW52LkRCX1VTRVJOQU1FLFxuICAgICAgICBwcm9jZXNzLmVudi5EQl9QQVNTV09SRCxcbiAgICAgICAgZGJDb25maWdcbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGRiLFxufTsiXSwibmFtZXMiOlsiU2VxdWVsaXplIiwiZGJDb25maWciLCJkYiIsInByb2Nlc3MiLCJlbnYiLCJEQl9OQU1FIiwiREJfVVNFUk5BTUUiLCJEQl9QQVNTV09SRCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./lib/db.js\n");

/***/ }),

/***/ "(api)/./lib/dbConfig.js":
/*!*************************!*\
  !*** ./lib/dbConfig.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"dbConfig\": () => (/* binding */ dbConfig)\n/* harmony export */ });\nconst dbConfig = {\n    host: process.env.DB_HOST,\n    port: parseInt(process.env.DB_PORT),\n    dialect: \"postgres\",\n    logging: process.env.DB_LOGGING === \"true\",\n    pool: {\n        maxConnections: 5,\n        maxIdleTime: 30\n    },\n    language: \"en\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvZGJDb25maWcuanMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPLE1BQU1BLFdBQVc7SUFDcEJDLE1BQU1DLFFBQVFDLEdBQUcsQ0FBQ0MsT0FBTztJQUN6QkMsTUFBTUMsU0FBU0osUUFBUUMsR0FBRyxDQUFDSSxPQUFPO0lBQ2xDQyxTQUFTO0lBQ1RDLFNBQVVQLFFBQVFDLEdBQUcsQ0FBQ08sVUFBVSxLQUFLO0lBQ3JDQyxNQUFNO1FBQUVDLGdCQUFnQjtRQUFHQyxhQUFhO0lBQUc7SUFDM0NDLFVBQVU7QUFDZCxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGVscGtiLy4vbGliL2RiQ29uZmlnLmpzPzM2MjAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGRiQ29uZmlnID0ge1xuICAgIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QsXG4gICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuREJfUE9SVCksXG4gICAgZGlhbGVjdDogJ3Bvc3RncmVzJyxcbiAgICBsb2dnaW5nOiAocHJvY2Vzcy5lbnYuREJfTE9HR0lORyA9PT0gJ3RydWUnKSxcbiAgICBwb29sOiB7IG1heENvbm5lY3Rpb25zOiA1LCBtYXhJZGxlVGltZTogMzAgfSxcbiAgICBsYW5ndWFnZTogJ2VuJ1xufSJdLCJuYW1lcyI6WyJkYkNvbmZpZyIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiREJfSE9TVCIsInBvcnQiLCJwYXJzZUludCIsIkRCX1BPUlQiLCJkaWFsZWN0IiwibG9nZ2luZyIsIkRCX0xPR0dJTkciLCJwb29sIiwibWF4Q29ubmVjdGlvbnMiLCJtYXhJZGxlVGltZSIsImxhbmd1YWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./lib/dbConfig.js\n");

/***/ }),

/***/ "(api)/./lib/models/menus.js":
/*!*****************************!*\
  !*** ./lib/models/menus.js ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MenuModel\": () => (/* binding */ MenuModel),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sequelize */ \"sequelize\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../db */ \"(api)/./lib/db.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([sequelize__WEBPACK_IMPORTED_MODULE_0__, _db__WEBPACK_IMPORTED_MODULE_1__]);\n([sequelize__WEBPACK_IMPORTED_MODULE_0__, _db__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n/* eslint-disable import/no-anonymous-default-export */ \n\nconst sequelize = (0,_db__WEBPACK_IMPORTED_MODULE_1__.db)();\nconst MenuModel = sequelize.define(\"menus\", {\n    id: {\n        type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,\n        allowNull: false,\n        primaryKey: true\n    },\n    name: {\n        type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,\n        allowNull: false\n    },\n    url: {\n        type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,\n        allowNull: false\n    },\n    order: {\n        type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,\n        allowNull: false\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    MenuModel\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9saWIvbW9kZWxzL21lbnVzLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxREFBcUQsR0FDZjtBQUVYO0FBRTNCLE1BQU1FLFlBQVlELHVDQUFFQTtBQUViLE1BQU1FLFlBQVlELFVBQVVFLE1BQU0sQ0FDckMsU0FBUztJQUNMQyxJQUFJO1FBQ0FDLE1BQU1OLHVEQUFnQjtRQUN0QlEsV0FBVyxLQUFLO1FBQ2hCQyxZQUFZLElBQUk7SUFDcEI7SUFDQUMsTUFBTTtRQUNGSixNQUFNTix1REFBZ0I7UUFDdEJRLFdBQVcsS0FBSztJQUNwQjtJQUNBRyxLQUFLO1FBQ0RMLE1BQU1OLHVEQUFnQjtRQUN0QlEsV0FBVyxLQUFLO0lBQ3BCO0lBQ0FJLE9BQU87UUFDSE4sTUFBTU4sd0RBQWlCO1FBQ3ZCUSxXQUFXLEtBQUs7SUFDcEI7QUFDSixHQUNGO0FBRUYsaUVBQWU7SUFDWEw7QUFDSixDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxwa2IvLi9saWIvbW9kZWxzL21lbnVzLmpzP2NkOTQiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWFub255bW91cy1kZWZhdWx0LWV4cG9ydCAqL1xuaW1wb3J0IHsgRGF0YVR5cGVzIH0gZnJvbSAnc2VxdWVsaXplJztcblxuaW1wb3J0IHsgZGIgfSBmcm9tICcuLi9kYic7XG5cbmNvbnN0IHNlcXVlbGl6ZSA9IGRiKCk7XG5cbmV4cG9ydCBjb25zdCBNZW51TW9kZWwgPSBzZXF1ZWxpemUuZGVmaW5lKFxuICAgIFwibWVudXNcIiwge1xuICAgICAgICBpZDoge1xuICAgICAgICAgICAgdHlwZTogRGF0YVR5cGVzLlNUUklORyxcbiAgICAgICAgICAgIGFsbG93TnVsbDogZmFsc2UsXG4gICAgICAgICAgICBwcmltYXJ5S2V5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5TVFJJTkcsXG4gICAgICAgICAgICBhbGxvd051bGw6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHVybDoge1xuICAgICAgICAgICAgdHlwZTogRGF0YVR5cGVzLlNUUklORyxcbiAgICAgICAgICAgIGFsbG93TnVsbDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgb3JkZXI6IHtcbiAgICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxuICAgICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIE1lbnVNb2RlbCxcbn07Il0sIm5hbWVzIjpbIkRhdGFUeXBlcyIsImRiIiwic2VxdWVsaXplIiwiTWVudU1vZGVsIiwiZGVmaW5lIiwiaWQiLCJ0eXBlIiwiU1RSSU5HIiwiYWxsb3dOdWxsIiwicHJpbWFyeUtleSIsIm5hbWUiLCJ1cmwiLCJvcmRlciIsIklOVEVHRVIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./lib/models/menus.js\n");

/***/ }),

/***/ "(api)/./pages/api/menu/index.js":
/*!*********************************!*\
  !*** ./pages/api/menu/index.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_models_menus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/models/menus */ \"(api)/./lib/models/menus.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_models_menus__WEBPACK_IMPORTED_MODULE_0__]);\n_lib_models_menus__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// DB models\n\nasync function handler(req, res) {\n    // Get the menu from the db\n    const menu = await _lib_models_menus__WEBPACK_IMPORTED_MODULE_0__.MenuModel.findAll({\n        order: [\n            [\n                \"order\",\n                \"ASC\"\n            ]\n        ],\n        raw: true\n    });\n    if (!menu) {\n        return res.status(404).json({\n            error: \"404 - Not found\"\n        });\n    }\n    // Return menu\n    res.json(menu);\n}\n;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvbWVudS9pbmRleC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFlBQVk7QUFDMEM7QUFFdkMsZUFBZUMsUUFBUUMsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDNUMsMkJBQTJCO0lBQzNCLE1BQU1DLE9BQU8sTUFBTUosZ0VBQWlCLENBQUM7UUFDakNNLE9BQU87WUFDSDtnQkFBRTtnQkFBUzthQUFPO1NBQ3JCO1FBQ0RDLEtBQUssSUFBSTtJQUNiO0lBRUEsSUFBRyxDQUFDSCxNQUFLO1FBQ0wsT0FBT0QsSUFBSUssTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUN4QkMsT0FBTztRQUNYO0lBQ0osQ0FBQztJQUVELGNBQWM7SUFDZFAsSUFBSU0sSUFBSSxDQUFDTDtBQUNiLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxwa2IvLi9wYWdlcy9hcGkvbWVudS9pbmRleC5qcz8xZmY5Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIERCIG1vZGVsc1xuaW1wb3J0IHsgTWVudU1vZGVsIH0gZnJvbSAnLi4vLi4vLi4vbGliL21vZGVscy9tZW51cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAvLyBHZXQgdGhlIG1lbnUgZnJvbSB0aGUgZGJcbiAgICBjb25zdCBtZW51ID0gYXdhaXQgTWVudU1vZGVsLmZpbmRBbGwoe1xuICAgICAgICBvcmRlcjogW1xuICAgICAgICAgICAgWyAnb3JkZXInLCAnQVNDJyBdXG4gICAgICAgIF0sXG4gICAgICAgIHJhdzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYoIW1lbnUpe1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oe1xuICAgICAgICAgICAgZXJyb3I6ICc0MDQgLSBOb3QgZm91bmQnXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBtZW51XG4gICAgcmVzLmpzb24obWVudSk7XG59O1xuIl0sIm5hbWVzIjpbIk1lbnVNb2RlbCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZW51IiwiZmluZEFsbCIsIm9yZGVyIiwicmF3Iiwic3RhdHVzIiwianNvbiIsImVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/menu/index.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/menu/index.js"));
module.exports = __webpack_exports__;

})();