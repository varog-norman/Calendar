var module = (function() {	

	'use strict';

	function ge(elem) {
		return typeof(elem) === 'string' ? document.getElementById(elem) : elem;
	}

	window.addEventListener('load', handler);

	function handler() {
		ge('table-main').addEventListener('click', daySelection);
		ge('table-main').addEventListener('mouseover', daySelectionMouseOver);
		ge('table-main').addEventListener('mouseout', daySelectionMouseOut);
		ge('table-main').addEventListener('mousedown', disableTextHighlighting);
		ge('prev').addEventListener('click', setPreviousMonth);
		ge('prev').addEventListener('mousedown', disableTextHighlighting);
		ge('next').addEventListener('click', setNextMonth);
		ge('next').addEventListener('mousedown', disableTextHighlighting);
		setCurrentDate();
	}

	function setCurrentDate() {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		buildTable(year, month, day, false);
	}

	function setPreviousMonth(callback) {
		clearTable();
		var d = new Date(ge('currentYear').value, ge('currentMonth').value);

		if(d.getMonth() == 0) {
			d.setFullYear(parseInt(ge('currentYear').value) - 1);
			d.setMonth(11);
		} else {
			d.setMonth(parseInt(ge('currentMonth').value) - 1);
		}

		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		buildTable(year, month, day, false);
		typeof callback === 'function' ? callback() : callback;
	}

	function setNextMonth(callback) {
		clearTable();
		var d = new Date(ge('currentYear').value, ge('currentMonth').value);

		if(d.getMonth() == 11) {
			d.setFullYear(parseInt(ge('currentYear').value) + 1);
			d.setMonth(0);
		} else {
			d.setMonth(parseInt(ge('currentMonth').value) + 1);
		}

		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		buildTable(year, month, day, false);
		typeof callback === 'function' ? callback() : callback;
	}

	function buildTable(ye, mo, da, flag) {
		var massOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		ge('currentDate').innerHTML = `${massOfMonths[mo]} ${ye}`;
		ge('currentMonth').value = mo;
		ge('currentYear').value = ye;
		var dd = new Date();
		var d = new Date(ye, mo, da);
		d.setDate(1);

		var newElem = document.createElement('tbody');
		var table = '<tr>'

		var neighborMonths = getNeighborMonth();
		var countLeftSide = 0;

		for(var i = 0; i < d.getDay(); i++) {
			countLeftSide++;
		}

		for(var i = countLeftSide; i >= 1; i--) {
			table += `<td class='opacityDate'>${neighborMonths[0][neighborMonths[0].length-i]}</td>`;
		}

		while(d.getMonth() == mo) {

			if(arguments[3] && d.getDate() == arguments[2]) {
				table += `<td class='selected'>${d.getDate()}</td>`;
				if(d.getDay() == 6) {
					table += '</tr><tr>';
				}
			} else {
				if(d.getDate() == dd.getDate() && d.getMonth() == dd.getMonth() && d.getFullYear() == dd.getFullYear()) {
					table += `<td class='selected'>${d.getDate()}</td>`;
				} else {
					table += `<td>${d.getDate()}</td>`;
				}

				if(d.getDay() == 6) {
					table += '</tr><tr>';
				}
			}

			d.setDate(d.getDate() + 1);
		}

		if(d.getDay != 6) {
			for(var i = d.getDay(), countRightSide = 0; i < 7; i++) {
				table += `<td class='opacityDate'>${neighborMonths[1][countRightSide]}</td>`;
				countRightSide++;
			}
		}

		table += `</tr>`;
		newElem.innerHTML = table;
		ge('table-main').appendChild(newElem);
	}

	function getNeighborMonth() {
		var month = parseInt(ge('currentMonth').value);
		var year = parseInt(ge('currentYear').value);
		if(month == 0) {
			var d = new Date(year--, 11);
		} else {
			d = new Date(year, month--);
		}

		var leftSide = [];
		d.setDate(1);
		d.setMonth(month);
		while(d.getMonth() == month) {
			leftSide.push(d.getDate());
			d.setDate(d.getDate() + 1);
		}

		var month = parseInt(ge('currentMonth').value);
		var year = parseInt(ge('currentYear').value);
		if(month == 11) {
			d = new Date(year++, 0);
		} else {
			d = new Date(year, month++);
		}
		var rightSide = [];
		d.setDate(1);
		d.setMonth(month);
		while(d.getMonth() == month) {
			rightSide.push(d.getDate());
			d.setDate(d.getDate() + 1);
		}

		return [leftSide, rightSide];
	}

	function daySelection(e) {
		clearTableSelection();
		if(e.target.classList.contains('mouse-over')) {
			e.target.classList.remove('mouse-over');
		}
		e.target.classList.toggle('selected');

		if(e.target.classList.contains('opacityDate')) {
			var nextDate = parseInt(e.target.textContent);
			if(nextDate > 15 && nextDate <= 31) {
				setPreviousMonth(function() {
					clearTableSelection();
					var elems = document.getElementsByTagName('td'); 
					for(var i = 0; i < elems.length; i++) { 
						if(elems[i].textContent == nextDate) { 
							elems[i].classList.toggle('selected');
							break; 
						}
					}
				});
			} else if(nextDate >= 1 && nextDate <= 15) {
				setNextMonth(function() {
					clearTableSelection();
					var elems = document.getElementsByTagName('td'); 
					for(var i = 0; i < elems.length; i++) { 
						if(elems[i].textContent == nextDate) { 
							elems[i].classList.toggle('selected');
							break; 
						}
					}
				});
			}
		}
	}

	function daySelectionMouseOver(e) {
		if(!e.target.classList.contains('selected')) {
			e.target.classList.toggle('mouse-over');
		}
	}

	function daySelectionMouseOut(e) {
		if(document.querySelector('.mouse-over')) {
			var elem = ge('content').querySelector('.mouse-over');
			elem.classList.remove('mouse-over');
		}
	}

	function disableTextHighlighting(e) {
		e.preventDefault();
	}

	function clearTableSelection() {
		if(document.querySelector('.selected')) {
			var elem = ge('content').querySelector('.selected');
			elem.classList.remove('selected');
		}
	}

	function clearTable() {
		clearTableSelection();
		ge('table-main').innerHTML = '';
	}

	//---------- API (Use it in console. Call `module.setNewDate({$year}, {$month}, {$day})` ) 

	function setNewDate(y, m, d) {
		var d = new Date(y, m, d);
		clearTable();
		buildTable(d.getFullYear(), d.getMonth(), d.getDate(), true);
	}

	//----------

	return {
		setNewDate : setNewDate
	}
})();