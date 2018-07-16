var xhttp = new XMLHttpRequest()
var invoices

xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		invoices = JSON.parse(this.responseText)

		// displaying total no. of invoices
		document.getElementById('invoices').innerHTML +=
		`<li class="bold pad"><span class="bold waves-effect waves-teal">Invoices - ${invoices.length}</span></li>`

		// listing invoices
		var inv, color, active
		for (var i = 0; i < invoices.length; i++) {
			inv = invoices[i]

			if (inv.id === 1) {
				active = inv
				color = "grey darken-3"
			} else {
				color = "grey darken-4"
			}

			document.getElementById('invoices').innerHTML +=
			`<li id="${inv.id}" class="invoice-item collection-item ${color}">
			<span>INV. # - ${inv.id}</span><span class="right yellow-text">${inv.time}</span><br>
			<span>Items - ${inv.items.length}</span><br>
			<span class="red-text">${inv.name}</span>
			<span class="right">&#8377; ${inv.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
			</li>`
		}

		// search invoice
		document.getElementById("search").onkeydown = function() {
			input = document.getElementById("search");
			filter = input.value.toUpperCase();
			invoices = document.getElementsByClassName("invoice-item");
			for (i = 0; i < invoices.length; i++) {
				td = invoices[i]
				if (td) {
					if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
						td.style.display = "";
					} else {
						td.style.display = "none";
					}
				}
			}
		}

		showDet()

		function showDet(inv) {
			inv = inv || 0
			var active = invoices[inv]

			// display invoice details
			document.getElementById('active-invoice').innerHTML =
			`<div class="col m7">
			<span class="red-text">INVOICE</span>
			<p># INV${active.id}</p>
			<p>${active.time}</p>
			</div>
			<div class="col m3">
			<span class="red-text">CUSTOMER DETAILS</span>
			<p>${active.name.toUpperCase()}</p>
			<p>${active.email}</p>
			</div>
			<div class="col m2">
			<a onclick="window.print()" class="waves-effect waves-light btn"><i class="material-icons right">print</i>PRINT</a>
			</div>`

			// caluculations
			var subTotal = 0, tax = 0, discount = 0, grandTotal = 0, item

			document.getElementById('items').innerHTML = ""

			for (var j = 0; j < active.items.length; j++) {
				item = active.items[j]
				subTotal += item.price

				document.getElementById('items').innerHTML +=
				`<tr>
					<td>${item.name}</td>
					<td>${item.qty}</td>
					<td>${item.price}</td>
				</tr>`
			}

			// diplaying total, tax and discount
			document.getElementById("sub-total").innerHTML = Math.round(subTotal)
			document.getElementById("tax").innerHTML = tax = Math.round(0.1236*subTotal)
			document.getElementById("discount").innerHTML = discount = Math.round(subTotal/10)
			document.getElementById("grand-total").innerHTML = grandTotal = Math.round(subTotal+(tax-discount))

			// onclick of invoice
			var el = document.getElementsByClassName("invoice-item")
			for (var i=0; i<el.length; i++) {
				el[i].onclick = function () {
					showDet(Number(this.id)-1)

					document.querySelector(".darken-3").classList.add("darken-4")
					document.querySelector(".darken-3").classList.remove("darken-3")

					this.classList.add("darken-3")
					this.classList.remove("darken-4")
				}
			}
		}

		// on proceed or skip
		document.getElementById("skip").addEventListener('click', function() { showProdScreen("skip") })
		document.getElementById("proceed").addEventListener('click', function() { showProdScreen("proceed") })

		function showProdScreen(det) {
			var el1 = document.querySelectorAll(".cust-det")
			var el2 = document.querySelectorAll(".prod-det")

			if (det === "proceed") {
				// display customer data in product screen
				var newInv = {}
				newInv["full_name"] = document.querySelector("#full_name").value
				newInv["email"] = document.querySelector("#email").value
				newInv["phone"] = document.querySelector("#phone").value
				newInv["pin"] = document.querySelector("#pin").value

				document.querySelector(".customer .full_name").innerHTML = newInv.full_name
				document.querySelector(".customer .email").innerHTML = newInv.email

				var valid = document.getElementById("cust-form").checkValidity()

				if(valid === false) {
					 M.toast({html: 'Fill in all fields'})
					return
				}

				var items = []

				// onclick of add item
				document.getElementById("add").onclick = function() {
					var valid = document.getElementById("item-form").checkValidity()

					if(valid === false) {
						 M.toast({html: 'Fill in all fields'})
						return
					}
					else {
						items.push({
							"item": document.querySelector("#item").value,
							"qty": document.querySelector("#qty").value,
							"price": document.querySelector("#price").value
						})

						var subTotal = 0
						document.getElementById("new-item").innerHTML = ""

						for (var i = 0, that; i < items.length; i++) {
							that = items[i]
							subTotal += Number(that.price)
							document.getElementById("new-item").innerHTML +=
							`<td>${that.item}</td>
							<td>${that.qty}</td>
							<td>${that.price}</td>`
						}
						calc()

						// calculations
						function calc() {
							var tax = document.getElementById("tax1").value/100*subTotal
							var discount = document.getElementById("discount1").value/100*subTotal
							var rupee = "&#8377;"

							document.getElementById("sub-total1").innerHTML = rupee + Math.round(subTotal)
							document.getElementById("tax-footer").innerHTML = rupee + tax
							document.getElementById("discount-footer").innerHTML = rupee + discount
							document.getElementById("grand-total-footer").innerHTML = rupee + Math.round(subTotal+(tax-discount))
						}

						// on keypress of tax or discount
						document.getElementById("tax1").onkeydown = function() {
							calc()
						}
						document.getElementById("discount1").onkeydown = function() {
							calc()
						}
					}
				}
			}

			for (var i = 0; i < el1.length; i++) {
				el1[i].style.display = "none"
			}
			for (var i = 0; i < el2.length; i++) {
				el2[i].style.display = "block"
			}
		}

		// go back to edit customer details
		document.getElementById("edit").onclick = function() {
			var el1 = document.querySelectorAll(".cust-det")
			var el2 = document.querySelectorAll(".prod-det")

			for (var i = 0; i < el1.length; i++) {
				el1[i].style.display = "block"
			}
			for (var i = 0; i < el2.length; i++) {
				el2[i].style.display = "none"
			}
		}
	}
}

xhttp.open("GET", "/invoices", true)
xhttp.send()