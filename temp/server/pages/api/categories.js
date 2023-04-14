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
exports.id = "pages/api/categories";
exports.ids = ["pages/api/categories"];
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

/***/ "(api)/./pages/api/categories/index.js":
/*!***************************************!*\
  !*** ./pages/api/categories/index.js ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/db */ \"(api)/./lib/db.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_db__WEBPACK_IMPORTED_MODULE_0__]);\n_lib_db__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nasync function handler(req, res) {\n    // Get the categories from the db\n    const [categories] = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_0__.db)().query(`SELECT count(articles.id) as count, categories.name, categories.url, categories.id, categories.order\n        FROM categories\n        LEFT JOIN articles \n        ON categories.name = articles.category \n        GROUP BY categories.name, categories.id, categories.order, categories.url\n        ORDER BY categories.order`);\n    if (!categories) {\n        return res.status(404).json({\n            error: \"404 - Not found\"\n        });\n    }\n    // Return categories\n    res.json(categories);\n}\n;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvY2F0ZWdvcmllcy9pbmRleC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFxQztBQUV0QixlQUFlQyxRQUFRQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM1QyxpQ0FBaUM7SUFDakMsTUFBTSxDQUFDQyxXQUFXLEdBQUcsTUFBTUosMkNBQUVBLEdBQUdLLEtBQUssQ0FDakMsQ0FBQzs7Ozs7aUNBS3dCLENBQUM7SUFHOUIsSUFBRyxDQUFDRCxZQUFXO1FBQ1gsT0FBT0QsSUFBSUcsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUN4QkMsT0FBTztRQUNYO0lBQ0osQ0FBQztJQUVELG9CQUFvQjtJQUNwQkwsSUFBSUksSUFBSSxDQUFDSDtBQUNiLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxwa2IvLi9wYWdlcy9hcGkvY2F0ZWdvcmllcy9pbmRleC5qcz8yN2M1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRiIH0gZnJvbSAnLi4vLi4vLi4vbGliL2RiJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICAgIC8vIEdldCB0aGUgY2F0ZWdvcmllcyBmcm9tIHRoZSBkYlxuICAgIGNvbnN0IFtjYXRlZ29yaWVzXSA9IGF3YWl0IGRiKCkucXVlcnkoXG4gICAgICAgIGBTRUxFQ1QgY291bnQoYXJ0aWNsZXMuaWQpIGFzIGNvdW50LCBjYXRlZ29yaWVzLm5hbWUsIGNhdGVnb3JpZXMudXJsLCBjYXRlZ29yaWVzLmlkLCBjYXRlZ29yaWVzLm9yZGVyXG4gICAgICAgIEZST00gY2F0ZWdvcmllc1xuICAgICAgICBMRUZUIEpPSU4gYXJ0aWNsZXMgXG4gICAgICAgIE9OIGNhdGVnb3JpZXMubmFtZSA9IGFydGljbGVzLmNhdGVnb3J5IFxuICAgICAgICBHUk9VUCBCWSBjYXRlZ29yaWVzLm5hbWUsIGNhdGVnb3JpZXMuaWQsIGNhdGVnb3JpZXMub3JkZXIsIGNhdGVnb3JpZXMudXJsXG4gICAgICAgIE9SREVSIEJZIGNhdGVnb3JpZXMub3JkZXJgXG4gICAgKTtcblxuICAgIGlmKCFjYXRlZ29yaWVzKXtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHtcbiAgICAgICAgICAgIGVycm9yOiAnNDA0IC0gTm90IGZvdW5kJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gY2F0ZWdvcmllc1xuICAgIHJlcy5qc29uKGNhdGVnb3JpZXMpO1xufTtcbiJdLCJuYW1lcyI6WyJkYiIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJjYXRlZ29yaWVzIiwicXVlcnkiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/categories/index.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/categories/index.js"));
module.exports = __webpack_exports__;

})();