/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["DEFAULT"] = 0] = "DEFAULT";
    SortOrder[SortOrder["ASCENDING"] = 1] = "ASCENDING";
    SortOrder[SortOrder["DESCENDING"] = 2] = "DESCENDING";
})(SortOrder || (SortOrder = {}));
var AttributeName;
(function (AttributeName) {
    AttributeName["tableHeader"] = "sortable-style";
    AttributeName["cssAscending"] = "sortable-asc";
    AttributeName["cssDescending"] = "sortable-desc";
})(AttributeName || (AttributeName = {}));
class TableState {
    constructor() {
        this.columnIdx = null;
        this.sortOrder = SortOrder.DEFAULT;
        this.defaultOrdering = null;
    }
}
function shouldSort(htmlEl) {
    // dataview table: parent must be a "dataview" HTMLTableElement
    const p = htmlEl.matchParent(".dataview");
    if (p instanceof HTMLTableElement)
        return true;
    // reading mode, i.e. non-editing
    return null !== htmlEl.matchParent(".markdown-reading-view");
}
function onHeadClick(evt, tableStates) {
    // check if the clicked element is a table header
    const htmlEl = evt.target;
    if (!shouldSort(htmlEl)) {
        return;
    }
    const th = htmlEl.closest("thead th");
    if (th === null) {
        return;
    }
    const table = htmlEl.closest("table");
    const tableBody = table.querySelector("tbody");
    const thArray = Array.from(th.parentNode.children);
    const thIdx = thArray.indexOf(th);
    // create a new table state if does not previously exist
    if (!tableStates.has(table)) {
        tableStates.set(table, new TableState());
    }
    const tableState = tableStates.get(table);
    thArray.forEach((th, i) => {
        if (i !== thIdx) {
            th.removeAttribute(AttributeName.tableHeader);
        }
    });
    if (tableState.defaultOrdering === null) {
        tableState.defaultOrdering = Array.from(tableBody.rows);
    }
    // sorting the same column, again
    if (tableState.columnIdx === thIdx) {
        tableState.sortOrder = (tableState.sortOrder + 1) % 3;
    }
    // sorting a new column
    else {
        tableState.columnIdx = thIdx;
        tableState.sortOrder = SortOrder.ASCENDING;
    }
    sortTable(tableState, tableBody);
    switch (tableState.sortOrder) {
        case SortOrder.ASCENDING:
            th.setAttribute(AttributeName.tableHeader, AttributeName.cssAscending);
            break;
        case SortOrder.DESCENDING:
            th.setAttribute(AttributeName.tableHeader, AttributeName.cssDescending);
            break;
    }
    // if the current state is now the default one, then forget about this table
    if (tableState.sortOrder === SortOrder.DEFAULT) {
        tableStates.delete(table);
        th.removeAttribute(AttributeName.tableHeader);
    }
}
function sortTable(tableState, tableBody) {
    emptyTable(tableBody, tableState.defaultOrdering);
    if (tableState.sortOrder === SortOrder.DEFAULT) {
        fillTable(tableBody, tableState.defaultOrdering);
        return;
    }
    const xs = [...tableState.defaultOrdering];
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    xs.sort((a, b) => compareRows(a, b, tableState.columnIdx, tableState.sortOrder, collator));
    fillTable(tableBody, xs);
}
function resetTable(tableState, tableBody) {
    emptyTable(tableBody, tableState.defaultOrdering);
    fillTable(tableBody, tableState.defaultOrdering);
}
function compareRows(a, b, index, order, collator) {
    let valueA = valueFromCell(a.cells[index]);
    let valueB = valueFromCell(b.cells[index]);
    if (order === SortOrder.DESCENDING) {
        [valueA, valueB] = [valueB, valueA];
    }
    if (typeof valueA === "number" && typeof valueA === "number") {
        return valueA < valueB ? -1 : 1;
    }
    return collator.compare(valueA.toString(), valueB.toString());
}
function tryParseFloat(x) {
    const y = parseFloat(x);
    return isNaN(y) ? x : y;
}
function valueFromCell(element) {
    // TODO: extend to other data-types.
    return tryParseFloat(element.textContent);
}
function emptyTable(tableBody, rows) {
    rows.forEach(() => tableBody.deleteRow(-1));
}
function fillTable(tableBody, rows) {
    rows.forEach((row) => tableBody.appendChild(row));
}

class SortablePlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Sortable: loading plugin...");
            this.tableStates = new WeakMap();
            this.registerDomEvent(document, "click", (ev) => onHeadClick(ev, this.tableStates));
            console.log("Sortable: loaded plugin.");
        });
    }
    onunload() {
        // get all HTMLTableElements present in the map and reset their state
        const tables = Array.from(document.querySelectorAll("table"));
        for (const table of tables) {
            if (this.tableStates.has(table)) {
                const state = this.tableStates.get(table);
                resetTable(state, table.querySelector("tbody"));
                const th = table.querySelector(`thead th:nth-child(${state.columnIdx + 1})`);
                th.removeAttribute(AttributeName.tableHeader);
                this.tableStates.delete(table);
            }
        }
        delete this.tableStates;
        console.log("Sortable: unloaded plugin.");
    }
}

module.exports = SortablePlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zb3J0YWJsZS50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJ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
